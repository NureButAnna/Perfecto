from decimal import Decimal
from typing import Optional

from sqlalchemy import String, ForeignKey, Text, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column("service_id", primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    duration: Mapped[Optional[int]] = mapped_column(nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text)
    rating: Mapped[Decimal] = mapped_column(Numeric(10, 2))

    dry_cleaner_id: Mapped[int] = mapped_column(
        ForeignKey("dry_cleaners.dry_cleaner_id", ondelete="CASCADE")
    )

    category_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey(
            "categories.category_id",
            ondelete="SET NULL"
        ),
        nullable=True
    )

    image = relationship( "Image", back_populates="service",
        uselist=False
    )
    category = relationship("Category",back_populates="services")
    order_services = relationship("OrderServices", back_populates="service")
    reviews = relationship("Review", back_populates="service", cascade="all, delete-orphan")