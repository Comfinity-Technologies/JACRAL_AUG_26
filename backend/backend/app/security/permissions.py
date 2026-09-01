"""
JACRAL – Role-based permission dependencies.

Hierarchy: customer < staff < manager < admin

Usage in route:
    current_user: User = Depends(require_manager)
"""
from fastapi import Depends, HTTPException, status

from app.models.user import User
from app.security.dependencies import get_current_user

_ROLE_LEVEL = {
    "customer": 0,
    "staff": 1,
    "manager": 2,
    "admin": 3,
}


def _require_role(minimum_role: str):
    """Factory: returns a dependency that enforces a minimum role level."""

    def dependency(current_user: User = Depends(get_current_user)) -> User:
        user_level = _ROLE_LEVEL.get(current_user.role, -1)
        required_level = _ROLE_LEVEL[minimum_role]

        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {minimum_role} or higher role.",
            )
        return current_user

    return dependency


# Convenience aliases
require_customer = _require_role("customer")
require_staff = _require_role("staff")
require_manager = _require_role("manager")
require_admin = _require_role("admin")
