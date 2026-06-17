from sqlalchemy.orm import selectinload

from ..models.order import Order
from ..models.order_service import OrderServices
from ..repositories.base import BaseRepository


class OrderRepository(BaseRepository):
    model = Order

    def get_by_user_id(self, user_id: int):
        return (
            self.db.query(Order)
            .filter(Order.user_id == user_id)
            .options(
                selectinload(Order.order_services)
                .selectinload(OrderServices.service),
                selectinload(Order.users)
            )
            .all()
        )

    def get_by_service_id(self, service_id: int):
        return (
            self.db.query(Order)
            .filter(Order.service_id == service_id)
            .options(
                selectinload(Order.order_services)
                .selectinload(OrderServices.service),
                selectinload(Order.user)
            )
            .all()
        )