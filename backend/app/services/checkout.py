from decimal import Decimal


class CheckoutService:

    def __init__(
            self,
            checkout_repository,
            service_repository
    ):
        self.checkout_repository = checkout_repository
        self.service_repository = service_repository

    def create_checkout(self, data):

        total_cost = Decimal(0)

        for item in data.order_services:

            service = self.service_repository.get_service_by_id(
                item.service_id
            )

            total_cost += service.price * item.quantity

        return self.checkout_repository.create_checkout(
            order_data=data,
            delivery_data=data.delivery,
            order_services_data=data.order_services,
            total_cost=total_cost
        )