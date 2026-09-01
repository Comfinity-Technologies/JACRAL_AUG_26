"""
JACRAL – Admin: User management.

GET    /api/v1/admin/users              ADMIN
GET    /api/v1/admin/users/{id}         ADMIN
PATCH  /api/v1/admin/users/{id}         ADMIN
PATCH  /api/v1/admin/users/{id}/status  ADMIN
PATCH  /api/v1/admin/users/{id}/role    ADMIN
DELETE /api/v1/admin/users/{id}         ADMIN
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserRoleUpdate, UserStatusUpdate, UserUpdate
from app.security.permissions import require_admin
from app.services import audit_service
from app.utils.pagination import PaginatedResponse, PaginationParams

router = APIRouter(tags=["Admin – Users"])


@router.get("", response_model=PaginatedResponse[UserOut], summary="List all users")
def list_users(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    role: str = Query(default=None),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    pagination = PaginationParams(page=page, limit=limit)
    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    total = q.count()
    items = q.order_by(User.created_at.desc()).offset(pagination.offset).limit(pagination.limit).all()
    return PaginatedResponse.build(items=[UserOut.model_validate(u) for u in items], total=total, pagination=pagination)


@router.get("/{user_id}", response_model=UserOut, summary="Get a user")
def get_user(user_id: int, db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


@router.patch("/{user_id}", response_model=UserOut, summary="Update user profile")
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    audit_service.log_action(db, "USER_UPDATED", admin.id, "user", str(user_id))
    db.commit()
    return user


@router.patch("/{user_id}/status", response_model=UserOut, summary="Activate or deactivate a user")
def update_user_status(
    user_id: int,
    data: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot change your own status.")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.is_active = data.is_active
    db.commit()
    db.refresh(user)
    action = "USER_ACTIVATED" if data.is_active else "USER_DEACTIVATED"
    audit_service.log_action(db, action, admin.id, "user", str(user_id))
    db.commit()
    return user


@router.patch("/{user_id}/role", response_model=UserOut, summary="Change a user's role")
def update_user_role(
    user_id: int,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role.")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.role = data.role
    db.commit()
    db.refresh(user)
    audit_service.log_action(db, "USER_ROLE_CHANGED", admin.id, "user", str(user_id), {"new_role": data.role})
    db.commit()
    return user


@router.delete("/{user_id}", summary="Deactivate (soft-delete) a user")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself.")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.is_active = False
    db.commit()
    audit_service.log_action(db, "USER_DEACTIVATED", admin.id, "user", str(user_id))
    db.commit()
    return {"success": True, "message": "User deactivated."}
