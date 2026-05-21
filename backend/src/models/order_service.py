import datetime

from sqlalchemy import String, Numeric, text, ForeignKey
from sqlalchemy.testing.schema import mapped_column
# from src.database import Base
#
# class OrderServiceBase(Base):
from sqlalchemy import String
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class OrderServiceBase(Base):
    __tablename__ = "order_service"

    order_id: Mapped[int] = mapped_column(
        ForeignKey("order.id"),
        primary_key=True
    )
    service_id: Mapped[int] = mapped_column(
        ForeignKey("service.id"),
        primary_key=True
    )
    number: Mapped[int] = mapped_column(Integer)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
