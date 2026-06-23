from fastapi import HTTPException
from app.models.dry_cleaner import DryCleaner

class CheckoutService:
    def __init__(self, checkout_repository, db):
        self.checkout_repository = checkout_repository
        self.db = db

    def create_checkout(self, data):
        dry_cleaner = self.checkout_repository.get_dry_cleaner_by_id(data.dry_cleaner_id)

        if not dry_cleaner:
            raise HTTPException(status_code=404, detail="Хімчистку не знайдено")

        if data.delivery.delivery_type == "courier":
            if data.delivery.city.strip().lower() != dry_cleaner.city.strip().lower():
                raise HTTPException(
                    status_code=400,
                    detail=f"Доставка кур'єром можлива лише у місті філії: {dry_cleaner.city}"
                )

        total_cost = sum(
            item.price * item.number
            for item in data.order_services
        )
        return self.checkout_repository.create_checkout(
            order_data=data,
            delivery_data=data.delivery,
            order_services_data=data.order_services,
            total_cost=total_cost
        )