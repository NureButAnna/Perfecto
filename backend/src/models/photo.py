from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class PhotoBase(Base):
    __tablename__ = "photo"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    link: Mapped[str] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    date: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now()"))

    chat_id: Mapped[int] = mapped_column(ForeignKey(
        "Chat.id", ondelete="CASCADE"))
    response_id: Mapped[int] = mapped_column(ForeignKey(
        "ResponseBase.id", ondelete="CASCADE"))