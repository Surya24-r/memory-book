import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(
        String, unique=True, nullable=False,
        server_default=text("generate_order_number()"),
    )
    design_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    address_id = Column(UUID(as_uuid=True), ForeignKey("addresses.id"), nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    amount = Column(Integer, nullable=False)
    payment_method = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")
    paid_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())