import uuid

from azure.storage.blob import BlobServiceClient
from fastapi import UploadFile

from app.config import settings


class AzureBlobService:

    def __init__(self):
        self.client = BlobServiceClient.from_connection_string(
            settings.azure_storage_connection_string
        )

        self.container = self.client.get_container_client(
            settings.azure_container_name
        )

    async def upload_image(self, file: UploadFile):

        file_extension = file.filename.split(".")[-1]

        blob_name = f"{uuid.uuid4()}.{file_extension}"

        blob_client = self.container.get_blob_client(blob_name)

        content = await file.read()

        blob_client.upload_blob(
            content,
            overwrite=True,
            content_type=file.content_type
        )

        return blob_client.url