from sqlalchemy.orm import Session
from uuid import UUID
from app.models.address import Address
from app.schemas.address import AddressCreate


def create_address(db: Session, payload: AddressCreate, user_id: str) -> Address:
    address = Address(**payload.dict(), user_id=user_id)
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


def get_addresses_for_design(db: Session, design_id: UUID, user_id: str):
    return (
        db.query(Address)
        .filter(Address.design_id == design_id, Address.user_id == user_id)
        .order_by(Address.created_at.desc())
        .all()
    )


def get_address(db: Session, address_id: UUID, user_id: str):
    return (
        db.query(Address)
        .filter(Address.id == address_id, Address.user_id == user_id)
        .first()
    )


def delete_address(db: Session, address_id: UUID, user_id: str):
    address = get_address(db, address_id, user_id)
    if address:
        db.delete(address)
        db.commit()
    return address