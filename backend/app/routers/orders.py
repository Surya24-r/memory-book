from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.core.auth import get_current_user_id
from app.schemas.order import (
    OrderCreate, OrderPay, OrderOut, OrderDetailOut,
    OrderStatusUpdate, OrderListItem,
)
from app.services import order_service

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("", response_model=OrderOut)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    return order_service.create_order(db, payload, current_user_id)


@router.post("/{order_id}/pay", response_model=OrderOut)
def pay_order(
    order_id: UUID,
    payload: OrderPay,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    order = order_service.mark_order_paid(db, order_id, payload.payment_method, current_user_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/{order_id}/status", response_model=OrderOut)
def set_order_status(
    order_id: UUID,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    order = order_service.update_order_status(db, order_id, payload.status, current_user_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("", response_model=list[OrderListItem])
def list_orders(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    return order_service.list_paid_orders(db, current_user_id)


@router.get("/{order_id}", response_model=OrderDetailOut)
def fetch_order(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    order, address = order_service.get_order_with_address(db, order_id, current_user_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return OrderDetailOut(
        **OrderOut.model_validate(order).model_dump(),
        address_name=address.full_name if address else None,
        address_phone=address.phone if address else None,
    )


@router.delete("/{order_id}")
def remove_order(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
):
    deleted = order_service.delete_order(db, order_id, current_user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"deleted": True}