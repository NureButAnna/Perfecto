from decimal import Decimal
from typing import Optional

from sqlalchemy import String, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class DryCleaner(Base):
    __tablename__ = "dry_cleaners"

    id: Mapped[int] = mapped_column("dry_cleaner_id", primary_key=True, index=True)
    city: Mapped[str] = mapped_column(String(50))
    street: Mapped[str] = mapped_column(String(50))
    house_number: Mapped[Optional[str]] = mapped_column(String(50))
    latitude: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    longitude: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    phone_number: Mapped[str] = mapped_column(String(255))

    orders = relationship("Order", back_populates="dry_cleaner")