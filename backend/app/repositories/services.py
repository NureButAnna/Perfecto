from typing import Optional
from decimal import Decimal

from ..models.service import Service
from ..repositories.base import BaseRepository

class ServiceRepository(BaseRepository):
    model = Service

    def get_by_price(self, price: Decimal) -> Optional[Service]:
        return (
            self.db.query(Service)
            .filter(Service.price == price)
            .first()
        )
