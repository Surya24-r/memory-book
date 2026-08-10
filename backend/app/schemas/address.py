from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime


class AddressCreate(BaseModel):
    design_id: UUID
    full_name: str
    phone: str
    area: Optional[str] = None
    pincode: str
    landmark: Optional[str] = None
    house_street: str
    is_default: bool = False


class AddressOut(AddressCreate):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True