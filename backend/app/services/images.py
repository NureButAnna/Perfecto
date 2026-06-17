from typing import Optional
from fastapi import UploadFile, HTTPException
from fastapi.concurrency import run_in_threadpool

from app.repositories.images import ImageRepository
from app.schemas.image import ImageCreate
from app.services.blob_storage import AzureBlobService
from app.models.image import Image


class ImageService:
    def __init__(self, repository, storage: AzureBlobService):
        self.repository = repository
        self.storage = storage

    async def upload_to_chat(self, chat_id: int, file, description: str | None):
        url = await self.storage.upload_image(file)

        image = ImageCreate(
            link=url,
            description=description,
            chat_id=chat_id
        )

        return self.repository.create(image)

    async def upload_to_response(self, response_id: int, file, description: str | None):
        url = await self.storage.upload_image(file)

        image = ImageCreate(
            link=url,
            description=description,
            response_id=response_id
        )

        return self.repository.create(image)

    async def upload_to_service(self, service_id: int, file, description: str | None):
        url = await self.storage.upload_image(file)

        image = ImageCreate(
            link=url,
            description=description,
            service_id=service_id
        )

        return self.repository.create(image)