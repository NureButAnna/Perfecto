from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator, ConfigDict, Field


class UserRole(str, Enum):
    USER = "клієнт"
    ADMIN = "адміністратор"
    COURIER = "кур'єр"
    CHIEF = "керівник"

class UserBase(BaseModel):
    name: str
    surname: str
    patronymic: Optional[str] = None
    email: EmailStr
    phone_number: str
    is_active: bool = True


    model_config = ConfigDict(from_attributes=True)

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserRegister(UserBase):
    password: str = Field(min_length=4)
    role: str

class UserInDB(UserBase):
    password: str
    role: str

class UserRead(UserBase):
    id: int
    role: str
    dry_cleaner_id: Optional[int] = None

class UserRoleUpdate(BaseModel):
    role: UserRole
    dry_cleaner_id: Optional[int] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, max_length=15)
    password: Optional[str] = Field(None, min_length=4)
    is_active: Optional[bool] = None
    dry_cleaner_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

