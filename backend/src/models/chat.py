from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class AIChatBase(Base):
    __tablename__ = "chat"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    message: Mapped[Optional[str]] = mapped_column(Text)
    date: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now()"))
    answer: Mapped[Optional[str]] = mapped_column(Text)

    client_id: Mapped[int] = mapped_column(ForeignKey(
        "ClientBase.id", ondelete="CASCADE"))
