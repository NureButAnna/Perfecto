from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class DeliveryBase(BaseModel):
    city: str
    street: str
    house_number: str
    flat_number: Optional[str] = None
    delivery_datetime: datetime

    model_config = ConfigDict(from_attributes=True)


class DeliveryCreate(DeliveryBase):
    user_id: int
    order_id: int


class DeliveryRead(DeliveryBase):
    id: int
    user_id: Optional[int] = None
    order_id: int

    model_config = ConfigDict(from_attributes=True)


class DeliveryUpdate(BaseModel):
    city: Optional[str] = None
    street: Optional[str] = None
    house_number: Optional[str] = None
    flat_number: Optional[str] = None
    delivery_datetime: Optional[datetime] = None
    status: Optional[str] = None
    user_id: Optional[int] = None
    order_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)