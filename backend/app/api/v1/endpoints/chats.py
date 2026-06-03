import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, Header, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.chat import analyze_chat_photo
from app.services.azure_ai import continue_conversation, get_openai_client
from app.services.redis import get_chat_history, save_message, migrate_guest_history
from app.repositories.chat import (
    get_history_by_client,
    get_history_by_session,
    attach_session_to_client,
)

router = APIRouter(prefix="/ai-chats", tags=["AI Chats"])


def _resolve_identifier(
    client_id: int | None,
    session_id: str | None,
) -> tuple[str, bool]:

    if not client_id and not session_id:
        raise HTTPException(
            status_code=400,
            detail="Потрібен client_id або X-Session-ID",
        )
    is_guest = client_id is None
    return (session_id if is_guest else str(client_id)), is_guest


@router.post("/analyze")
async def analyze_photo(
    message:    str        = Form(...),
    file:       UploadFile = File(...),
    client_id:  int | None = Form(None),
    x_session_id: str | None = Header(None),
    db: Session = Depends(get_db),
):
    identifier, is_guest = _resolve_identifier(client_id, x_session_id)
    return await analyze_chat_photo(
        db=db,
        identifier=identifier,
        is_guest=is_guest,
        message=message,
        file=file,
    )


@router.post("/continue")
async def continue_chat(
    message:    str        = Form(...),
    client_id:  int | None = Form(None),
    x_session_id: str | None = Header(None),
    db: Session = Depends(get_db),
):
    identifier, is_guest = _resolve_identifier(client_id, x_session_id)

    history   = get_chat_history(identifier, is_guest)
    ai_answer = await continue_conversation(history, message)

    save_message(identifier, {"role": "user",      "content": message},   is_guest)
    save_message(identifier, {"role": "assistant", "content": ai_answer}, is_guest)

    return {"answer": ai_answer}

@router.get("/history")
def get_history(
    client_id:    int | None = None,
    x_session_id: str | None = Header(None),
    db: Session = Depends(get_db),
):

    if client_id:
        chats = get_history_by_client(db, client_id)
    elif x_session_id:
        chats = get_history_by_session(db, x_session_id)
    else:
        raise HTTPException(
            status_code=400,
            detail="Потрібен client_id або X-Session-ID",
        )

    return [
        {
            "chat_id":   c.chat_id,
            "message":   c.message,
            "answer":    c.answer,
            "date":      c.date.isoformat(),
        }
        for c in chats
    ]


@router.post("/attach-session")
def attach_session(
    client_id:    int = Form(...),
    x_session_id: str | None = Header(None),
    db: Session = Depends(get_db),
):

    if not x_session_id:
        raise HTTPException(status_code=400, detail="X-Session-ID обов'язковий")

    updated = attach_session_to_client(db, x_session_id, client_id)
    migrate_guest_history(x_session_id, client_id)

    return {
        "migrated_chats": updated,
        "message": f"Перенесено {updated} діалогів на клієнта #{client_id}",
    }