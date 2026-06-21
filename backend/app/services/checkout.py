from decimal import Decimal


class CheckoutService:
    def __init__(self, checkout_repository):
        self.checkout_repository = checkout_repository

    def create_checkout(self, data):
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