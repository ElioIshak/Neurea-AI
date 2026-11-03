import uuid

from fastapi import Depends, status
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

from db.db import get_db
from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from schemas.case import CaseCreateInput, CaseUpdateInput
from services import case_services


router = APIRouter(prefix='/cases', tags=['Cases'])


@router.post('/{user_name}/create', status_code=status.HTTP_201_CREATED)
async def create_case(
    user_name: str,
    input: CaseCreateInput,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await case_services.create_case(input, current_user, db)


@router.delete('/{user_name}/delete/{case_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_case(
    user_name: str,
    case_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    await case_services.delete_case(case_id, current_user, db)


@router.get('/{user_name}/get_cases', status_code=status.HTTP_200_OK)
async def get_cases(
    user_name: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await case_services.get_cases(current_user, db)


@router.get('/{user_name}/get_patient_cases/{patient_id}', status_code=status.HTTP_200_OK)
async def get_patient_cases(
    user_name: str,
    patient_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await case_services.get_patient_cases(patient_id, current_user, db)


@router.put('/{user_name}/modify/{case_id}', status_code=status.HTTP_200_OK)
async def modify_case(
    user_name: str,
    case_id: uuid.UUID,
    input: CaseUpdateInput,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await case_services.modify_case(case_id, input, current_user, db)
