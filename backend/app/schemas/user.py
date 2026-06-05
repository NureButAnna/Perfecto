from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator, ConfigDict, Field


class UserBase(BaseModel):
    name: str
    surname: str
    patronymic: Optional[str] = None
    email: EmailStr
    phone_number: str

    model_config = ConfigDict(from_attributes=True)

class UserRegister(UserBase):
    password: str = Field(min_length=4)
    role: str

class UserInDB(UserBase):
    password: str
    role: str

class UserRead(UserBase):
    id: int
    role: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, max_length=15)
    password: Optional[str] = Field(None, min_length=4)
    role: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class UserRole(str, Enum):
    USER = "клієнт"
    ADMIN = "адміністратор"
    COURIER = "кур'єр"
    CHIEF = "керівник"