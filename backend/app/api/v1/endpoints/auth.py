from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.token import Token
from app.schemas.user import UserRegister, UserRead
from app.services.users import UserService
from app.security import create_access_token

from .app.dependencies import get_user_service

router = APIRouter(
    prefix="/auth",
    tags=["Auth 🔐"])


@router.post("/register", response_model=UserRead)
def register(
    user: UserRegister,
    service: UserService = Depends(get_user_service)
):
    return service.user_registration(user)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: UserService = Depends(get_user_service)
):

    user = service.authenticate_user(
        form_data.username,
        form_data.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": user.email}
    )

    return Token(
        access_token=access_token,
        token_type="bearer"
    )