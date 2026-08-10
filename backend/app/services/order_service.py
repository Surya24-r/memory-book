from sqlalchemy.orm import Session
from sqlalchemy import text
from uuid import UUID
from datetime import datetime, timezone
from app.models.order import Order
from app.schemas.order import OrderCreate
from app.services.address_service import get_address


def create_order(db: Session, payload: OrderCreate, user_id: str) -> Order:
    order = Order(
        design_id=payload.design_id,
        address_id=payload.address_id,
        quantity=payload.quantity,
        amount=payload.amount,
        status="pending",
        user_id=user_id,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def mark_order_paid(db: Session, order_id: UUID, payment_method: str, user_id: str):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        return None
    order.payment_method = payment_method
    order.status = "paid"
    order.paid_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(order)
    return order


def update_order_status(db: Session, order_id: UUID, status: str, user_id: str):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        return None
    order.status = status
    db.commit()
    db.refresh(order)
    return order


def get_order_with_address(db: Session, order_id: UUID, user_id: str):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        return None, None
    address = get_address(db, order.address_id, user_id) if order.address_id else None
    return order, address


def delete_order(db: Session, order_id: UUID, user_id: str) -> bool:
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        return False
    db.delete(order)
    db.commit()
    return True


def list_paid_orders(db: Session, user_id: str):
    rows = db.execute(
        text("""
            SELECT
                o.id, o.order_number, o.design_id,
                COALESCE(ad.title, 'Untitled Book') AS title,
                COALESCE(
                    ad.spreads_data #>> '{cover,front,photos,0,url}',
                    (SELECT up.file_url FROM uploaded_photos up
                     WHERE up.design_id = o.design_id
                     ORDER BY up.created_at ASC LIMIT 1)
                ) AS thumbnail_url,
                o.amount, o.status, o.created_at
            FROM orders o
            LEFT JOIN album_drafts ad ON ad.design_id = o.design_id
            WHERE o.status != 'pending' AND o.user_id = :user_id
            ORDER BY o.created_at DESC
        """),
        {"user_id": user_id},
    ).mappings().all()
    return rows


def list_all_orders_admin(db: Session):
    """Admin view: every order across every user, regardless of status, with customer email."""
    rows = db.execute(
        text("""
            SELECT
                o.id, o.order_number, o.design_id, o.user_id,
                COALESCE(ad.title, 'Untitled Book') AS title,
                COALESCE(
                    ad.spreads_data #>> '{cover,front,photos,0,url}',
                    (SELECT up.file_url FROM uploaded_photos up
                     WHERE up.design_id = o.design_id
                     ORDER BY up.created_at ASC LIMIT 1)
                ) AS thumbnail_url,
                o.amount, o.status, o.created_at,
                au.email AS customer_email
            FROM orders o
            LEFT JOIN album_drafts ad ON ad.design_id = o.design_id
            LEFT JOIN auth.users au ON au.id = o.user_id
            ORDER BY o.created_at DESC
        """)
    ).mappings().all()
    return rows