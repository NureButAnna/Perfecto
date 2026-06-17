from app.database import get_db
from app.repositories.images import ImageRepository
from app.services.blob_storage import AzureBlobService
from app.services.images import ImageService
from app.services.orders import OrderService
from app.services.deliveries import DeliveryService
from app.services.dry_cleaners import DryCleanerService
from app.services.categories import CategoryService
from app.services.users import UserService
from app.services.services import ServService
from app.services.items import ItemService
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from fastapi import Depends, HTTPException
from starlette import status

from app.models import User

from app.security import decode_access_token


def get_user_service(db=Depends(get_db)) -> UserService:
    return UserService(db)


def get_order_service(db=Depends(get_db)) -> OrderService:
    return OrderService(db)


def get_item_service(db=Depends(get_db)) -> ItemService:
    return ItemService(db)


def get_serv_service(db=Depends(get_db)) -> ServService:
    return ServService(db)


def get_delivery_service(db=Depends(get_db)) -> DeliveryService:
    return DeliveryService(db)


def get_dry_cleaner_service(db=Depends(get_db)) -> DryCleanerService:
    return DryCleanerService(db)


def get_blob_service():
    return AzureBlobService()


def get_category_service(db=Depends(get_db)) -> CategoryService:
    return CategoryService(db)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)

    if payload is None:
        raise credentials_exception

    email: str = payload.get("sub")

    if email is None:
        raise credentials_exception

    service = UserService(db)

    user = service.get_user_by_email(email)

    if user is None:
        raise credentials_exception

    return user


def require_role(*allowed_roles):
    def checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Forbidden"
            )
        return current_user
    return checker


def get_image_service(
    db: Session = Depends(get_db),
    blob: AzureBlobService = Depends(get_blob_service),
):
    repo = ImageRepository(db)
    return ImageService(repo, blob)

