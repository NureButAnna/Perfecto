from fastapi import APIRouter, Depends, status

from app.schemas.dry_cleaner import DryCleanerCreate, DryCleanerRead, DryCleanerUpdate
from app.services.dry_cleaners import DryCleanerService
from app.dependencies import get_dry_cleaner_service, require_role

from app.models import User

router = APIRouter(
prefix="/dry_cleaners",
    tags=["Dry Cleaner 🫧"]
)

@router.get("/", response_model=list[DryCleanerRead])
def get_dry_cleaners(service: DryCleanerService = Depends(get_dry_cleaner_service)):
    return service.get_all_dry_cleaners()


@router.get("/{dry_cleaner_id}", response_model=DryCleanerRead)
def get_dry_cleaner(
    dry_cleaner_id: int,
    service: DryCleanerService = Depends(get_dry_cleaner_service)
):
    return service.get_dry_cleaner_by_id(dry_cleaner_id)


@router.get("/city/{city}", response_model=list[DryCleanerRead])
def get_dry_cleaners_by_city(
    city: str,
    service: DryCleanerService = Depends(get_dry_cleaner_service),
):
    return service.get_dry_cleaner_by_city(city)


@router.post("/", response_model=DryCleanerRead, status_code=status.HTTP_201_CREATED)
def create_dry_cleaner(
    dry_cleaner_data: DryCleanerCreate,
    service: DryCleanerService = Depends(get_dry_cleaner_service),
    current_user: User = Depends(require_role("адміністратор"))
):
    return service.create_dry_cleaner(dry_cleaner_data)


@router.put("/{dry_cleaner_id}", response_model=DryCleanerRead)
def update_dry_cleaner(
    dry_cleaner_id: int,
    dry_cleaner_data: DryCleanerUpdate,
    service: DryCleanerService = Depends(get_dry_cleaner_service),
    current_user: User = Depends(require_role("адміністратор"))
):
    return service.update_dry_cleaner(dry_cleaner_id, dry_cleaner_data)


@router.delete("/{dry_cleaner_id}", status_code=status.HTTP_200_OK)
def delete_dry_cleaner(
    dry_cleaner_id: int,
    service: DryCleanerService = Depends(get_dry_cleaner_service),
    current_user: User = Depends(require_role("адміністратор"))
):
    return service.delete_dry_cleaner(dry_cleaner_id)