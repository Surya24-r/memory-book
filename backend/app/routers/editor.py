from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from app.core.database import get_db
from app.core.auth import get_current_user_id
from app.models.editor import AlbumDraft
from app.schemas.editor import DraftPayload, DraftResponse, DraftListItem
from app.services.editor_service import EditorService

router = APIRouter(prefix="/editor", tags=["editor"])

@router.get("/drafts", response_model=List[DraftListItem])
def list_drafts(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    try:
        return EditorService.get_all_drafts(db, current_user_id)
    except Exception as e:
        print(f"Error fetching drafts: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch drafts: {str(e)}")

@router.get("/load/{design_id}")
def load_draft(
    design_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    try:
        draft = (
            db.query(AlbumDraft)
            .filter(AlbumDraft.design_id == design_id, AlbumDraft.user_id == current_user_id)
            .first()
        )
        if not draft:
            return {
                "design_id": str(design_id),
                "theme_id": "1",
                "title": "Untitled Book",
                "spreads_data": {"spreads": [], "unplaced": [], "deletedPhotoIds": [], "cover": {}}
            }
        return {
            "design_id": str(draft.design_id),
            "theme_id": draft.theme_id,
            "title": draft.title or "Untitled Book",
            "spreads_data": draft.spreads_data
        }
    except Exception as e:
        print(f"Error loading draft: {e}")
        raise HTTPException(status_code=500, detail="Failed to load draft")

@router.post("/autosave/{design_id}")
def autosave_draft(
    design_id: UUID,
    payload: DraftPayload,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    try:
        EditorService.save_editor_draft(db, design_id, payload, current_user_id)
        return {"status": "success", "message": "Auto-saved"}
    except Exception as e:
        print(f"Auto-save error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to auto-save: {str(e)}")

@router.post("/save/{design_id}")
def save_draft(
    design_id: UUID,
    payload: DraftPayload,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    try:
        EditorService.save_editor_draft_explicit(db, design_id, payload, current_user_id)
        return {"status": "success", "message": "Draft saved successfully", "design_id": str(design_id)}
    except Exception as e:
        print(f"Save error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to save draft: {str(e)}")