from fastapi import APIRouter, Depends, status

from app.models import User
from app.schemas.delivery import DeliveryCreate, DeliveryRead, DeliveryUpdate
from app.services.deliveries import DeliveryService
from app.dependencies import get_delivery_service, require_role



router = APIRouter(
    prefix="/deliveries",
    tags=["Delivery 🚚"]
)

@router.get("/", response_model=list[DeliveryRead])
def get_deliveries(
    service: DeliveryService = Depends(get_delivery_service),
    current_user: User = Depends(require_role("адміністратор", "кур'єр"))
):
    return service.get_all_deliveries()


@router.get("/{delivery_id}", response_model=DeliveryRead)
def get_delivery(
    delivery_id: int,
    service:DeliveryService = Depends(get_delivery_service),
    current_user: User = Depends(require_role("адміністратор", "кур'єр", "користувач"))
):
    return service.get_delivery_by_id(delivery_id)

@router.get("/employee/{user_id}", response_model=list[DeliveryRead])
def get_employee_deliveries(
    user_id: int,
    service: DeliveryService = Depends(get_delivery_service),
    current_user: User = Depends(require_role("адміністратор", "кур'єр"))
):
    return service.get_employee_delivery(user_id)

@router.post("/", response_model=DeliveryRead, status_code=status.HTTP_201_CREATED)
def create_delivery(
    delivery_data: DeliveryCreate,
    service: DeliveryService = Depends(get_delivery_service),
    current_user: User = Depends(require_role("адміністратор", "користувач"))
):
    return service.create_delivery(delivery_data)


@router.put("/{delivery_id}", response_model=DeliveryRead, )
def update_delivery(
    delivery_id: int,
    delivery_data: DeliveryUpdate,
    service: DeliveryService = Depends(get_delivery_service),
    current_user: User = Depends(require_role("адміністратор", "кур'єр"))
):
    return service.update_delivery(delivery_id, delivery_data)


@router.delete("/{delivery_id}", status_code=status.HTTP_200_OK)
def delete_delivery(
    delivery_id: int,
    service: DeliveryService = Depends(get_delivery_service),
    current_user: User = Depends(require_role("адміністратор"))
):
    return service.delete_delivery(delivery_id)