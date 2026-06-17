from sqlalchemy.orm import Session

from app.repositories.chats import create_chat
from app.repositories.images import ImageRepository
from app.schemas.image import ImageCreate
from app.services.redis import save_message
from app.services.azure_ai import analyze_image
from app.services.blob_storage import AzureBlobService

blob_service = AzureBlobService()


async def analyze_chat_photo(
    db: Session,
    identifier: str,
    is_guest: bool,
    message: str,
    file,
) -> dict:

    image_url = await blob_service.upload_image(file)

    ai_answer = await analyze_image(
        image_url=image_url,
        question=message,
    )

    chat = create_chat(
        db=db,
        message=message,
        answer=ai_answer,
        client_id=None if is_guest else int(identifier),
        session_id=identifier if is_guest else None,
    )

    image_repo = ImageRepository(db)
    image_repo.create(
        ImageCreate(
            link=image_url,
            chat_id=chat.chat_id,
        )
    )

    save_message(identifier, {"role": "user",      "content": message},   is_guest)
    save_message(identifier, {"role": "assistant", "content": ai_answer}, is_guest)

    return {
        "chat_id":   chat.chat_id,
        "image_url": image_url,
        "answer":    ai_answer,
    }