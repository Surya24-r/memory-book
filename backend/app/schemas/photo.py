from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class PhotoUploadResponse(BaseModel):
    id: UUID
    design_id: UUID
    file_url: str
    file_name: str
    width: Optional[int] = None
    height: Optional[int] = None
    dpi_warning: bool
    created_at: datetime

    class Config:
        from_attributes = True