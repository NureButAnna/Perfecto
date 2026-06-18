from decimal import Decimal

from sqlalchemy.orm import Session
from typing import List

from app.schemas.service import ServiceCreate, ServiceRead, ServiceUpdate
from ..repositories.services import ServiceRepository
from fastapi import HTTPException, status


class ServService:
    def __init__(self, db: Session):
        self.repository = ServiceRepository(db)

    def get_all_services(self) -> List[ServiceRead]:
        services = self.repository.get_all()
        return [ServiceRead.model_validate(serv) for serv in services]

    def get_service_by_id(self, service_id: int ) -> ServiceRead:
        service = self.repository.get_by_id(service_id)
        if not service:
            raise HTTPException(
              status_code=status.HTTP_404_NOT_FOUND,
              detail=f'Service with id {service_id} not found'
            )
        return ServiceRead.model_validate(service)

    def get_service_by_price(self, price: Decimal) -> ServiceRead:
        service = self.repository.get_by_price(price)
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f'Service with price {price} not found'
            )
        return ServiceRead.model_validate(service)

    def get_service_by_category(self, category_id: int):
        services = self.repository.get_by_category(category_id)

        if not services:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Services for category {category_id} not found"
            )

        return [ServiceRead.model_validate(service) for service in services]

    def create_service(self, service_data: ServiceCreate) -> ServiceRead:
        service = self.repository.create(
            service_data.model_dump())

        return ServiceRead.model_validate(service)

    def update_service(self, service_id: int, data: ServiceUpdate) -> ServiceRead:
        updated = self.repository.update(
            service_id,
            data.model_dump(exclude_unset=True)
        )

        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Service with id {service_id} not found"
            )

        return ServiceRead.model_validate(updated)

    def delete_service(self, service_id: int):
        service = self.repository.get_by_id(service_id)

        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Service with id {service_id} not found"
            )

        self.repository.delete(service)

        return {"message": "Service deleted successfully"}