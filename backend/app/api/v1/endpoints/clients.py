from fastapi import APIRouter, Depends, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.client import ClientService
from app.schemas.user import ClientRead, UserRegister

router = APIRouter(
    prefix="/clients",
    tags=["Client"]
)

@router.get("/", response_model=List[ClientRead], status_code=status.HTTP_200_OK)
def get_clients(db: Session = Depends(get_db)):
    client = ClientService(db)
    return client.get_all_clients()

@router.get("/{client_id}", response_model=ClientRead, status_code=status.HTTP_200_OK)
def get_service(client_id: int, db: Session = Depends(get_db)):
    client = ClientService(db)
    return client.get_service_by_id(client_id)
