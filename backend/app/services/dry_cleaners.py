from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.dry_cleaner import DryCleanerCreate, DryCleanerRead, DryCleanerUpdate
from app.repositories.dry_cleaners import DryCleanerRepository


class DryCleanerService:
    def __init__(self, db: Session):
        self.repository = DryCleanerRepository(db)

    def get_all_dry_cleaners(self) -> List[DryCleanerRead]:
        dry_cleaners = self.repository.get_all()
        return [DryCleanerRead.model_validate(dc) for dc in dry_cleaners]

    def get_dry_cleaner_by_id(self, dry_cleaner_id: int) -> DryCleanerRead:
        dry_cleaner = self.repository.get_by_id(dry_cleaner_id)

        if not dry_cleaner:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"DryCleaner with id {dry_cleaner_id} not found"
            )

        return DryCleanerRead.model_validate(dry_cleaner)

    def get_dry_cleaner_by_city(self, city: str) -> List[DryCleanerRead]:
        dry_cleaners = self.repository.get_by_city(city)
        return [DryCleanerRead.model_validate(dc) for dc in dry_cleaners]

    def create_dry_cleaner(self, data: DryCleanerCreate) -> DryCleanerRead:
        dry_cleaner = self.repository.create(
            data.model_dump()
        )

        return DryCleanerRead.model_validate(dry_cleaner)

    def update_dry_cleaner(self, dry_cleaner_id: int, data: DryCleanerUpdate) -> DryCleanerRead:
        updated = self.repository.update(
            dry_cleaner_id,
            data.model_dump(exclude_unset=True)
        )

        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"DryCleaner with id {dry_cleaner_id} not found"
            )

        return DryCleanerRead.model_validate(updated)

    def delete_dry_cleaner(self, dry_cleaner_id: int):
        dry_cleaner = self.repository.get_by_id(dry_cleaner_id)

        if not dry_cleaner:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"DryCleaner with id {dry_cleaner_id} not found"
            )

        if dry_cleaner.orders:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete the dry cleaner because there are associated orders."
            )

        self.repository.delete(dry_cleaner_id)

        return {"message": "Dry cleaner deleted successfully"}