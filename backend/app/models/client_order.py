from datetime import datetime
from decimal import Decimal

from sqlalchemy import String, Numeric, text, ForeignKey
from sqlalchemy.testing.schema import Mapped, mapped_column
from app.database import Base

class ClientOrder(Base):
    __tablename__ = "client_order"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    status: Mapped[str] = mapped_column(String(50))
    total_cost:Mapped[Decimal] = mapped_column(Numeric(10, 2))
    creation_date: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    dry_cleaner_id: Mapped[int] = mapped_column(ForeignKey(
        "DryCleanerBase.id", ondelete="CASCADE"))
    client_id: Mapped[int] = mapped_column(ForeignKey(
        "ClientBase.id", ondelete="CASCADE"))