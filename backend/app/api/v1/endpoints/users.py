from fastapi import APIRouter, Depends, status
from typing import List

from app.schemas.user import UserRead, UserRegister, UserUpdate, UserRole
from app.services.users import UserService
from app.dependencies import get_user_service
from sqlalchemy.orm import Session

from app.database import get_db

from app.dependencies import get_current_user
from app.models import User

router = APIRouter(
    prefix="/users",
    tags=["User 👤"]
)

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get( "/role/{role}", response_model=List[UserRead])
def get_users_by_role(
    role: str,
    service: UserService = Depends(get_user_service)
):
    return service.get_users_by_role(role)


@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: int,
    service: UserService = Depends(get_user_service)
):
    return service.get_user_by_id(user_id)


@router.post("/",response_model=UserRead)
def create_user(
    user_data: UserRegister,
    service: UserService = Depends(get_user_service)
):

    return service.create_user(user_data)


@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    service: UserService = Depends(get_user_service)
):
    return service.update_user(user_id, user_data)


@router.delete("/{user_id}",status_code=status.HTTP_200_OK)
def delete_user(
    user_id: int,
    service: UserService = Depends(get_user_service)
):
    return service.delete_user(user_id)


@router.patch("/{user_id}/role", response_model=UserRead)
def update_role(
    user_id: int,
    role: UserRole,
    db: Session = Depends(get_db)
):
    service = UserService(db)
    return service.change_user_role(user_id, role)
