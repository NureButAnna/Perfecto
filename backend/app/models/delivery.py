from datetime import datetime
from typing import Optional

from sqlalchemy import String, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class Delivery(Base):
    __tablename__ = "deliveries"

    id: Mapped[int] = mapped_column("delivery_id", primary_key=True, index=True)
    city: Mapped[str] = mapped_column(String(50))
    street: Mapped[str]= mapped_column(String(100))
    house_number: Mapped[str] = mapped_column(String(20))
    flat_number: Mapped[Optional[str]] = mapped_column(String(20))
    delivery_datetime: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    delivery_type : Mapped[str] = mapped_column(String(30))
    nova_poshta_branch: Mapped[str] = mapped_column(String(100))

    user_id: Mapped[int] = mapped_column(ForeignKey(
        "users.user_id", ondelete="SET NULL"))
    order_id: Mapped[int] = mapped_column(ForeignKey(
        "orders.order_id", ondelete="CASCADE"))

    users = relationship("User", back_populates="deliveries")