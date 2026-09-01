"""
JACRAL – Voting service.
Calculates results from live database records.
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.voting import VotingOption, VotingQuestion, VotingResponse
from app.schemas.voting import VotingOptionResult, VotingResultOut


def get_active_questions(db: Session) -> list[VotingQuestion]:
    now = datetime.now(timezone.utc)
    return (
        db.query(VotingQuestion)
        .filter(
            VotingQuestion.is_active.is_(True),
            (VotingQuestion.start_at.is_(None)) | (VotingQuestion.start_at <= now),
            (VotingQuestion.end_at.is_(None)) | (VotingQuestion.end_at >= now),
        )
        .all()
    )


def get_results(db: Session, question_id: int) -> Optional[VotingResultOut]:
    question = db.query(VotingQuestion).filter(VotingQuestion.id == question_id).first()
    if not question:
        return None

    # Count votes per option in a single query
    option_counts = (
        db.query(VotingResponse.option_id, func.count(VotingResponse.id).label("cnt"))
        .filter(VotingResponse.question_id == question_id)
        .group_by(VotingResponse.option_id)
        .all()
    )

    count_map = {row.option_id: row.cnt for row in option_counts}
    total_votes = sum(count_map.values())

    results = []
    for option in question.options:
        votes = count_map.get(option.id, 0)
        pct = (votes / total_votes * 100) if total_votes > 0 else 0.0
        results.append(
            VotingOptionResult(
                id=option.id,
                option_text=option.option_text,
                votes=votes,
                percentage=round(pct, 2),
            )
        )

    return VotingResultOut(
        question_id=question.id,
        question=question.question,
        total_votes=total_votes,
        options=results,
    )


def has_already_voted(
    db: Session,
    question_id: int,
    user_id: Optional[int],
    session_id: Optional[str],
    option_id: int,
) -> bool:
    """Check if a user/session has already voted for this option."""
    q = db.query(VotingResponse).filter(
        VotingResponse.question_id == question_id,
        VotingResponse.option_id == option_id,
    )
    if user_id:
        q = q.filter(VotingResponse.user_id == user_id)
    elif session_id:
        q = q.filter(VotingResponse.session_id == session_id)
    else:
        return False

    return q.first() is not None
