from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.schemas.user import UserRegister, UserUpdate, UserRead, UserRole
from app.repositories.users import UserRepository

from app.security import verify_password, get_password_hash


class UserService:
    def __init__(self, db: Session):
        self.repository = UserRepository(db)

    def get_users_by_role(self, role: str) -> list[UserRead]:
        users = self.repository.get_by_role(role)
        return [UserRead.model_validate(user) for user in users]

    def get_user_by_id(self, user_id: int) -> UserRead:
        user = self.repository.get_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )

        return UserRead.model_validate(user)

    def create_user(self, user_data: UserRegister) -> UserRead:
        if self.repository.get_by_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        if self.repository.get_by_phone(user_data.phone_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this phone number already exists"
            )

        user_data.role = "клієнт"

        user = self.repository.create(user_data)

        return UserRead.model_validate(user)

    def update_user(self, user_id: int, user_data: UserUpdate) -> UserRead:
        user = self.repository.update(user_id, user_data)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )

        return UserRead.model_validate(user)

    def delete_user(self, user_id: int):
        deleted = self.repository.delete(user_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )

        return {
            "message": "User deleted successfully"
        }

    def get_user_by_email(self, email: str):
        return self.repository.get_user_by_email(email)

    def authenticate_user(self, email: str, password: str):
        user = self.repository.get_user_by_email(email)

        if not user:
            return None

        if not verify_password(password, user.password):
            return None

        return user

    def user_registration(self, user_data: UserRegister) -> UserRead:
        existing_user = self.repository.get_user_by_email(user_data.email)

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Користувач з email '{user_data.email}' вже існує"
            )

        hashed_password = get_password_hash(user_data.password)

        data = user_data.model_dump()
        data["password"] = hashed_password
        data["role"] = "клієнт"

        user = self.repository.create(data)

        return UserRead.model_validate(user)

    def change_user_role(self, user_id: int, role: UserRole) -> UserRead:
        user = self.repository.get_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        updated_user = self.repository.update(
            user_id,
            {"role": role.value}
        )

        return UserRead.model_validate(updated_user)