import uuid

from sqlalchemy.orm import Session
from fastapi import Depends, status
from fastapi.routing import APIRouter

from db.db import get_db
from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from schemas.patient import (
    PatientInput,
    NewPatientInput,
)
from services import patient_services


router = APIRouter(prefix='/patients', tags=['Patients'])

@router.post('/{user_name}/create', status_code=status.HTTP_201_CREATED)
async def create_patient(
        user_name: str,
        input: NewPatientInput,
        current_user: UserResponse = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
    return await patient_services.create_patient(input, current_user, db)

@router.put('/{user_name}/modify/{patient_id}', status_code=status.HTTP_200_OK)
async def modify_patient(
    user_name: str,
    patient_id: uuid.UUID,
    input: PatientInput,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await patient_services.modify_patient(input, current_user, db)

@router.delete('/{user_name}/delete/{patient_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    user_name: str,
    patient_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await patient_services.delete_patient(patient_id, current_user, db)

@router.get('/{user_name}/get_patients', status_code=status.HTTP_200_OK)
async def get_patients(
    user_name: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await patient_services.get_patients(current_user, db)

@router.get('/{user_name}/get_patient/{patient_id}', status_code=status)
async def get_patient(
    user_name: str,
    patient_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return await patient_services.get_patient(patient_id, current_user, db)