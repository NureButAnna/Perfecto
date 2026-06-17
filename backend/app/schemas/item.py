from typing import Optional

from pydantic import BaseModel, ConfigDict

class ItemCreate(BaseModel):
    name: str
    state: Optional[str] = None
    description: Optional[str] = None
    order_id: int


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    description: Optional[str] = None
    order_id: Optional[int] = None


class ItemRead(BaseModel):
    id: int
    name: str
    state: Optional[str] = None
    description: Optional[str] = None
    order_id: Optional[int] = None


    model_config = ConfigDict(from_attributes=True)