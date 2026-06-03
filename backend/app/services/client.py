from sqlalchemy.orm import Session
from typing import List

from app.schemas.user import UserRegister, ClientRead
from ..repositories.client import ClientRepository
from fastapi import HTTPException, status


class ClientService:
    def __init__(self, db: Session):
        self.repository = ClientRepository(db)

    def get_all_clients(self) -> List[ClientRead]:
        clients = self.repository.get_all()
        return [ClientRead.model_validate(client) for client in clients]

    def get_client_by_id(self, client_id: int ) -> ClientRead:
        client = self.repository.get_by_id(client_id)
        if not client:
            raise HTTPException(
              status_code=status.HTTP_404_NOT_FOUND,
              detail=f'Service with id {client_id} not found'
            )
        return ClientRead.model_validate(client)

    def create_client(self, client_data: UserRegister) -> ClientRead:
        client = self.repository.create(client_data)
        return ClientRead.model_validate(client)

    def delete_client(self, client_id: int):
        client = self.repository.delete(client_id)

        if not client:
            raise HTTPException(
                status_code=404,
                detail="Client not found"
            )

        return {
            "message": "Client deleted successfully"
        }