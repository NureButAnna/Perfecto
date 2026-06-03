import datetime
from typing import Optional

from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey, Text, Integer, text
from app.database import Base

class AIChat(Base):
    __tablename__ = "chat"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    message: Mapped[Optional[str]] = mapped_column(Text)
    date:  Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now())")
    )

    answer: Mapped[Optional[str]] = mapped_column(Text)

    client_id: Mapped[int] = mapped_column(ForeignKey(
        "ClientBase.id", ondelete="CASCADE"))
