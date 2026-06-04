from sqlalchemy.orm import Session, selectinload

from app.models.delivery import Delivery
from ..repositories.base import BaseRepository


class DeliveryRepository(BaseRepository):
    model = Delivery

    def get_by_employee_id(self, employee_id: int):
        return (
            self.db.query(Delivery)
            .filter(Delivery.employee_id == employee_id)
            .options(
                selectinload(Delivery.order),
                selectinload(Delivery.employee)
            )
            .all()
        )

    def get_by_order_id(self, order_id: int):
        return (
            self.db.query(Delivery)
            .filter(Delivery.order_id == order_id)
            .options(
                selectinload(Delivery.order),
                selectinload(Delivery.employee)
            )
            .all()
        )