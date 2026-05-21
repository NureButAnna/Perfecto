from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class NotificationBase(Base):
    __tablename__ = "notification"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    text: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(50))
    date: Mapped[datetime.datetime] = mapped_column(
        server_default=text("TIMEZONE('utc', now()"))


    client_id: Mapped[int] = mapped_column(ForeignKey(
        "ClientBase.id", ondelete="CASCADE"))