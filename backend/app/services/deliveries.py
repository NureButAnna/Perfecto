from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.delivery import DeliveryCreate, DeliveryRead, DeliveryUpdate
from app.repositories.deliveries import DeliveryRepository


class DeliveryService:
    def __init__(self, db: Session):
        self.repository = DeliveryRepository(db)

    def get_all_deliveries(self) -> List[DeliveryRead]:
        deliveries = self.repository.get_all()
        return [DeliveryRead.model_validate(d) for d in deliveries]

    def get_delivery_by_id(self, delivery_id: int) -> DeliveryRead:
        delivery = self.repository.get_by_id(delivery_id)

        if not delivery:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Review with id {delivery_id} not found"
            )

        return DeliveryRead.model_validate(delivery)

    def get_employee_delivery(self, employee_id: int) -> List[DeliveryRead]:
        deliveries = self.repository.get_by_employee_id(employee_id)
        return [DeliveryRead.model_validate(d) for d in deliveries]

    def get_delivery_by_order(self, order_id: int) -> List[DeliveryRead]:
        deliveries = self.repository.get_by_employee_id(order_id)
        return [DeliveryRead.model_validate(d) for d in deliveries]

    def create_delivery(self, data: DeliveryCreate) -> DeliveryRead:
        delivery = self.repository.create(
            data.model_dump()
        )

        return DeliveryRead.model_validate(delivery)

    def update_delivery(self, delivery_id: int, data: DeliveryUpdate) -> DeliveryRead:
        updated = self.repository.update(
            delivery_id,
            data.model_dump(exclude_unset=True)
        )

        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Review with id {delivery_id} not found"
            )

        return DeliveryRead.model_validate(updated)

    def delete_delivery(self, delivery_id: int):
        deleted = self.repository.delete(delivery_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Review with id {delivery_id} not found"
            )

        return {"message": "Review deleted successfully"}