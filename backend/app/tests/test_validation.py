import pytest
from pydantic import ValidationError


def test_invalid_email_raises_error():
    from app.schemas.user import UserRegister
    with pytest.raises(ValidationError):
        UserRegister(
            name="Тест",
            surname="Користувач",
            email="not-an-email",
            phone_number="+380671234567",
            password="1234",
            role="клієнт"
        )


def test_password_too_short_raises_error():
    from app.schemas.user import UserRegister
    with pytest.raises(ValidationError):
        UserRegister(
            name="Тест",
            surname="Користувач",
            email="test@gmail.com",
            phone_number="+380671234567",
            password="123",  # менше 4 символів
            role="клієнт"
        )


def test_valid_user_register():
    from app.schemas.user import UserRegister
    user = UserRegister(
        name="Анна",
        surname="Бут",
        email="anna@gmail.com",
        phone_number="+380671234567",
        password="1234",
        role="клієнт"
    )
    assert user.email == "anna@gmail.com"
    assert user.role == "клієнт"


def test_user_role_enum_values():
    from app.schemas.user import UserRole
    assert UserRole.COURIER == "кур'єр"
    assert UserRole.ADMIN == "адміністратор"
    assert UserRole.USER == "клієнт"
    assert UserRole.CHIEF == "керівник"


def test_user_update_partial():
    from app.schemas.user import UserUpdate
    data = {"name": "Нове ім'я"}
    update = UserUpdate.model_validate(data)
    assert update.name == "Нове ім'я"
    assert update.email is None
    assert update.phone_number is None