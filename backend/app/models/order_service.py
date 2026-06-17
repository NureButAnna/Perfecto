from decimal import Decimal
from sqlalchemy import Numeric, ForeignKey, Integer

from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class OrderServices(Base):
    __tablename__ = "order_services"

    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.order_id"),
        primary_key=True
    )
    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.service_id"),
        primary_key=True
    )
    number: Mapped[int] = mapped_column(Integer)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))

    order = relationship("Order", back_populates="order_services")

    service = relationship("Service", back_populates="order_services")