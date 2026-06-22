from decimal import Decimal

from app.models.order import Order
from app.models.order_service import OrderServices
from app.models.delivery import Delivery


class CheckoutRepository:

    def __init__(self, session):
        self.session = session

    def create_checkout(self,
                        order_data,
                        delivery_data,
                        order_services_data,
                        total_cost):

        order = Order(
            status="new",
            total_cost=total_cost,
            payment_method=order_data.payment_method,
            comment=order_data.comment,
            user_id=order_data.user_id,
            dry_cleaner_id=order_data.dry_cleaner_id
        )

        self.session.add(order)
        self.session.flush()

        for item in order_services_data:
            order_service = OrderServices(
                order_id=order.id,
                service_id=item.service_id,
                number=item.number,
                price=item.price,
            )
            self.session.add(order_service)

        delivery = Delivery(
            city=delivery_data.city,
            street=delivery_data.street,
            house_number=delivery_data.house_number,
            flat_number=delivery_data.flat_number,
            delivery_datetime=delivery_data.delivery_datetime,
            delivery_type=delivery_data.delivery_type,
            nova_poshta_branch=delivery_data.nova_poshta_branch,
            user_id=delivery_data.user_id,
            order_id=order.id
        )

        self.session.add(delivery)
        self.session.commit()
        self.session.refresh(order)
        self.session.refresh(delivery)

        return {
            "order_id":       order.id,
            "status":         order.status,
            "total_cost":     order.total_cost,
            "creation_date":  order.creation_date,
            "order_services": order.order_services,
            "delivery":       delivery,
        }