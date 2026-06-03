from typing import Optional

from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class Delivery(Base):
    __tablename__ = "delivery"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    city: Mapped[str] = mapped_column(String(50))
    street: Mapped[str]= mapped_column(String(100))
    house_number: Mapped[str] = mapped_column(String(20))
    flat_number: Mapped[Optional[str]] = mapped_column(String(20))

    employee_id: Mapped[int] = mapped_column(ForeignKey(
        "EmployeeBase.id", ondelete="CASCADE"))
    order_id: Mapped[int] = mapped_column(ForeignKey(
        "OrderBase.id", ondelete="CASCADE"))