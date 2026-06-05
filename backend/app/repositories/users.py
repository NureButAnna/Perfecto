from .base import BaseRepository
from ..models.user import User


class UserRepository(BaseRepository):
    model = User

    def get_by_role(self, role: str):
        return (
            self.db.query(User)
            .filter(User.role == role)
            .all()
        )

    def get_user_by_email(self, email: str):
        return (
            self.db.query(User)
            .filter(User.email == email)
            .first()
        )

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