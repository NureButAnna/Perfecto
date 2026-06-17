from decimal import Decimal

from pydantic import BaseModel, ConfigDict
from app.schemas.service import ServiceShort

class OrderServiceRead(BaseModel):
    number: int
    service: ServiceShort

    model_config = ConfigDict(from_attributes=True)

class OrderServiceCreate(BaseModel):
    service_id: int
    number: int
    price: Decimal