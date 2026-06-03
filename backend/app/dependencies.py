from app.database import get_db
from app.repositories.image import ImageRepository
from app.services.blob_storage import AzureBlobService
from app.services.image import ImageService
from sqlalchemy.orm import Session
from fastapi import Depends

def get_blob_service():
    return AzureBlobService()

def get_image_service(
    db: Session = Depends(get_db),
    blob: AzureBlobService = Depends(get_blob_service),
):
    repo = ImageRepository(db)
    return ImageService(repo, blob)