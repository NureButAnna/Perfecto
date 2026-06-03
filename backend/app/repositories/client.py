from sqlalchemy.orm import Session
from typing import List, Optional

from ..models.client import Client
from ..schemas.user import UserRegister


class ClientRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Client]:
        return self.db.query(Client).all()

    def get_by_id(self, client_id: int) -> Optional[Client]:
        return (
            self.db.query(Client)
            .filter(Client.client_id == client_id)
            .first()
        )

    def create(self, service_data: UserRegister) -> Client:
        db_service = Client(**service_data.model_dump())

        self.db.add(db_service)
        self.db.commit()
        self.db.refresh(db_service)

        return db_service

    def delete(self, client_id: int) -> Client:
        db_client = self.get_by_id(client_id)

        if not db_client:
            return None

        self.db.delete(db_client)
        self.db.commit()

        return db_client
