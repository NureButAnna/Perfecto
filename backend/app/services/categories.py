from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from ..models import Category
from ..schemas.category import CategoryUpdate, CategoryRead, CategoryCreate
from ..repositories.base import BaseRepository


class CategoryService:
    def __init__(self, db: Session):
        self.repository = BaseRepository(db)
        self.repository.model = Category

    def get_all_categories(self) -> List[CategoryRead]:
        categories = self.repository.get_all()
        return [CategoryRead.model_validate(c) for c in categories]

    def get_category_by_id(self, category_id: int) -> CategoryRead:
        category = self.repository.get_by_id(category_id)

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Review with id {category_id} not found"
            )

        return CategoryRead.model_validate(category)

    def update_category(self, category_id: int, data: CategoryUpdate):
        updated = self.repository.update(
            category_id,
            data.model_dump(exclude_unset=True)
        )

        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )

        return CategoryRead.model_validate(updated)

    def create_category(self, data: CategoryCreate) -> CategoryRead:
        updated = self.repository.create(
            data.model_dump()
        )

        return CategoryRead.model_validate(updated)

    def delete_category(self, category_id):
        deleted = self.repository.delete( category_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )

        return {"message": "Category deleted successfully"}