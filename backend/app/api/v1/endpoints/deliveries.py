from fastapi import APIRouter, Depends, status

from app.schemas.delivery import DeliveryCreate, DeliveryRead, DeliveryUpdate
from app.services.deliveries import DeliveryService
from app.dependencies import get_delivery_service

router = APIRouter(
    prefix="/deliveries",
    tags=["Delivery 🚚"]
)

@router.get("/", response_model=list[DeliveryRead])
def get_deliveries(service: DeliveryService = Depends(get_delivery_service)):
    return service.get_all_deliveries()


@router.get("/{delivery_id}", response_model=DeliveryRead)
def get_delivery(
    delivery_id: int,
    service:DeliveryService = Depends(get_delivery_service)
):
    return service.get_delivery_by_id(delivery_id)


@router.post("/", response_model=DeliveryRead, status_code=status.HTTP_201_CREATED)
def create_delivery(
    delivery_data: DeliveryCreate,
    service: DeliveryService = Depends(get_delivery_service),
):
    return service.create_delivery(delivery_data)


@router.put("/{delivery_id}", response_model=DeliveryRead, )
def update_delivery(
    delivery_id: int,
    delivery_data: DeliveryUpdate,
    service: DeliveryService = Depends(get_delivery_service)
):
    return service.update_delivery(delivery_id, delivery_data)


@router.delete("/{delivery_id}", status_code=status.HTTP_200_OK)
def delete_delivery(
    delivery_id: int,
    service: DeliveryService = Depends(get_delivery_service)
):
    return service.delete_delivery(delivery_id)