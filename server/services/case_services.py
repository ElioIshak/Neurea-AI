import uuid

from fastapi import HTTPException
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from db.models.Cases import Case
from db.models.Patients import Patient
from db.models.Mris import MRI
from db.models.Users import User
from schemas.auth import UserResponse
from schemas.case import CaseCreateInput, CaseUpdateInput, CaseOutput


def _user_id(current_user: UserResponse) -> uuid.UUID:
    return uuid.UUID(str(current_user.id))


# create a case
async def create_case(case_input: CaseCreateInput, current_user: UserResponse, db: Session) -> CaseOutput:
    user_id = _user_id(current_user)

    patient_stmt = select(Patient).where(
        Patient.id == case_input.patient_id,
        Patient.owner_user_id == user_id,
    )
    patient = db.execute(patient_stmt).scalar_one_or_none()

    if patient is None:
        raise HTTPException(status_code=404, detail='Patient does not exist')

    case = Case(
        patient_id=case_input.patient_id,
        user_id=user_id,
        title=case_input.title,
        description=case_input.description,
        status=case_input.status,
        report=case_input.report,
    )

    db.add(case)
    db.commit()
    db.refresh(case)

    return case


# delete a case
async def delete_case(case_id: uuid.UUID, current_user: UserResponse, db: Session) -> bool:
    stmt = select(Case).where(
        Case.id == case_id,
        Case.user_id == _user_id(current_user),
        Case.deleted_at.is_(None),
    )
    case = db.execute(stmt).scalar_one_or_none()

    if case is None:
        raise HTTPException(status_code=404, detail='Case does not exist')

    # MRI records are retained; detach them before deleting their case.
    db.execute(
        update(MRI).where(MRI.case_id == case.id).values(case_id=None)
    )
    db.delete(case)
    db.commit()

    return True


# get all cases owned by the current user
async def get_cases(current_user: UserResponse, db: Session) -> list[CaseOutput]:
    stmt = select(Case).where(
        Case.user_id == _user_id(current_user),
        Case.deleted_at.is_(None),
    ).order_by(Case.created_at.desc())

    return db.execute(stmt).scalars().all()


# get cases belonging to a patient
async def get_patient_cases(patient_id: uuid.UUID, current_user: UserResponse, db: Session) -> list[CaseOutput]:
    user_id = _user_id(current_user)

    patient_stmt = select(Patient.id).where(
        Patient.id == patient_id,
        Patient.owner_user_id == user_id,
    )
    if db.execute(patient_stmt).scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail='Patient does not exist')

    stmt = select(Case).where(
        Case.patient_id == patient_id,
        Case.user_id == user_id,
        Case.deleted_at.is_(None),
    ).order_by(Case.created_at.desc())

    return db.execute(stmt).scalars().all()


# modify an existing case
async def modify_case(case_id: uuid.UUID, case_input: CaseUpdateInput, current_user: UserResponse, db: Session) -> CaseOutput:
    stmt = select(Case).where(
        Case.id == case_id,
        Case.user_id == _user_id(current_user),
        Case.deleted_at.is_(None),
    )
    case = db.execute(stmt).scalar_one_or_none()

    if case is None:
        raise HTTPException(status_code=404, detail='Case does not exist')

    updates = case_input.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(case, key, value)

    db.commit()
    db.refresh(case)

    return case
