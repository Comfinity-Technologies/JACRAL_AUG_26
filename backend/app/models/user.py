"""
JACRAL – User model.
Represents customers and all admin staff roles.
"""
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)

    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    # customer | staff | manager | admin
    role: Mapped[str] = mapped_column(
        String(30),
        default="customer",
        nullable=False,
        index=True,
    )

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # ------------------------------------------------------------------
    # Relationships
    # ------------------------------------------------------------------
    orders = relationship("Order", back_populates="user")
    addresses = relationship(
        "Address", back_populates="user", cascade="all, delete-orphan"
    )
    cart = relationship("Cart", back_populates="user", uselist=False)
    voting_responses = relationship("VotingResponse", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")