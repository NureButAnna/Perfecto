from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class DeliveryBase(BaseModel):
    delivery_type: str
    city: str
    street: Optional[str] = None
    house_number: Optional[str] = None
    flat_number: Optional[str] = None
    nova_poshta_branch: Optional[str] = None
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
    delivery_type: Optional[str] = None

    city: Optional[str] = None

    street: Optional[str] = None
    house_number: Optional[str] = None
    flat_number: Optional[str] = None

    nova_poshta_branch: Optional[str] = None

    delivery_datetime: Optional[datetime] = None

    user_id: Optional[int] = None
    order_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class DeliveryShort(BaseModel):
    delivery_type: str
    city: Optional[str] = None
    nova_poshta_branch: Optional[str] = None
    user_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)