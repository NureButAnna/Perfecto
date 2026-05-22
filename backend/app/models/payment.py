import datetime

from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped
from sqlalchemy.testing.schema import mapped_column
from app.database import Base

class PaymnetBase(Base):
    __tablename__ = "payment"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    method: Mapped[str] = mapped_column(String(50))
    transaction_number: Mapped[str]= mapped_column(String(100))
    date: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now()"))
    status: Mapped[Optional[str]] = mapped_column(String(50))

    order_id: Mapped[int] = mapped_column(ForeignKey(
        "OrderBase.id", ondelete="CASCADE"))