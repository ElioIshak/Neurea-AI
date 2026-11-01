import uuid

from datetime import date
from pydantic import BaseModel, ConfigDict

from db.models.Patients import Sex


class NewPatientInput(BaseModel):
    first_name: str = 'John'
    last_name: str = 'Doe'
    sex: Sex = Sex.RATHER_NOT_SAY
    birthdate: date = None
    notes: str = None

class NewPatientOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    first_name: str
    last_name: str

class PatientInput(NewPatientInput):
    id: uuid.UUID

class PatientOutput(NewPatientOutput):
    pass