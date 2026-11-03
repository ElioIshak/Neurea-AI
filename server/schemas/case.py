import uuid

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from db.models.Cases import Status


class CaseCreateInput(BaseModel):
    patient_id: uuid.UUID
    title: str = Field(default='Untitled case', max_length=50)
    description: str
    status: Status = Status.DRAFT
    report: str | None = None


class CaseUpdateInput(BaseModel):
    title: str | None = Field(default=None, max_length=50)
    description: str | None = None
    status: Status | None = None
    report: str | None = None


class CaseOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    patient_id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: str
    status: Status
    report: str | None
    created_at: datetime
    updated_at: datetime
