from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.testing.schema import mapped_column
from src.database import Base

class DeliveryBase(Base):
    __tablename__ = "delivery"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    city: Mapped[str] = mapped_column(String(50))
    street: Mapped[str]= mapped_column(String(100))
    house_number: Mapped[str] = mapped_column(String(20))
    flat_number: Mapped[Optional[str]] = mapped_column(String(20))

    employee_id: Mapped[int] = mapped_column(ForeignKey(
        "EmployeeBase.id", ondelete="CASCADE"))
    order_id: Mapped[int] = mapped_column(ForeignKey(
        "OrderBase.id", ondelete="CASCADE"))