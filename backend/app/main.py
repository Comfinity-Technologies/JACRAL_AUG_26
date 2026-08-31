"""
JACRAL Backend - Main Application
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
import app.models  # This ensures all models are imported before metadata creation (if used)

from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.categories import router as categories_router
from app.routes.products import router as products_router
from app.routes.cart import router as cart_router
from app.routes.addresses import router as addresses_router
from app.routes.orders import router as orders_router
from app.routes.payments import router as payments_router
from app.routes.coupons import router as coupons_router
from app.routes.analytics import router as analytics_router

from app.routes.admin.users import router as admin_users_router
from app.routes.admin.products import router as admin_products_router
from app.routes.admin.categories import router as admin_categories_router
from app.routes.admin.orders import router as admin_orders_router
from app.routes.admin.coupons import router as admin_coupons_router
from app.routes.admin.analytics import router as admin_analytics_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    redirect_slashes=False,
)

# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------
allowed_origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
allowed_origins = list(dict.fromkeys(o for o in allowed_origins if o))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# API routes
# ---------------------------------------------------------
app.include_router(health_router)
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(categories_router, prefix="/api/v1/categories")
app.include_router(products_router, prefix="/api/v1/products")
app.include_router(cart_router, prefix="/api/v1/cart")
app.include_router(addresses_router, prefix="/api/v1/addresses")
app.include_router(orders_router, prefix="/api/v1/orders")
app.include_router(payments_router, prefix="/api/v1/payments")
app.include_router(coupons_router, prefix="/api/v1/coupons")
app.include_router(analytics_router, prefix="/api/v1/analytics")

# Admin routes
app.include_router(admin_users_router, prefix="/api/v1/admin/users")
app.include_router(admin_products_router, prefix="/api/v1/admin/products")
app.include_router(admin_categories_router, prefix="/api/v1/admin/categories")
app.include_router(admin_orders_router, prefix="/api/v1/admin/orders")
app.include_router(admin_coupons_router, prefix="/api/v1/admin/coupons")
app.include_router(admin_analytics_router, prefix="/api/v1/admin/analytics")