from typing import Optional

from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column("item_id", primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50))
    state:Mapped[Optional[str]]= mapped_column(String(50))
    description: Mapped[Optional[str]] = mapped_column(Text)

    order_id: Mapped[int] = mapped_column(ForeignKey(
        "orders.order_id", ondelete="CASCADE"))

    order = relationship("Order", back_populates="items")