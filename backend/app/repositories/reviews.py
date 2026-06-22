from sqlalchemy.orm import selectinload

from app.models.review import Review
from ..repositories.base import BaseRepository


class ReviewRepository(BaseRepository):
    model = Review

    def get_all_with_relations(self):
        return (
            self.db.query(Review)
            .options(
                selectinload(Review.user),
                selectinload(Review.service),
            )
            .all()
        )

    def get_by_user_id(self, user_id: int):
        return (
            self.db.query(Review)
            .options(
                selectinload(Review.user),
                selectinload(Review.service),
            )
            .filter(Review.user_id == user_id)
            .all()
        )

    def get_by_service_id(self, service_id: int):
        return (
            self.db.query(Review)
            .options(
                selectinload(Review.user),
                selectinload(Review.service),
            )
            .filter(Review.service_id == service_id)
            .all()
        )