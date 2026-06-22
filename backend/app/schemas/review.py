from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class UserShort(BaseModel):
    id: int
    name: str
    surname: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ServiceShort(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class ReviewCreate(BaseModel):
    text: str
    service_id: int
    rating: int = Field(..., ge=1, le=5)

    model_config = ConfigDict(from_attributes=True)


class ReviewRead(BaseModel):
    id: int
    text: Optional[str]
    date: datetime
    rating: int
    service_id: int
    user_id: int
    user: Optional[UserShort] = None
    service: Optional[ServiceShort] = None

    model_config = ConfigDict(from_attributes=True)


class ReviewUpdate(BaseModel):
    text: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    service_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)