from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, computed_field


class ImageShort(BaseModel):
    link: str
    model_config = ConfigDict(from_attributes=True)


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
    image: Optional[ImageShort] = None

    model_config = ConfigDict(from_attributes=True)

    @computed_field
    @property
    def image_url(self) -> Optional[str]:
        return self.image.link if self.image else None


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