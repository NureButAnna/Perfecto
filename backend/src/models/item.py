from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class ItemBase(Base):
    __tablename__ = "item"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50))
    state:Mapped[Optional[str]]= mapped_column(String(50))
    description: Mapped[Optional[str]] = mapped_column(Text)

    order_id: Mapped[int] = mapped_column(ForeignKey(
        "ClientOrderBase.id", ondelete="CASCADE"))