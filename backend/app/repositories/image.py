from sqlalchemy.orm import Session
from typing import List, Optional

from ..models.image import Image
from ..schemas.image import ImageCreate


class ImageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Image]:
        return self.db.query(Image).all()

    def get_by_id(self, image_id: int) -> Optional[Image]:
        return (
            self.db.query(Image)
            .filter(Image.image_id == image_id)
            .first()
        )

    def create(self, image_data: ImageCreate) -> Image:
        db_image = Image(**image_data.model_dump())

        self.db.add(db_image)
        self.db.commit()
        self.db.refresh(db_image)

        return db_image