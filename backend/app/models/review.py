import datetime
from typing import Optional

from sqlalchemy import ForeignKey, Text, Numeric, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column("review_id", primary_key=True, index=True)

    text: Mapped[Optional[str]] = mapped_column(Text)

    rating: Mapped[int] = mapped_column(Integer, nullable=False, default=5)  # ← нове поле

    date: Mapped[datetime.datetime] = mapped_column(
        server_default=func.now()
    )

    service_id: Mapped[int] = mapped_column(
        ForeignKey("services.service_id", ondelete="CASCADE")
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id", ondelete="CASCADE")
    )

    service = relationship("Service", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
