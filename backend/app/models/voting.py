"""
JACRAL – Voting models.
VotingQuestion → VotingOption → VotingResponse
"""
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class VotingQuestion(Base):
    __tablename__ = "voting_questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    question: Mapped[str] = mapped_column(Text, nullable=False)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    allow_multiple_answers: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    allow_anonymous: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    start_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    end_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    created_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    options = relationship(
        "VotingOption", back_populates="question", cascade="all, delete-orphan",
        order_by="VotingOption.display_order"
    )
    responses = relationship("VotingResponse", back_populates="question")


class VotingOption(Base):
    __tablename__ = "voting_options"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    question_id: Mapped[int] = mapped_column(
        ForeignKey("voting_questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    option_text: Mapped[str] = mapped_column(Text, nullable=False)

    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    question = relationship("VotingQuestion", back_populates="options")
    responses = relationship("VotingResponse", back_populates="option")


class VotingResponse(Base):
    __tablename__ = "voting_responses"
    __table_args__ = (
        # Prevent authenticated duplicate per question+option
        UniqueConstraint(
            "question_id", "option_id", "user_id",
            name="uq_vote_user_option",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    question_id: Mapped[int] = mapped_column(
        ForeignKey("voting_questions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    option_id: Mapped[int] = mapped_column(
        ForeignKey("voting_options.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Null for anonymous voters
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )

    # Anonymous session identifier
    session_id: Mapped[str | None] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    question = relationship("VotingQuestion", back_populates="responses")
    option = relationship("VotingOption", back_populates="responses")
    user = relationship("User", back_populates="voting_responses")
