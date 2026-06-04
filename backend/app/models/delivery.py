from datetime import datetime
from typing import Optional

from sqlalchemy import String, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class Delivery(Base):
    __tablename__ = "deliveries"

    id: Mapped[int] = mapped_column("delivery_id", primary_key=True, index=True)
    city: Mapped[str] = mapped_column(String(50))
    street: Mapped[str]= mapped_column(String(100))
    house_number: Mapped[str] = mapped_column(String(20))
    flat_number: Mapped[Optional[str]] = mapped_column(String(20))
    delivery_datetime: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    employee_id: Mapped[int] = mapped_column(ForeignKey(
        "employees.employee_id", ondelete="CASCADE"))
    order_id: Mapped[int] = mapped_column(ForeignKey(
        "orders.order_id", ondelete="CASCADE"))