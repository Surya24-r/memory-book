from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.auth import require_admin
from app.schemas.order import OrderListItemAdmin
from app.schemas.editor import DraftListItemAdmin
from app.services import order_service
from app.services.editor_service import EditorService

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/orders", response_model=List[OrderListItemAdmin])
def list_all_orders(
    db: Session = Depends(get_db),
    _: str = Depends(require_admin),
):
    return order_service.list_all_orders_admin(db)


@router.get("/drafts", response_model=List[DraftListItemAdmin])
def list_all_drafts(
    db: Session = Depends(get_db),
    _: str = Depends(require_admin),
):
    return EditorService.get_all_drafts_admin(db)