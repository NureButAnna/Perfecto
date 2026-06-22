from typing import Optional

from sqlalchemy import String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column("user_id", primary_key=True, index=True)
    surname: Mapped[Optional[str]] = mapped_column(String(50))
    name: Mapped[str] = mapped_column(String(50))
    patronymic: Mapped[Optional[str]] = mapped_column(String(50))
    phone_number: Mapped[str] = mapped_column(String(20))
    email: Mapped[str] = mapped_column(String(100))
    password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(100))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


    dry_cleaner_id: Mapped[Optional[int]] = mapped_column(ForeignKey(
        "dry_cleaners.dry_cleaner_id", ondelete="SET NULL"))

    orders = relationship("Order",
                          back_populates="user", cascade="all, delete-orphan")

    deliveries = relationship("Delivery",
                              back_populates="users", cascade="all, delete-orphan")

    reviews = relationship("Review",
                           back_populates="user", cascade="all, delete-orphan")