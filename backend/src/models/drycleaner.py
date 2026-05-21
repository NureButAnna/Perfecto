from sqlalchemy import String, Numeric
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class DryCleanerBase(Base):
    __tablename__ = "drycleaner"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    city: Mapped[str] = mapped_column(String(50))
    street: Mapped[str] = mapped_column(String(50))
    house_number: Mapped[Optional[str]] = mapped_column(String(50))
    latitude: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    longitude: Mapped[Decimal] = mapped_column(Numeric(9, 6))
    phone_number: Mapped[str] = mapped_column(String(255))