"""
JACRAL – Voting routes (public).

GET  /api/v1/voting/questions               PUBLIC
GET  /api/v1/voting/questions/{id}          PUBLIC
POST /api/v1/voting/questions/{id}/vote     PUBLIC / CUSTOMER
GET  /api/v1/voting/questions/{id}/results  PUBLIC
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.voting import VotingOption, VotingQuestion, VotingResponse
from app.schemas.voting import VoteRequest, VotingQuestionOut, VotingResultOut
from app.security.dependencies import get_current_user
from app.services import voting_service

router = APIRouter(tags=["Voting"])

@router.get("/questions", response_model=list[VotingQuestionOut], summary="List active voting questions")
def list_questions(db: Session = Depends(get_db)):
    return voting_service.get_active_questions(db)


@router.get("/questions/{question_id}", response_model=VotingQuestionOut, summary="Get a voting question")
def get_question(question_id: int, db: Session = Depends(get_db)):
    q = db.query(VotingQuestion).filter(VotingQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found.")
    return q


@router.post("/questions/{question_id}/vote", summary="Submit a vote", status_code=status.HTTP_201_CREATED)
def vote(
    question_id: int,
    data: VoteRequest,
    db: Session = Depends(get_db),
):
    question = db.query(VotingQuestion).filter(
        VotingQuestion.id == question_id, VotingQuestion.is_active.is_(True)
    ).first()

    if not question:
        raise HTTPException(status_code=404, detail="Question not found or inactive.")

    if not question.allow_anonymous and not data.session_id:
        raise HTTPException(status_code=400, detail="Authentication or session_id required to vote.")

    if not question.allow_multiple_answers and len(data.option_ids) > 1:
        raise HTTPException(status_code=400, detail="This question only allows one answer.")

    responses_added = []
    for option_id in data.option_ids:
        option = db.query(VotingOption).filter(
            VotingOption.id == option_id,
            VotingOption.question_id == question_id,
        ).first()

        if not option:
            raise HTTPException(status_code=400, detail=f"Option {option_id} is not valid for this question.")

        if voting_service.has_already_voted(db, question_id, None, data.session_id, option_id):
            raise HTTPException(status_code=409, detail="You have already voted for this option.")

        response = VotingResponse(
            question_id=question_id,
            option_id=option_id,
            user_id=None,
            session_id=data.session_id,
        )
        db.add(response)
        responses_added.append(option_id)

    db.commit()

    return {"success": True, "message": "Vote recorded.", "options_voted": responses_added}


@router.get("/questions/{question_id}/results", response_model=VotingResultOut, summary="Get voting results with percentages")
def get_results(question_id: int, db: Session = Depends(get_db)):
    result = voting_service.get_results(db, question_id)
    if not result:
        raise HTTPException(status_code=404, detail="Question not found.")
    return result
