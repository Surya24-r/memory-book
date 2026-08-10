import uuid
from fastapi import UploadFile, HTTPException, status
from app.core.database import supabase_client as supabase

BUCKET_NAME = "raw-uploads"

async def upload_image_to_supabase(file: UploadFile) -> tuple[str, str]:
    """
    Uploads file to Supabase Storage bucket and returns (storage_path, public_url).
    """
    try:
        original_name = file.filename or "image.jpg"
        file_extension = original_name.split(".")[-1] if "." in original_name else "jpg"
        
        # Unique file name to prevent accidental overwrites
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        storage_path = f"photos/{unique_filename}"

        contents = await file.read()

        # Upload binary stream
        supabase.storage.from_(BUCKET_NAME).upload(
            path=storage_path,
            file=contents,
            file_options={"content-type": file.content_type or "image/jpeg"}
        )

        # Get public URL
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)

        return storage_path, public_url

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file to Supabase Storage: {str(e)}"
        )