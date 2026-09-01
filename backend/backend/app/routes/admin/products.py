"""
JACRAL – Admin: Product management.

POST   /api/v1/admin/products              MANAGER+
GET    /api/v1/admin/products              STAFF+
PATCH  /api/v1/admin/products/{id}         MANAGER+
DELETE /api/v1/admin/products/{id}         MANAGER+
PATCH  /api/v1/admin/products/{id}/status  MANAGER+
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from slugify import slugify

from app.database import get_db
from app.models.product import Product
from app.models.user import User
from app.schemas.product import ProductCreate, ProductOut, ProductStatusUpdate, ProductUpdate
from app.security.permissions import require_manager, require_staff
from app.services import audit_service
from app.utils.pagination import PaginatedResponse, PaginationParams

router = APIRouter(tags=["Admin – Products"])


def _unique_slug(db: Session, name: str, exclude_id: int | None = None) -> str:
    base = slugify(name)
    slug = base
    counter = 1
    while True:
        q = db.query(Product).filter(Product.slug == slug)
        if exclude_id:
            q = q.filter(Product.id != exclude_id)
        if not q.first():
            return slug
        slug = f"{base}-{counter}"
        counter += 1


@router.get("", summary="List all products (admin)")
def list_products_admin(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    search: str = Query(default=None),
    category_id: int = Query(default=None),
    is_active: bool = Query(default=None),
    db: Session = Depends(get_db),
    _staff: User = Depends(require_staff),
):
    pagination = PaginationParams(page=page, limit=limit)
    q = db.query(Product)
    if search:
        q = q.filter(Product.name.ilike(f"%{search}%"))
    if category_id is not None:
        q = q.filter(Product.category_id == category_id)
    if is_active is not None:
        q = q.filter(Product.is_active.is_(is_active))
    total = q.count()
    items = q.order_by(Product.created_at.desc()).offset(pagination.offset).limit(pagination.limit).all()
    return PaginatedResponse.build(items=[ProductOut.model_validate(p) for p in items], total=total, pagination=pagination)


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED, summary="Create a product")
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_manager),
):
    slug = _unique_slug(db, data.name)
    product = Product(**data.model_dump(), slug=slug, created_by=admin.id, updated_by=admin.id)
    db.add(product)
    db.commit()
    db.refresh(product)
    audit_service.log_action(db, "PRODUCT_CREATED", admin.id, "product", str(product.id), {"name": product.name})
    db.commit()
    return product


@router.patch("/{product_id}", response_model=ProductOut, summary="Update a product")
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_manager),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    updates = data.model_dump(exclude_unset=True)
    if "name" in updates:
        updates["slug"] = _unique_slug(db, updates["name"], exclude_id=product_id)
    updates["updated_by"] = admin.id
    for field, value in updates.items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    audit_service.log_action(db, "PRODUCT_UPDATED", admin.id, "product", str(product_id))
    db.commit()
    return product


@router.patch("/{product_id}/status", response_model=ProductOut, summary="Toggle product active status")
def update_product_status(
    product_id: int,
    data: ProductStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_manager),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    product.is_active = data.is_active
    product.updated_by = admin.id
    db.commit()
    db.refresh(product)
    audit_service.log_action(db, "PRODUCT_STATUS_CHANGED", admin.id, "product", str(product_id), {"is_active": data.is_active})
    db.commit()
    return product


@router.delete("/{product_id}", summary="Soft-delete a product")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_manager),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    product.is_active = False
    product.updated_by = admin.id
    db.commit()
    audit_service.log_action(db, "PRODUCT_DELETED", admin.id, "product", str(product_id))
    db.commit()
    return {"success": True, "message": "Product deactivated."}
