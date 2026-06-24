from decimal import Decimal
import pytest

def test_service_read_with_image():
    from app.schemas.service import ServiceRead
    data = {
        "id": 1,
        "name": "Хімчитка пуховика",
        "price": Decimal("900.00"),
        "duration": 0,
        "description": "Професійна хімчистка пуховиків",
        "rating": Decimal("5.0"),
        "category_id": 1,
        "dry_cleaner_id": 5,
        "image": {
            "link": "https://perfectoservicestorage.blob.core.windows.net/img/2564f5f3-5e50-4a34-8431-cd0ef5003512.png"
        }
    }
    service = ServiceRead.model_validate(data)
    assert service.id == 1
    assert service.name == "Хімчитка пуховика"
    assert service.price == Decimal("900.00")
    assert service.rating == Decimal("5.0")
    assert service.image_url == "https://perfectoservicestorage.blob.core.windows.net/img/2564f5f3-5e50-4a34-8431-cd0ef5003512.png"


def test_service_read_without_image():
    from app.schemas.service import ServiceRead
    data = {
        "id": 20,
        "name": "Хімчистка піджака",
        "price": Decimal("500.00"),
        "duration": 24,
        "description": "Видалення забруднень та освіження піджака",
        "rating": Decimal("4.0"),
        "category_id": 7,
        "dry_cleaner_id": 9,
        "image": None
    }
    service = ServiceRead.model_validate(data)
    assert service.id == 20
    assert service.image is None
    assert service.image_url is None


def test_service_read_optional_rating():
    from app.schemas.service import ServiceRead
    data = {
        "id": 5,
        "name": "Тестова послуга",
        "price": Decimal("300.00"),
        "duration": 12,
        "description": "Опис послуги",
        "rating": None,
        "category_id": None,
        "dry_cleaner_id": 5,
        "image": None
    }
    service = ServiceRead.model_validate(data)
    assert service.rating is None
    assert service.category_id is None