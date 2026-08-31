"""
JACRAL – Admin: Analytics & Dashboard.

GET /api/v1/admin/analytics/dashboard   MANAGER+
GET /api/v1/admin/analytics/utm         MANAGER+
GET /api/v1/admin/analytics/traffic     MANAGER+
GET /api/v1/admin/analytics/top-products MANAGER+
GET /api/v1/admin/audit-logs            ADMIN
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.schemas.analytics import DashboardOverview, TopProduct, TrafficOverview
from app.security.permissions import require_admin, require_manager
from app.services import analytics_service
from app.utils.pagination import PaginatedResponse, PaginationParams

router = APIRouter(tags=["Admin – Analytics"])


@router.get("/dashboard", response_model=DashboardOverview, summary="Admin dashboard overview")
def dashboard(db: Session = Depends(get_db), _: User = Depends(require_manager)):
    return analytics_service.get_dashboard_overview(db)


@router.get("/top-products", response_model=list[TopProduct], summary="Top selling products")
def top_products(limit: int = Query(default=10, ge=1, le=50), db: Session = Depends(get_db), _: User = Depends(require_manager)):
    return analytics_service.get_top_products(db, limit=limit)


@router.get("/traffic", response_model=TrafficOverview, summary="UTM traffic overview")
def traffic(db: Session = Depends(get_db), _: User = Depends(require_manager)):
    return analytics_service.get_traffic_overview(db)


@router.get("/utm", response_model=TrafficOverview, summary="UTM analytics (alias)")
def utm(db: Session = Depends(get_db), _: User = Depends(require_manager)):
    return analytics_service.get_traffic_overview(db)


@router.get("/audit-logs", summary="Audit logs (admin only)")
def audit_logs(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=50, ge=1, le=200),
    action: str = Query(default=None),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    pagination = PaginationParams(page=page, limit=limit)
    q = db.query(AuditLog)
    if action:
        q = q.filter(AuditLog.action == action)
    total = q.count()
    items = q.order_by(AuditLog.created_at.desc()).offset(pagination.offset).limit(pagination.limit).all()

    def _serialize(log):
        return {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "details": log.details,
            "ip_address": log.ip_address,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }

    return PaginatedResponse.build(items=[_serialize(l) for l in items], total=total, pagination=pagination)
