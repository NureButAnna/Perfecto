from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator, ConfigDict


class UserBase(BaseModel):
    name: str
    surname: str
    patronymic: Optional[str] = None

    password: str

    @field_validator('password')
    def check_password(cls, value):
        if len(value) < 6:
            raise ValueError(
                'Пароль має містити мінімум 6 символів'
            )
        return value

    email: EmailStr
    phone_number: str

    model_config = ConfigDict(from_attributes=True)

class UserRegister(UserBase):
    pass

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ClientRead(UserBase):
    client_id: int
    model_config = ConfigDict(from_attributes=True)