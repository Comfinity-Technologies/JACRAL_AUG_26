"""
JACRAL – Admin: Order management.

GET   /api/v1/admin/orders              STAFF+
GET   /api/v1/admin/orders/{id}         STAFF+
PATCH /api/v1/admin/orders/{id}/status  STAFF+
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order
from app.models.user import User
from app.schemas.order import OrderOut, OrderStatusUpdate
from app.security.permissions import require_staff
from app.services import audit_service, email_service
from app.utils.pagination import PaginatedResponse, PaginationParams

router = APIRouter(tags=["Admin – Orders"])


@router.get("", summary="List all orders (admin)")
def list_orders_admin(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    status_filter: str = Query(default=None, alias="status"),
    payment_status: str = Query(default=None),
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    pagination = PaginationParams(page=page, limit=limit)
    q = db.query(Order)
    if status_filter:
        q = q.filter(Order.status == status_filter)
    if payment_status:
        q = q.filter(Order.payment_status == payment_status)
    total = q.count()
    items = q.order_by(Order.created_at.desc()).offset(pagination.offset).limit(pagination.limit).all()
    return PaginatedResponse.build(items=[OrderOut.model_validate(o) for o in items], total=total, pagination=pagination)


@router.get("/{order_id}", response_model=OrderOut, summary="Get any order (admin)")
def get_order_admin(order_id: int, db: Session = Depends(get_db), _staff: User = Depends(require_staff)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order


@router.patch("/{order_id}/status", response_model=OrderOut, summary="Update order status")
def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    staff: User = Depends(require_staff),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    old_status = order.status
    order.status = data.status
    db.commit()
    db.refresh(order)

    audit_service.log_action(
        db, "ORDER_STATUS_UPDATED", staff.id, "order", str(order_id),
        {"old_status": old_status, "new_status": data.status}
    )
    db.commit()

    # Send email notifications for key status changes
    if data.status == "confirmed":
        email_service.send_order_confirmed(order.shipping_email, order.id)
    elif data.status == "shipped":
        email_service.send_order_shipped(order.shipping_email, order.id, order.shipment_id)
    elif data.status == "delivered":
        email_service.send_order_delivered(order.shipping_email, order.id)
    elif data.status == "cancelled":
        email_service.send_order_cancelled(order.shipping_email, order.id)

    return order
