from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime

class DraftPayload(BaseModel):
    theme_id: Optional[str] = "1"
    title: Optional[str] = "Untitled Book"
    spreads_data: Dict[str, Any]

class CleanupPhotosRequest(BaseModel):
    photo_urls: List[str]

class PhotoResponse(BaseModel):
    id: str
    url: str
    width: int = 600
    height: int = 450

class DraftResponse(BaseModel):
    design_id: UUID
    theme_id: str
    title: str
    spreads_data: Optional[Dict[str, Any]] = None

class EditorLoadResponse(BaseModel):
    photos: List[PhotoResponse]
    draft: Optional[DraftResponse] = None

    class Config:
        from_attributes = True

class DraftListItem(BaseModel):
    design_id: UUID
    title: str
    theme_id: str
    status: str
    photo_count: int
    thumbnail_url: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True

class DraftListItemAdmin(DraftListItem):
    user_id: Optional[UUID] = None