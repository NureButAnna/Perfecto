from sqlalchemy import String, Numeric, ForeignKey
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class Employee(Base):
    __tablename__ = "employee"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    position: Mapped[str] = mapped_column(String(50))
    surname:Mapped[str] = mapped_column(String(50))
    name: Mapped[[str]] = mapped_column(String(50))
    patronymic: Mapped[Optional[str]] = mapped_column(String(50))
    phone_number: Mapped[Optional[str]] = mapped_column(String(20))
    email: Mapped[Optional[str]] = mapped_column(String(100))
    password: Mapped[[str]] = mapped_column(String(255))

    dry_cleaner_id: Mapped[int] = mapped_column(ForeignKey(
        "DryCleanerBase.id", ondelete="CASCADE"))