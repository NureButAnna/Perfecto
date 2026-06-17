from sqlalchemy.orm import Session

class BaseRepository:
    model = None

    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(self.model).all()

    def get_by_id(self, item_id: int):
        return (
            self.db.query(self.model)
            .filter(self.model.id == item_id)
            .first()
        )

    def create(self, data: dict):
        db_item = self.model(**data)

        self.db.add(db_item)
        self.db.commit()
        self.db.refresh(db_item)

        return db_item

    def update(self, item_id: int, data: dict):
        db_item = self.get_by_id(item_id)

        if not db_item:
            return None

        for key, value in data.items():
            setattr(db_item, key, value)

        self.db.commit()
        self.db.refresh(db_item)

        return db_item

    def delete(self, item_id: int):
        db_item = self.get_by_id(item_id)

        if not db_item:
            return None

        self.db.delete(db_item)
        self.db.commit()

        return db_item