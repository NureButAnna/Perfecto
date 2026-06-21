import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ImageBase(BaseModel):
    link: str
    description: Optional[str] = None

    service_id: Optional[int] = None
    chat_id: Optional[int] = None
    review_id: Optional[int] = None


class ImageCreate(ImageBase):
    pass


class ImageRead(ImageBase):
    image_id: int

    model_config = ConfigDict(from_attributes=True)