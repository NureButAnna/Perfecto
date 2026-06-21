from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.dependencies import require_role
from app.models.delivery import Delivery
from app.schemas.user import UserRead, UserRole
from app.schemas.order import OrderRead
from app.services.users import UserService
from app.services.orders import OrderService
from app.models import User

router = APIRouter(
    prefix="/admin",
    tags=["Admin 🛠️"]
)

@router.get("/users", response_model=List[UserRead])
def get_clients(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    svc = UserService(db)
    users = svc.get_users_by_role("клієнт")
    if search:
        q = search.lower()
        users = [
            u for u in users
            if q in (u.name or "").lower()
            or q in (u.surname or "").lower()
            or q in (u.email or "").lower()
        ]
    return users


@router.patch("/users/{user_id}/status", response_model=UserRead)
def toggle_user_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    svc = UserService(db)
    return svc.update_user_status(user_id, is_active)


@router.delete("/users/{user_id}", status_code=status.HTTP_200_OK)
def delete_client(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    return UserService(db).delete_user(user_id)


@router.get("/staff", response_model=List[UserRead])
def get_staff(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    svc = UserService(db)

    staff = svc.get_users_by_role("кур'єр", "адміністратор")

    if search:
        q = search.lower()
        staff = [
            u for u in staff
            if q in (u.name or "").lower()
            or q in (u.surname or "").lower()
            or q in (u.email or "").lower()
        ]

    return staff


@router.patch("/staff/{user_id}/status", response_model=UserRead)
def toggle_staff_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    svc = UserService(db)
    user = svc.get_user_by_id(user_id)

    new_role = user.role if is_active else "заблокований"
    return svc.change_user_role(user_id, UserRole(new_role))


@router.patch("/staff/{user_id}/role", response_model=UserRead)
def change_staff_role(
    user_id: int,
    role: UserRole,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    return UserService(db).change_user_role(user_id, role)


@router.delete("/staff/{user_id}", status_code=status.HTTP_200_OK)
def delete_staff(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    return UserService(db).delete_user(user_id)


@router.get("/couriers", response_model=List[UserRead])
def get_couriers(
        db: Session = Depends(get_db),
        current_user: User = Depends(require_role("адміністратор"))):
    return UserService(db).get_users_by_role("кур'єр")



ALLOWED_STATUSES = {"new", "accepted", "progress", "ready", "done", "cancelled"}


@router.get("/orders", response_model=List[OrderRead])
def get_orders(
    order_status: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    svc = OrderService(db)
    orders = svc.get_all_orders()
    if order_status:
        orders = [o for o in orders if o.status == order_status]
    return orders


@router.patch("/orders/{order_id}/status", response_model=OrderRead)
def update_order_status(
    order_id: int,
    new_status: str = Query(..., alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    if new_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Недозволений статус. Дозволені: {sorted(ALLOWED_STATUSES)}"
        )
    return OrderService(db).update_order_status(order_id, new_status)


@router.patch("/orders/{order_id}/courier", response_model=OrderRead)
def assign_courier(
    order_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    courier = UserService(db).get_user_by_id(user_id)

    if not courier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Користувача не знайдено"
        )

    if courier.role != "кур'єр":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вказаний користувач не є кур'єром"
        )

    delivery = db.query(Delivery).filter(
        Delivery.order_id == order_id
    ).first()

    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Доставку для цього замовлення не знайдено"
        )

    delivery.user_id = user_id

    db.commit()
    db.refresh(delivery)

    return OrderService(db).get_order_by_id(order_id)

@router.get("/export/{type}")
def export_data(
    type: str,
    from_date: str = Query(None, alias="from"),
    to_date: str = Query(None, alias="to"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    if type == "orders":
        data = OrderService(db).get_all_orders()

    elif type == "staff":
        data = UserService(db).get_users_by_role("персонал")

    elif type == "clients":
        data = UserService(db).get_users_by_role("клієнт")

    else:
        raise HTTPException(404, "Unknown export type")

    return data