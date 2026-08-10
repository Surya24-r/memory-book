from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.auth import get_current_user_id
from app.schemas.address import AddressCreate, AddressOut
from app.services import address_service

router = APIRouter(prefix="/addresses", tags=["addresses"])


@router.post("", response_model=AddressOut)
def save_address(
    payload: AddressCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    return address_service.create_address(db, payload, current_user_id)


@router.get("/{design_id}", response_model=list[AddressOut])
def list_addresses(
    design_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    return address_service.get_addresses_for_design(db, design_id, current_user_id)


@router.delete("/{address_id}")
def remove_address(
    address_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    address = address_service.delete_address(db, address_id, current_user_id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    return {"deleted": True}