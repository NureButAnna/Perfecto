from fastapi import APIRouter, Depends, status

from app.models import User
from app.schemas.review import ReviewCreate, ReviewRead, ReviewUpdate
from app.services.reviews import ReviewService
from app.dependencies import get_review_service, require_role



router = APIRouter(
    prefix="/reviews",
    tags=["Review 🧐"]
)

@router.get("/", response_model=list[ReviewRead])
def get_reviews(
    service: ReviewService = Depends(get_review_service),
):
    return service.get_all_reviews()


@router.get("/{review_id}", response_model=ReviewRead)
def get_review_by_id(
    review_id: int,
    service:ReviewService = Depends(get_review_service),
):
    return service.get_review_by_id(review_id)

@router.get("/user/{user_id}", response_model=list[ReviewRead])
def get_user_reviews(
    user_id: int,
    service: ReviewService = Depends(get_review_service),
    current_user: User = Depends(require_role("адміністратор", "кур'єр"))
):
    return service.get_user_reviews(user_id)

@router.get("/service/{service_id}", response_model=list[ReviewRead])
def get_service_reviews(
    service_id: int,
    service: ReviewService = Depends(get_review_service),
):
    return service.get_service_reviews(service_id)

@router.post("/", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
def create_review(
    review_data: ReviewCreate,
    service: ReviewService = Depends(get_review_service),
    current_user: User = Depends(require_role("адміністратор", "клієнт"))
):
    return service.create_review(review_data, user_id=current_user.id)


@router.put("/{review_id}", response_model=ReviewRead, )
def update_review(
    review_id: int,
    review_data: ReviewUpdate,
    service: ReviewService = Depends(get_review_service),
    current_user: User = Depends(require_role("адміністратор", "кур'єр"))
):
    return service.update_review(review_id, review_data)


@router.delete("/{review_id}", status_code=status.HTTP_200_OK)
def delete_review(
    review_id: int,
    service: ReviewService = Depends(get_review_service),
    current_user: User = Depends(require_role("адміністратор"))
):
    return service.delete_review(review_id)