from decimal import Decimal
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

from app.schemas.order_service import OrderServiceCreate, OrderServiceRead
from app.schemas.delivery import DeliveryCreate, DeliveryRead


class CheckoutCreate(BaseModel):
    user_id: int
    dry_cleaner_id: int

    payment_method: str
    comment: Optional[str] = None
    order_services: list[OrderServiceCreate]
    delivery: DeliveryCreate


class CheckoutRead(BaseModel):
    order_id: int
    status: str
    total_cost: Decimal
    creation_date: datetime
    order_services: list[OrderServiceRead]
    delivery: DeliveryRead