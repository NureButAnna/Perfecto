from sqlalchemy import String
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class ClientBase(Base):
    __tablename__ = "client"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    surname: Mapped[Optional[str]] = mapped_column(String(50))
    name: Mapped[str] = mapped_column(String(50))
    patronymic: Mapped[Optional[str]] = mapped_column(String(50))
    phone_number: Mapped[str] = mapped_column(String(20))
    email: Mapped[str] = mapped_column(String(100))
    password: Mapped[str] = mapped_column(String(255))