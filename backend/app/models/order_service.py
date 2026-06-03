from decimal import Decimal
from sqlalchemy import Numeric, ForeignKey, Integer

from sqlalchemy.testing.schema import Mapped, mapped_column
from app.database import Base

class OrderService(Base):
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
