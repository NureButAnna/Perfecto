from sqlalchemy.orm import selectinload, joinedload

from ..models.delivery import Delivery
from ..models.order import Order
from ..models.order_service import OrderServices
from ..repositories.base import BaseRepository


class OrderRepository(BaseRepository):
    model = Order

    def get_all(self):
        return (
            self.db.query(Order)
            .options(
                joinedload(Order.user),
                joinedload(Order.delivery),
                joinedload(Order.order_services),
            )
            .all()
        )

    def get_by_id(self, order_id: int):
        return (
            self.db.query(Order)
            .options(
                joinedload(Order.user),
                joinedload(Order.delivery),
                joinedload(Order.order_services),
            )
            .filter(Order.id == order_id)
            .first()
        )

    def get_by_user_id(self, user_id: int):
        return (
            self.db.query(Order)
            .filter(Order.user_id == user_id)
            .options(
                selectinload(Order.order_services)
                .selectinload(OrderServices.service),
                selectinload(Order.user)
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

    def get_delivery_by_order(self, order_id: int):
        return (
            self.db.query(Delivery)
            .filter(Delivery.order_id == order_id)
            .first()
        )

    def assign_courier_to_delivery(self, order_id: int, user_id: int):
        delivery = self.get_delivery_by_order(order_id)
        if not delivery:
            return None
        delivery.user_id = user_id
        self.db.commit()
        self.db.refresh(delivery)
        return delivery