import json
import redis
from app.config import settings


redis_client = redis.Redis(
    host=settings.redis_host,
    password=settings.redis_key,
    port=6380,
    ssl=True,
    decode_responses=True,
    socket_connect_timeout=5,
    socket_timeout=5,
    retry_on_timeout=True,
)

CHAT_TTL_SECONDS = 60 * 60 * 24


def get_chat_key(identifier: str, is_guest: bool = False) -> str:
    prefix = "guest" if is_guest else "user"
    return f"chat:{prefix}:{identifier}"


def save_message(
    identifier: str,
    message: dict,
    is_guest: bool = False,
) -> None:
    try:
        key = get_chat_key(identifier, is_guest)
        redis_client.rpush(key, json.dumps(message, ensure_ascii=False))
        redis_client.expire(key, CHAT_TTL_SECONDS)
    except Exception as e:
        print(f"[Redis] save_message error: {e}")


def get_chat_history(
    identifier: str,
    is_guest: bool = False,
) -> list:
    try:
        key = get_chat_key(identifier, is_guest)
        messages = redis_client.lrange(key, 0, -1)
        return [json.loads(m) for m in messages]
    except Exception as e:
        print(f"[Redis] get_chat_history error: {e}")
        return []


def migrate_guest_history(
    session_id: str,
    client_id: int,
) -> None:

    try:
        guest_key = get_chat_key(session_id, is_guest=True)
        user_key  = get_chat_key(str(client_id), is_guest=False)

        messages = redis_client.lrange(guest_key, 0, -1)
        if messages:
            redis_client.rpush(user_key, *messages)
            redis_client.expire(user_key, CHAT_TTL_SECONDS)
            redis_client.delete(guest_key)
    except Exception as e:
        print(f"[Redis] migrate_guest_history error: {e}")