from decimal import Decimal
from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.order import OrderCreate, OrderRead, OrderUpdate
from ..models import Order, Service
from ..models.order_service import OrderServices

from ..repositories.orders import OrderRepository


class OrderService:
    def __init__(self, db: Session):
        self.repository = OrderRepository(db)

    def get_all_orders(self) -> List[OrderRead]:
        orders = self.repository.get_all()
        return [OrderRead.model_validate(o) for o in orders]

    def get_order_by_id(self, order_id: int) -> OrderRead:
        order = self.repository.get_by_id(order_id)

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with id {order_id} not found"
            )

        return OrderRead.model_validate(order)

    def get_orders_by_user(self, user_id: int) -> List[OrderRead]:
        orders = self.repository.get_by_user_id(user_id)
        return [OrderRead.model_validate(o) for o in orders]

    def create_order(self, data: OrderCreate) -> OrderRead:
        total_price = Decimal("0")

        new_order = Order(
            user_id=data.user_id,
            dry_cleaner_id=data.dry_cleaner_id,
            item_id=data.item_id,
            status=data.status,
            total_cost=Decimal("0")
        )

        self.repository.db.add(new_order)
        self.repository.db.flush()

        for service in data.order_services:
            product = self.repository.db.query(Service).filter(
                Service.id == service.service_id
            ).first()

            if not product:
                raise ValueError("Service not found")

            price = product.price
            subtotal = price * service.number
            total_price += subtotal

            order_service = OrderServices(
                order_id=new_order.id,
                service_id=service.service_id,
                number=service.number,
                price=price
            )

            self.repository.db.add(order_service)

        new_order.total_cost = total_price

        self.repository.db.commit()
        self.repository.db.refresh(new_order)

        return new_order

    def update_order(self, order_id: int, data: OrderUpdate) -> OrderRead:
        updated = self.repository.update(
            order_id,
            data.model_dump(exclude_unset=True)
        )

        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )

        return OrderRead.model_validate(updated)

    def delete_order(self, order_id: int):
        deleted = self.repository.delete(order_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )

        return {"message": "Order deleted successfully"}