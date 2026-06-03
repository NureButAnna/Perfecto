from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.chat import AIChat


def create_chat(
    db: Session,
    message: str,
    answer: str,
    client_id: Optional[int] = None,
    session_id: Optional[str] = None,
) -> AIChat:
    chat = AIChat(
        client_id=client_id,
        session_id=session_id,
        message=message,
        answer=answer,
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def get_chat(db: Session, chat_id: int) -> Optional[AIChat]:
    return db.query(AIChat).filter(
        AIChat.chat_id == chat_id
    ).first()


def get_history_by_client(
    db: Session,
    client_id: int,
) -> List[AIChat]:
    return (
        db.query(AIChat)
        .filter(AIChat.client_id == client_id)
        .order_by(AIChat.date.asc())
        .all()
    )


def get_history_by_session(
    db: Session,
    session_id: str,
) -> List[AIChat]:

    return (
        db.query(AIChat)
        .filter(AIChat.session_id == session_id)
        .order_by(AIChat.date.asc())
        .all()
    )


def attach_session_to_client(
    db: Session,
    session_id: str,
    client_id: int,
) -> int:

    updated = (
        db.query(AIChat)
        .filter(
            AIChat.session_id == session_id,
            AIChat.client_id.is_(None),
        )
        .update(
            {"client_id": client_id},
            synchronize_session="fetch",
        )
    )
    db.commit()
    return updated