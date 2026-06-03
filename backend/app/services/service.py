from sqlalchemy.orm import Session
from typing import List

from app.schemas.service import ServiceCreate, ServiceRead
from ..repositories.service import ServiceRepository
from fastapi import HTTPException, status

class ServiceService:
    def __init__(self, db: Session):
        self.repository = ServiceRepository(db)

    def get_all_services(self) -> List[ServiceRead]:
        services = self.repository.get_all()

        result = []

        for service in services:
            image_url = None

            if service.images:
                image_url = service.images[0].link

            service_data = ServiceRead(
                service_id=service.service_id,
                name=service.name,
                price=service.price,
                duration=service.duration,
                description=service.description,
                rating=service.rating,
                category_id=service.category_id,
                dry_cleaner_id=service.dry_cleaner_id,
                image_url=image_url
            )

            result.append(service_data)

        return result

    def get_service_by_id(self, service_id: int ) -> ServiceRead:
        service = self.repository.get_by_id(service_id)
        if not service:
            raise HTTPException(
              status_code=status.HTTP_404_NOT_FOUND,
              detail=f'Service with id {service_id} not found'
            )
        return ServiceRead.model_validate(service)

    def create_service(self, service_data: ServiceCreate) -> ServiceRead:
        service = self.repository.create(service_data)
        return ServiceRead.model_validate(service)

    def delete_service(self, service_id: int):
        service = self.repository.get_by_id(service_id)

        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Service with id {service_id} not found"
            )

        self.repository.delete(service)

        return {"message": "Service deleted successfully"}