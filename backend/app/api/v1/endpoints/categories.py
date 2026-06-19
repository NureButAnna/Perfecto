from fastapi import APIRouter, Depends, status

from app.models import User
from app.schemas.category import CategoryRead, CategoryUpdate, CategoryCreate
from app.services.categories import CategoryService
from app.dependencies import get_category_service, require_role



router = APIRouter(
    prefix="/categories",
    tags=["Category 📌"]
)

@router.get("/", response_model=list[CategoryRead])
def get_categories(
    service: CategoryService = Depends(get_category_service)
):
    return service.get_all_categories()

@router.get("/{category_id}", response_model=CategoryRead)
def get_category_by_id(
    category_id: int,
    service: CategoryService = Depends(get_category_service)
):
    return service.get_category_by_id(category_id)


@router.post("/",response_model=CategoryRead,status_code=status.HTTP_201_CREATED)
def add_category(
    category_data: CategoryCreate,
    service: CategoryService = Depends(get_category_service),
    current_user: User = Depends(require_role("адміністратор"))
):
    return service.create_category(category_data)


@router.put("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    service: CategoryService = Depends(get_category_service),
    current_user: User = Depends(require_role("адміністратор"))
):
    return service.update_category(category_id, category_data)


@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
def delete_category(
    category_id: int,
    service: CategoryService = Depends(get_category_service),
    current_user: User = Depends(require_role("адміністратор"))
):
    return service.delete_category(category_id)