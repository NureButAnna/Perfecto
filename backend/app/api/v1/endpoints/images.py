from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.repositories.images import ImageRepository
from app.services.images import ImageService
from app.schemas.images import ImageRead

from app.dependencies import get_image_service

router = APIRouter(
    prefix="/images",
    tags=["Images"]
)

from fastapi import APIRouter, Depends

@router.post("/", response_model=ImageRead)
async def upload_image(
    file: UploadFile = File(...),
    description: Optional[str] = Form(None),
    chat_id: Optional[int] = Form(None),
    response_id: Optional[int] = Form(None),
    service_id: Optional[int] = Form(None),
    service: ImageService = Depends(get_image_service)
):
    return await service.upload_image(
        file=file,
        description=description,
        chat_id=chat_id,
        response_id=response_id,
        service_id=service_id
    )