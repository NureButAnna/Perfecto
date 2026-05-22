import datetime
from typing import Optional

from sqlalchemy import String, ForeignKey, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class Image(Base):
    __tablename__ = "image"

    image_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    link: Mapped[str] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    date: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now()"))

    chat_id: Mapped[int] = mapped_column(ForeignKey(
        "chat.chat_id", ondelete="CASCADE"))
    response_id: Mapped[int] = mapped_column(ForeignKey(
        "response.response_id", ondelete="CASCADE"))
    service_id: Mapped[int] = mapped_column(ForeignKey(
        "service.service_id", ondelete="CASCADE"))

    service = relationship("Service",back_populates="image")