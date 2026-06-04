from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class DryCleanerBase(BaseModel):
    city: str = Field
    street: str = Field
    house_number: Optional[str] = Field(None)
    latitude: Decimal = Field(..., max_digits=9, decimal_places=6)
    longitude: Decimal = Field(..., max_digits=9, decimal_places=6)
    phone_number: str


class DryCleanerCreate(DryCleanerBase):
    pass


class DryCleanerUpdate(BaseModel):
    city: Optional[str] = Field(None)
    street: Optional[str] = Field(None)
    house_number: Optional[str] = Field(None)
    latitude: Optional[Decimal] = Field(None, max_digits=9, decimal_places=6)
    longitude: Optional[Decimal] = Field(None, max_digits=9, decimal_places=6)
    phone_number: Optional[str] = Field(None)


class DryCleanerRead(DryCleanerBase):
    model_config = ConfigDict(from_attributes=True)

    id: int