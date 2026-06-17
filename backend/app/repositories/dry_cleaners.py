from app.models.dry_cleaner import DryCleaner
from ..repositories.base import BaseRepository


class DryCleanerRepository(BaseRepository):
    model = DryCleaner

    def get_by_city(self, city: str) -> list[DryCleaner]:
        return (
            self.db.query(DryCleaner)
            .filter(DryCleaner.city.ilike(city))
            .all()
        )