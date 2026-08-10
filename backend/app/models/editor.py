from sqlalchemy import Column, String, DateTime, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class AlbumDraft(Base):
    __tablename__ = "album_drafts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    design_id = Column(UUID(as_uuid=True), unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    theme_id = Column(String, default="1")
    spreads_data = Column(JSON, nullable=False)
    title = Column(String, default="Untitled Book")
    status = Column(String, nullable=False, default="draft")
    is_saved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())