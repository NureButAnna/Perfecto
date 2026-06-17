from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.item import ItemCreate, ItemRead, ItemUpdate
from app.repositories.items import ItemRepository


class ItemService:
    def __init__(self, db: Session):
        self.repository = ItemRepository(db)

    def get_all_items(self) -> List[ItemRead]:
        items = self.repository.get_all()
        return [ItemRead.model_validate(i) for i in items]

    def get_item_by_id(self, item_id: int) -> ItemRead:
        item = self.repository.get_by_id(item_id)

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item with id {item_id} not found"
            )

        return ItemRead.model_validate(item)

    def get_items_by_order(self, order_id: int) -> List[ItemRead]:
        items = self.repository.get_items_by_order_id(order_id)
        return [ItemRead.model_validate(i) for i in items]

    def create_item(self, data: ItemCreate) -> ItemRead:
        item = self.repository.create(
            data.model_dump()
        )

        return ItemRead.model_validate(item)

    def update_item(self, item_id: int, data: ItemUpdate) -> ItemRead:
        updated = self.repository.update(
            item_id,
            data.model_dump(exclude_unset=True)
        )

        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Item with id {item_id} not found"
            )

        return ItemRead.model_validate(updated)

    def delete_item(self, item_id: int):
        deleted = self.repository.delete(item_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Review with id {item_id} not found"
            )

        return {"message": "Item deleted successfully"}