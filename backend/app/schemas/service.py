from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ServiceBase(BaseModel):
    name: str
    price: Decimal
    duration: int
    description: str
    rating: Optional[Decimal] = None
    category_id: Optional[int] = None
    dry_cleaner_id: int
    model_config = ConfigDict(from_attributes=True)


class ServiceCreate(ServiceBase):
    pass


class ServiceRead(ServiceBase):
    service_id: int
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)