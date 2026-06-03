from fastapi import APIRouter, Depends, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.service import ServiceService
from app.services.image import ImageService
from app.schemas.service import ServiceRead, ServiceCreate

from app.dependencies import get_image_service


router = APIRouter(
    prefix="/services",
    tags=["Services"]
)

@router.get("/", response_model=List[ServiceRead], status_code=status.HTTP_200_OK)
def get_services(db: Session = Depends(get_db)):
    service = ServiceService(db)
    return service.get_all_services()


@router.get("/{service_id}", response_model=ServiceRead, status_code=status.HTTP_200_OK)
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = ServiceService(db)
    return service.get_service_by_id(service_id)

@router.post("/", response_model=ServiceCreate)
def add_service(service_data: ServiceCreate,db: Session = Depends(get_db)):
    service = ServiceService(db)
    return service.create_service(service_data)

@router.delete("/{service_id}", status_code=status.HTTP_200_OK)
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = ServiceService(db)
    return service.delete_service(service_id)

@router.post("/services/{service_id}/images")
async def upload_service_image(
    service_id: int,
    file: UploadFile = File(...),
    description: str | None = Form(None),
    service: ImageService = Depends(get_image_service)
):
    return await service.upload_to_service(service_id, file, description)