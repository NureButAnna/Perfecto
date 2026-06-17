from sqlalchemy.orm import selectinload

from ..models.item import Item
from ..repositories.base import BaseRepository


class ItemRepository(BaseRepository):
    model = Item

    def get_items_by_order_id(self, order_id: int):
        return (
            self.db.query(Item)
            .filter(Item.order_id == order_id)
            .options(
                selectinload(Item.order)
            )
            .all()
        )