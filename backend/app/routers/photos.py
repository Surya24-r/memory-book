from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, List

from app.core.database import get_db
from app.core.auth import get_current_user_id
from app.models.photo import UploadedPhoto
from app.schemas.photo import PhotoUploadResponse
from app.services.storage import upload_image_to_supabase

router = APIRouter(prefix="/photos", tags=["Photos"])

@router.post("/upload", response_model=PhotoUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_photo(
    design_id: UUID = Form(...),
    file: UploadFile = File(...),
    width: Optional[int] = Form(None),
    height: Optional[int] = Form(None),
    dpi_warning: bool = Form(False),
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file must be an image.")

    storage_path, public_url = await upload_image_to_supabase(file)

    new_photo = UploadedPhoto(
        design_id=design_id,
        user_id=current_user_id,
        file_url=public_url,
        file_name=storage_path,
        width=width,
        height=height,
        dpi_warning=dpi_warning,
    )

    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)

    return new_photo

@router.get("/{design_id}", response_model=List[PhotoUploadResponse])
def get_photos_by_design(
    design_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    return (
        db.query(UploadedPhoto)
        .filter(UploadedPhoto.design_id == design_id, UploadedPhoto.user_id == current_user_id)
        .all()
    )

@router.delete("/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_photo(
    photo_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    photo = (
        db.query(UploadedPhoto)
        .filter(UploadedPhoto.id == photo_id, UploadedPhoto.user_id == current_user_id)
        .first()
    )
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    if photo.file_name:
        try:
            from app.services.storage import supabase, BUCKET_NAME
            supabase.storage.from_(BUCKET_NAME).remove([photo.file_name])
        except Exception as e:
            print(f"Failed to remove file from Supabase storage: {e}")

    db.delete(photo)
    db.commit()
    return None