from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.review import ReviewCreate, ReviewRead, ReviewUpdate
from app.repositories.reviews import ReviewRepository
from app.repositories.services import ServiceRepository


class ReviewService:
    def __init__(self, db: Session):
        self.repository = ReviewRepository(db)
        self.service_repo = ServiceRepository(db)

    def get_all_reviews(self) -> List[ReviewRead]:
        reviews = self.repository.get_all_with_relations()
        return [ReviewRead.model_validate(d) for d in reviews]

    def get_review_by_id(self, review_id: int) -> ReviewRead:
        review = self.repository.get_by_id(review_id)
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Review with id {review_id} not found")
        return ReviewRead.model_validate(review)

    def get_user_reviews(self, user_id: int) -> List[ReviewRead]:
        reviews = self.repository.get_by_user_id(user_id)
        return [ReviewRead.model_validate(d) for d in reviews]

    def get_service_reviews(self, service_id: int) -> List[ReviewRead]:
        reviews = self.repository.get_by_service_id(service_id)
        return [ReviewRead.model_validate(r) for r in reviews]

    def create_review(self, data: ReviewCreate, user_id: int) -> ReviewRead:
        review = self.repository.create({
            **data.model_dump(),
            "user_id": user_id,
        })
        self.service_repo.recalculate_rating(data.service_id)
        return ReviewRead.model_validate(review)

    def update_review(self, review_id: int, data: ReviewUpdate) -> ReviewRead:
        updated = self.repository.update(review_id, data.model_dump(exclude_unset=True))
        if not updated:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Review with id {review_id} not found")

        if data.rating is not None or data.service_id is not None:
            self.service_repo.recalculate_rating(updated.service_id)
        return ReviewRead.model_validate(updated)

    def delete_review(self, review_id: int):
        review = self.repository.get_by_id(review_id)
        if not review:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Review with id {review_id} not found")
        service_id = review.service_id
        self.repository.delete(review_id)
        self.service_repo.recalculate_rating(service_id)
        return {"message": "Review deleted successfully"}