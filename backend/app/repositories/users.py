from .base import BaseRepository
from ..models.user import User


class UserRepository(BaseRepository):
    model = User

    def get_by_role(self, roles: list[str]):
        return (
            self.db.query(User)
            .filter(User.role.in_(roles))
            .all()
        )

    def get_user_by_email(self, email: str):
        return (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

    def update_status(self, user_id: int, is_active: bool):
        user = self.get_by_id(user_id)

        if not user:
            return None

        user.is_active = is_active
        self.db.commit()
        self.db.refresh(user)

        return user

    def get_client_by_id(self, user_id: int):
        return (
            self.db.query(User)
            .filter(
                User.id == user_id,
                User.role == "клієнт"
            )
            .first()
        )

    def get_courier_by_id(self, user_id: int):
        return (
            self.db.query(User)
            .filter(
                User.id == user_id,
                User.role == "кур'єр"
            )
            .first()
        )

    def get_admin_by_id(self, user_id: int):
        return (
            self.db.query(User)
            .filter(
                User.id == user_id,
                User.role == "адміністратор"
            )
            .first()
        )

    def get_chief_by_id(self, user_id: int):
        return (
            self.db.query(User)
            .filter(
                User.id == user_id,
                User.role == "керівник"
            )
            .first()
        )