import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from db.models.Patients import Patient
from db.models.Users import User
from schemas.auth import UserResponse
from schemas.patient import NewPatientInput, PatientInput, NewPatientOutput, PatientOutput


# create a patient
async def create_patient(new_patient_input: NewPatientInput, current_user: UserResponse, db: Session) -> NewPatientOutput:

    patient = Patient(
        **new_patient_input.model_dump(),
        owner_user_id=current_user.id
    )

    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient

# modify an existing patient
async def modify_patient(patient_input: PatientInput, current_user: UserResponse, db:Session) -> PatientOutput:

    patient = db.query(Patient).where(
            Patient.owner_user_id == current_user.id and Patient.id == patient_input.id
        ).first()

    if not patient:
        raise ValueError('Patient does not exist')

    updates = patient_input.model_dump(exclude={'id'}, exclude_unset=True)

    for key, val in updates:
        setattr(patient, key, val)

    db.commit()
    db.refresh(patient)

    return patient

# delete a patient
async def delete_patient(patient_id: uuid.UUID, current_user: UserResponse, db: Session) -> bool:

    stmt = select(Patient).where(Patient.id==patient_id and Patient.owner_user_id==current_user.id)
    patient = db.execute(stmt).first()

    db.delete(patient)
    db.commit()

    return True

# get all patients by user
async def get_patients(current_user: UserResponse, db: Session) -> list[PatientOutput]:

    stmt = select(Patient).where(Patient.owner_user_id==current_user.id)
    patients = db.execute(stmt).scalars().all()

    return patients

# get a patient
async def get_patient(patient_id: uuid.UUID, current_user: UserResponse, db: Session) -> PatientOutput:

    stmt = select(Patient).where(Patient.owner_user_id==current_user.id and Patient.id==patient_id)
    patient = db.execute(stmt).scalar_one()

    if not patient:
        raise ValueError('Patient does not exist')

    return patient