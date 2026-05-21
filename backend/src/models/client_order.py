import datetime

from sqlalchemy import String, Numeric, text, ForeignKey
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class ClientOrderBase(Base):
    __tablename__ = "client_order"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    status: Mapped[str] = mapped_column(String(50))
    total_cost:Mapped[Decimal] = mapped_column(Numeric(10, 2))
    creation_date: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now()"))

    dry_cleaner_id: Mapped[int] = mapped_column(ForeignKey(
        "DryCleanerBase.id", ondelete="CASCADE"))
    client_id: Mapped[int] = mapped_column(ForeignKey(
        "ClientBase.id", ondelete="CASCADE"))