from sqlalchemy import String, ForeignKey, Text, Numeric
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class ServiceBase(Base):
    __tablename__ = "service"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    price:Mapped[Decimal] = mapped_column(Numeric(10, 2))
    duration: Mapped[Optional[int]] = mapped_column(nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text)

    dry_cleaner_id: Mapped[int] = mapped_column(ForeignKey(
        "DryCleanerBase.id", ondelete="CASCADE"))