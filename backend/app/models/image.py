import datetime
from typing import Optional

from sqlalchemy import String, ForeignKey, Text, text, func, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class Image(Base):
    __tablename__ = "image"

    image_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    link: Mapped[str] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    date: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    chat_id: Mapped[int] = mapped_column(ForeignKey(
        "chat.chat_id", ondelete="CASCADE"),
        nullable= True
    )
    response_id: Mapped[int] = mapped_column(ForeignKey(
        "response.response_id", ondelete="CASCADE"),
        nullable= True
    )
    service_id: Mapped[int] = mapped_column(ForeignKey(
        "service.service_id", ondelete="CASCADE"),
        nullable= True
    )

    service = relationship("Service",back_populates="images")