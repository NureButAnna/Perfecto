from typing import Optional

from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class Item(Base):
    __tablename__ = "item"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50))
    state:Mapped[Optional[str]]= mapped_column(String(50))
    description: Mapped[Optional[str]] = mapped_column(Text)

    order_id: Mapped[int] = mapped_column(ForeignKey(
        "ClientOrderBase.id", ondelete="CASCADE"))