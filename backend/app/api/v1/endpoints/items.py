from fastapi import APIRouter, Depends, status

from app.schemas.item import ItemCreate, ItemRead, ItemUpdate
from app.services.items import ItemService
from app.dependencies import get_item_service

router = APIRouter(
    prefix="/items",
    tags=["Item 👚"]
)

@router.get("/", response_model=list[ItemRead])
def get_items(service: ItemService = Depends(get_item_service)):
    return service.get_all_items()


@router.get("/{item_id}", response_model=ItemRead)
def get_item(
    item_id: int,
    service:ItemService = Depends(get_item_service)
):
    return service.get_delivery_by_id(item_id)

@router.get("/order/{order_id}", response_model=ItemRead)
def get_order_item(
    item_id: int,
    service:ItemService = Depends(get_item_service)
):
    return service.get_items_by_order(item_id)


@router.post("/",response_model=ItemRead,
    status_code=status.HTTP_201_CREATED
)
def create_item(
    item_data: ItemCreate,
    service: ItemService = Depends(get_item_service)
):
    return service.create_item(item_data)


@router.put("/{item_id}", response_model=ItemRead)
def update_item(
    item_id: int,
    item_data: ItemUpdate,
    service: ItemService = Depends(get_item_service)
):
    return service.update_item(item_id, item_data)


@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    service: ItemService = Depends(get_item_service)
):
    return service.delete_item(item_id)