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
    id: int
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[Decimal] = None
    duration: Optional[int] = None
    description: Optional[str] = None
    rating: Optional[Decimal] = None
    category_id: Optional[int] = None
    dry_cleaner_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class ServiceShort(BaseModel):
    id: int
    name: str
    price: Decimal

    model_config = ConfigDict(from_attributes=True)