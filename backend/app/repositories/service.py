from sqlalchemy.orm import Session
from typing import List, Optional
from decimal import Decimal

from ..models.service import Service
from ..schemas.service import ServiceCreate


class ServiceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Service]:
        return self.db.query(Service).all()

    def get_by_id(self, service_id: int) -> Optional[Service]:
        return (
            self.db.query(Service)
            .filter(Service.service_id == service_id)
            .first()
        )

    def get_by_price(self, price: Decimal) -> Optional[Service]:
        return (
            self.db.query(Service)
            .filter(Service.price == price)
            .first()
        )

    def create(self, service_data: ServiceCreate) -> Service:
        db_service = Service(**service_data.model_dump())

        self.db.add(db_service)
        self.db.commit()
        self.db.refresh(db_service)

        return db_service

    def delete(self, service: Service):
        self.db.delete(service)
        self.db.commit()