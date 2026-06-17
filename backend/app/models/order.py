from datetime import datetime
from decimal import Decimal

from sqlalchemy import String, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column("order_id", primary_key=True, index=True)
    status: Mapped[str] = mapped_column(String(50))
    total_cost:Mapped[Decimal] = mapped_column(Numeric(10, 2))
    creation_date: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    user_id: Mapped[int] = mapped_column(ForeignKey(
        "users.user_id", ondelete="CASCADE"))

    dry_cleaner_id: Mapped[int] = mapped_column(ForeignKey(
        "dry_cleaners.dry_cleaner_id", ondelete="CASCADE"))

    users = relationship("User", back_populates="orders")
    items = relationship("Item", back_populates="order")
    dry_cleaner = relationship("DryCleaner", back_populates="orders")

    order_services = relationship("OrderServices", back_populates="order",
                                  cascade="all, delete-orphan")

