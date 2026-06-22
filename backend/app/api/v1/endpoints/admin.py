import csv
import io

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.dependencies import require_role
from app.schemas.user import UserRead, UserRole
from app.schemas.order import OrderRead
from app.services.users import UserService
from app.services.orders import OrderService
from app.models import User
from starlette.responses import StreamingResponse

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

@router.patch("/staff/{user_id}/dry-cleaner", response_model=UserRead)
def change_staff_dry_cleaner(
    user_id: int,
    dry_cleaner_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    return UserService(db).change_user_dry_cleaner(user_id, dry_cleaner_id)


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
    current_user: User = Depends(require_role("адміністратор", "кур'єр"))
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
    return OrderService(db).assign_courier(order_id, user_id)

@router.get("/orders/{order_id}/couriers", response_model=List[UserRead])
def get_couriers_for_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("адміністратор"))
):
    order = OrderService(db).get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Замовлення не знайдено")

    return (
        db.query(User)
        .filter(
            User.role == "кур'єр",
            User.is_active == True,
            User.dry_cleaner_id == order.dry_cleaner_id
        )
        .all()
    )


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

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "Клієнт", "Послуги", "Вартість", "Статус", "Оплата", "Доставка", "Місто", "Дата"])

        for o in data:
            client = f"{o.user.surname} {o.user.name}" if o.user else "—"
            services = "; ".join(
                f"{s.service.name} x{s.number}" for s in o.order_services if s.service
            ) if o.order_services else "—"
            delivery_type = o.delivery.delivery_type if o.delivery else "—"
            city = o.delivery.city if o.delivery else "—"

            writer.writerow([
                o.id, client, services, o.total_cost,
                o.status, o.payment_method or "—",
                delivery_type, city,
                o.creation_date.strftime("%Y-%m-%d %H:%M")
            ])

        output.seek(0)
        content = "\ufeff" + output.getvalue()  # BOM для UTF-8

        return StreamingResponse(
            iter([content.encode("utf-8")]),
            media_type="text/csv; charset=utf-8",
            headers={"Content-Disposition": f"attachment; filename=orders.csv"}
        )

    raise HTTPException(404, "Unknown export type")