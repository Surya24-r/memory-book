from pydantic import BaseModel
from uuid import UUID
from typing import Optional, Literal
from datetime import datetime

PaymentMethod = Literal["gpay", "phonepe", "paytm", "card", "netbanking"]
OrderStatus = Literal["pending", "paid", "printing", "dispatched", "delivered", "failed"]


class OrderCreate(BaseModel):
    design_id: UUID
    address_id: UUID
    quantity: int = 1
    amount: int


class OrderPay(BaseModel):
    payment_method: PaymentMethod


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderOut(BaseModel):
    id: UUID
    order_number: str
    design_id: UUID
    address_id: Optional[UUID]
    quantity: int
    amount: int
    payment_method: Optional[str]
    status: str
    paid_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class OrderDetailOut(OrderOut):
    address_name: Optional[str] = None
    address_phone: Optional[str] = None


class OrderListItem(BaseModel):
    id: UUID
    order_number: str
    design_id: UUID
    title: str = "Untitled Book"
    thumbnail_url: Optional[str] = None
    amount: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class OrderListItemAdmin(OrderListItem):
    user_id: Optional[UUID] = None
    customer_email: Optional[str] = None