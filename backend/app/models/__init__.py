"""
JACRAL – Models package.
Import all models here so Alembic can discover them.
"""
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.cart import Cart, CartItem
from app.models.address import Address
from app.models.coupon import Coupon
from app.models.order import Order, OrderItem
from app.models.payment import Payment
from app.models.utm_visit import UtmVisit
from app.models.audit_log import AuditLog


__all__ = [
    "User",
    "Category",
    "Product",
    "Cart",
    "CartItem",
    "Address",
    "Coupon",
    "Order",
    "OrderItem",
    "Payment",
    "UtmVisit",
    "AuditLog",
]