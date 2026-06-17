from fastapi import APIRouter, Depends, status, UploadFile, File, Form
from typing import List

from app.services.services import ServService
from app.schemas.service import ServiceRead, ServiceCreate, ServiceUpdate
from app.dependencies import get_serv_service

router = APIRouter(
    prefix="/services",
    tags=["Service 🌟"]
)

@router.get("/", response_model=List[ServiceRead], status_code=status.HTTP_200_OK)
def get_services(service:ServService = Depends(get_serv_service)):
    return service.get_all_services()


@router.get("/{service_id}", response_model=ServiceRead, status_code=status.HTTP_200_OK)
def get_service(
    service_id: int,
    service: ServService = Depends(get_serv_service)
):
    return service.get_service_by_id(service_id)


@router.get("/price/{price}", response_model=ServiceRead, status_code=status.HTTP_200_OK)
def get_service_by_price(
    service_id: int,
    service: ServService = Depends(get_serv_service)
):
    return service.get_service_by_price(service_id)


@router.post("/", response_model=ServiceCreate)
def create_service(
    service_data: ServiceCreate,
    service: ServService = Depends(get_serv_service)
):
    return service.create_service(service_data)


@router.put("/{service_id}", response_model=ServiceCreate)
def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    service: ServService = Depends(get_serv_service)
):
    return service.update_service(service_data)


@router.delete("/{service_id}", status_code=status.HTTP_200_OK)
def delete_service(
    service_id: int,
    service: ServService = Depends(get_serv_service)
):
    return service.delete_service(service_id)

# @router.post("/services/{service_id}/images")
# async def upload_service_image(
#     service_id: int,
#     file: UploadFile = File(...),
#     description: str | None = Form(None),
#     service: ImageService = Depends(get_image_service)
# ):
#     return await service.upload_to_service(service_id, file, description)