from fastapi import APIRouter, Depends, status

from app.schemas.checkout import CheckoutCreate, CheckoutRead
from app.services.checkout import CheckoutService
from app.dependencies import get_checkout_service

router = APIRouter(
    prefix="/checkout",
    tags=["Checkout 🏷️"]
)

@router.post(
    "/",
    response_model=CheckoutRead,
    status_code=status.HTTP_201_CREATED
)
def create_checkout(
        data: CheckoutCreate,
        service: CheckoutService = Depends(get_checkout_service)
):
    return service.create_checkout(data)