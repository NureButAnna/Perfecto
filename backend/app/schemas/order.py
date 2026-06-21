from datetime import datetime
from decimal import Decimal
from typing import Optional
from app.schemas.order_service import OrderServiceRead, OrderServiceCreate

from pydantic import BaseModel, ConfigDict

class OrderBase(BaseModel):
    total_cost: Decimal
    creation_date: datetime
    status: str
    user_id: int
    dry_cleaner_id: int

    payment_method: Optional[str] = None
    comment: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    user_id: int
    dry_cleaner_id: int

    payment_method: str
    comment: Optional[str] = None

    order_services: list[OrderServiceCreate]

class OrderRead(BaseModel):
    id: int

    total_cost: Decimal
    creation_date: datetime
    status: str

    payment_method: Optional[str] = None
    comment: Optional[str] = None

    user_id: int
    dry_cleaner_id: int

    order_services: list[OrderServiceRead] = []

    model_config = ConfigDict(from_attributes=True)

class OrderUpdate(BaseModel):
    total_cost: Optional[Decimal] = None
    status: Optional[str] = None

    payment_method: Optional[str] = None
    comment: Optional[str] = None

    dry_cleaner_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)





