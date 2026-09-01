"""
JACRAL – Admin: Voting management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.voting import VotingOption, VotingQuestion
from app.schemas.voting import (
    VotingOptionCreate,
    VotingOptionOut,
    VotingOptionUpdate,
    VotingQuestionCreate,
    VotingQuestionOut,
    VotingQuestionUpdate,
    VotingResultOut,
)
from app.security.permissions import require_admin
from app.services import audit_service, voting_service

router = APIRouter(tags=["Admin – Voting"])


@router.get("/questions", response_model=list[VotingQuestionOut], summary="List all questions (admin)")
def list_questions_admin(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(VotingQuestion).order_by(VotingQuestion.created_at.desc()).all()


@router.post("/questions", response_model=VotingQuestionOut, status_code=201, summary="Create voting question")
def create_question(data: VotingQuestionCreate, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    question = VotingQuestion(**data.model_dump(), created_by=admin.id)
    db.add(question)
    db.commit()
    db.refresh(question)
    audit_service.log_action(db, "VOTING_QUESTION_CREATED", admin.id, "voting_question", str(question.id))
    db.commit()
    return question


@router.patch("/questions/{question_id}", response_model=VotingQuestionOut, summary="Update question")
def update_question(question_id: int, data: VotingQuestionUpdate, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    q = db.query(VotingQuestion).filter(VotingQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(q, field, value)
    db.commit()
    db.refresh(q)
    return q


@router.delete("/questions/{question_id}", summary="Delete question")
def delete_question(question_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    q = db.query(VotingQuestion).filter(VotingQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found.")
    db.delete(q)
    db.commit()
    return {"success": True, "message": "Question deleted."}


@router.post("/questions/{question_id}/options", response_model=VotingOptionOut, status_code=201, summary="Add option to question")
def add_option(question_id: int, data: VotingOptionCreate, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    q = db.query(VotingQuestion).filter(VotingQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found.")
    option = VotingOption(**data.model_dump(), question_id=question_id)
    db.add(option)
    db.commit()
    db.refresh(option)
    return option


@router.patch("/options/{option_id}", response_model=VotingOptionOut, summary="Update option")
def update_option(option_id: int, data: VotingOptionUpdate, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    option = db.query(VotingOption).filter(VotingOption.id == option_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(option, field, value)
    db.commit()
    db.refresh(option)
    return option


@router.delete("/options/{option_id}", summary="Delete option")
def delete_option(option_id: int, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    option = db.query(VotingOption).filter(VotingOption.id == option_id).first()
    if not option:
        raise HTTPException(status_code=404, detail="Option not found.")
    db.delete(option)
    db.commit()
    return {"success": True, "message": "Option deleted."}


@router.get("/questions/{question_id}/results", response_model=VotingResultOut, summary="Get question results")
def get_question_results(question_id: int, _: User = Depends(require_admin), db: Session = Depends(get_db)):
    result = voting_service.get_results(db, question_id)
    if not result:
        raise HTTPException(status_code=404, detail="Question not found.")
    return result
