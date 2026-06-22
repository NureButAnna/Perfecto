from typing import Optional
from decimal import Decimal
from sqlalchemy import func
from sqlalchemy.orm import joinedload

from ..models.service import Service
from ..models.review import Review
from ..repositories.base import BaseRepository


class ServiceRepository(BaseRepository):
    model = Service

    def get_by_id(self, id: int):
        return (
            self.db.query(Service)
            .options(joinedload(Service.image))
            .filter(Service.id == id)
            .first()
        )

    def get_all(self):
        return (
            self.db.query(Service)
            .options(joinedload(Service.image))
            .all()
        )

    def get_by_price(self, price: Decimal) -> Optional[Service]:
        return (
            self.db.query(Service)
            .filter(Service.price == price)
            .first()
        )

    def get_by_category(self, category_id: int):
        return (
            self.db.query(Service)
            .filter(Service.category_id == category_id)
            .all()
        )

    def recalculate_rating(self, service_id: int) -> None:
        avg = (
            self.db.query(func.avg(Review.rating))
            .filter(Review.service_id == service_id)
            .scalar()
        )
        service = self.db.query(Service).filter(Service.id == service_id).first()
        if service:
            service.rating = round(avg, 2) if avg is not None else Decimal("0.00")
            self.db.commit()