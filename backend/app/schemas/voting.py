"""
JACRAL – Voting schemas.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


# ------------------------------------------------------------------
# Admin – Question management
# ------------------------------------------------------------------

class VotingQuestionCreate(BaseModel):
    question: str = Field(min_length=5)
    description: Optional[str] = None
    is_active: bool = True
    allow_multiple_answers: bool = False
    allow_anonymous: bool = False
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None


class VotingQuestionUpdate(BaseModel):
    question: Optional[str] = Field(default=None, min_length=5)
    description: Optional[str] = None
    is_active: Optional[bool] = None
    allow_multiple_answers: Optional[bool] = None
    allow_anonymous: Optional[bool] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None


# ------------------------------------------------------------------
# Admin – Option management
# ------------------------------------------------------------------

class VotingOptionCreate(BaseModel):
    option_text: str = Field(min_length=1)
    display_order: int = 0


class VotingOptionUpdate(BaseModel):
    option_text: Optional[str] = Field(default=None, min_length=1)
    display_order: Optional[int] = None


# ------------------------------------------------------------------
# Voting submission
# ------------------------------------------------------------------

class VoteRequest(BaseModel):
    option_ids: list[int] = Field(min_length=1)
    session_id: Optional[str] = None  # Required for anonymous voting


# ------------------------------------------------------------------
# Response schemas
# ------------------------------------------------------------------

class VotingOptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question_id: int
    option_text: str
    display_order: int


class VotingQuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question: str
    description: Optional[str] = None
    is_active: bool
    allow_multiple_answers: bool
    allow_anonymous: bool
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    created_at: datetime
    options: list[VotingOptionOut] = []


class VotingOptionResult(BaseModel):
    id: int
    option_text: str
    votes: int
    percentage: float


class VotingResultOut(BaseModel):
    question_id: int
    question: str
    total_votes: int
    options: list[VotingOptionResult]
