import os
from typing import List, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session
from supabase import create_client, Client

from app.models.photo import UploadedPhoto
from app.models.editor import AlbumDraft
from app.schemas.editor import DraftPayload

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
BUCKET_NAME = os.getenv("SUPABASE_STORAGE_BUCKET", "raw-uploads")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY else None

class EditorService:
    @staticmethod
    def load_editor_state(db: Session, design_id: UUID, user_id: str) -> Dict[str, Any]:
        photos = (
            db.query(UploadedPhoto)
            .filter(UploadedPhoto.design_id == design_id, UploadedPhoto.user_id == user_id)
            .all()
        )
        draft = (
            db.query(AlbumDraft)
            .filter(AlbumDraft.design_id == design_id, AlbumDraft.user_id == user_id)
            .first()
        )

        return {
            "photos": [
                {
                    "id": str(p.id),
                    "url": p.file_url,
                    "preview": p.file_url,
                    "file_url": p.file_url,
                    "width": getattr(p, "width", 600) or 600,
                    "height": getattr(p, "height", 450) or 450,
                }
                for p in photos
            ],
            "draft": {
                "theme_id": draft.theme_id if draft else "1",
                "title": draft.title if draft else "Untitled Book",
                "spreads_data": draft.spreads_data if draft else None,
            } if draft else None
        }

    @staticmethod
    def save_editor_draft(db: Session, design_id: UUID, payload: DraftPayload, user_id: str) -> Dict[str, str]:
        """AUTO-SAVE: updates draft but does NOT mark as saved.
        Uses INSERT ... ON CONFLICT to stay safe against near-simultaneous
        autosave requests racing each other for the same design_id."""
        from sqlalchemy.dialects.postgresql import insert as pg_insert

        stmt = pg_insert(AlbumDraft).values(
            design_id=design_id,
            user_id=user_id,
            theme_id=payload.theme_id,
            title=payload.title or "Untitled Book",
            spreads_data=payload.spreads_data,
            is_saved=False,
        )
        update_cols = {
            "theme_id": stmt.excluded.theme_id,
            "spreads_data": stmt.excluded.spreads_data,
        }
        if payload.title:
            update_cols["title"] = stmt.excluded.title

        stmt = stmt.on_conflict_do_update(
            index_elements=["design_id"],
            set_=update_cols,
        )

        db.execute(stmt)
        db.commit()
        return {"message": "Draft auto-saved"}

    @staticmethod
    def save_editor_draft_explicit(db: Session, design_id: UUID, payload: DraftPayload, user_id: str) -> Dict[str, str]:
        """EXPLICIT SAVE: marks draft as saved"""
        draft = (
            db.query(AlbumDraft)
            .filter(AlbumDraft.design_id == design_id, AlbumDraft.user_id == user_id)
            .first()
        )

        if not draft:
            draft = AlbumDraft(
                design_id=design_id,
                user_id=user_id,
                theme_id=payload.theme_id,
                title=payload.title or "Untitled Book",
                spreads_data=payload.spreads_data,
                is_saved=True,
            )
            db.add(draft)
        else:
            draft.theme_id = payload.theme_id
            if payload.title:
                draft.title = payload.title
            draft.spreads_data = payload.spreads_data
            draft.is_saved = True

        db.commit()
        return {"message": "Draft saved successfully"}

    @staticmethod
    def cleanup_storage_photos(photo_urls: List[str]) -> Dict[str, Any]:
        if not photo_urls or not supabase:
            return {"status": "success", "deleted_count": 0}

        file_paths_to_delete = []
        marker = f"/storage/v1/object/public/{BUCKET_NAME}/"

        for url in photo_urls:
            if marker in url:
                path = url.split(marker)[-1]
                file_paths_to_delete.append(path)

        if not file_paths_to_delete:
            return {"status": "success", "deleted_count": 0, "message": "No matching bucket paths found."}

        res = supabase.storage.from_(BUCKET_NAME).remove(file_paths_to_delete)
        return {
            "status": "success",
            "deleted_count": len(file_paths_to_delete),
            "deleted_paths": file_paths_to_delete,
            "supabase_response": res,
        }

    @staticmethod
    def get_all_drafts(db: Session, user_id: str) -> List[Dict[str, Any]]:
        """Get only this user's EXPLICITLY SAVED drafts"""
        drafts = (
            db.query(AlbumDraft)
            .filter(
                AlbumDraft.status == "draft",
                AlbumDraft.is_saved == True,
                AlbumDraft.user_id == user_id,
            )
            .order_by(AlbumDraft.updated_at.desc())
            .all()
        )

        results = []
        for d in drafts:
            data = d.spreads_data or {}
            spreads = data.get("spreads", [])
            cover = data.get("cover", {})
            unplaced = data.get("unplaced", [])

            photo_count = len(unplaced)
            thumbnail_url = None

            front_photos = (cover.get("front") or {}).get("photos", [])
            if front_photos:
                thumbnail_url = front_photos[0].get("url")
                photo_count += len(front_photos)

            back_photos = (cover.get("back") or {}).get("photos", [])
            photo_count += len(back_photos)

            for spread in spreads:
                left_photos = (spread.get("left") or {}).get("photos", [])
                right_photos = (spread.get("right") or {}).get("photos", [])
                photo_count += len(left_photos) + len(right_photos)
                if not thumbnail_url:
                    if left_photos:
                        thumbnail_url = left_photos[0].get("url")
                    elif right_photos:
                        thumbnail_url = right_photos[0].get("url")

            results.append({
                "design_id": d.design_id,
                "title": d.title or "Untitled Book",
                "theme_id": d.theme_id,
                "status": d.status,
                "photo_count": photo_count,
                "thumbnail_url": thumbnail_url,
                "updated_at": d.updated_at,
            })

        return results

    @staticmethod
    def get_all_drafts_admin(db: Session) -> List[Dict[str, Any]]:
        """Admin view: every EXPLICITLY SAVED draft across every user"""
        drafts = (
            db.query(AlbumDraft)
            .filter(
                AlbumDraft.status == "draft",
                AlbumDraft.is_saved == True,
            )
            .order_by(AlbumDraft.updated_at.desc())
            .all()
        )

        results = []
        for d in drafts:
            data = d.spreads_data or {}
            spreads = data.get("spreads", [])
            cover = data.get("cover", {})
            unplaced = data.get("unplaced", [])

            photo_count = len(unplaced)
            thumbnail_url = None

            front_photos = (cover.get("front") or {}).get("photos", [])
            if front_photos:
                thumbnail_url = front_photos[0].get("url")
                photo_count += len(front_photos)

            back_photos = (cover.get("back") or {}).get("photos", [])
            photo_count += len(back_photos)

            for spread in spreads:
                left_photos = (spread.get("left") or {}).get("photos", [])
                right_photos = (spread.get("right") or {}).get("photos", [])
                photo_count += len(left_photos) + len(right_photos)
                if not thumbnail_url:
                    if left_photos:
                        thumbnail_url = left_photos[0].get("url")
                    elif right_photos:
                        thumbnail_url = right_photos[0].get("url")

            results.append({
                "design_id": d.design_id,
                "user_id": d.user_id,
                "title": d.title or "Untitled Book",
                "theme_id": d.theme_id,
                "status": d.status,
                "photo_count": photo_count,
                "thumbnail_url": thumbnail_url,
                "updated_at": d.updated_at,
            })

        return results