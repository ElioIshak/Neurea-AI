import uuid

from datetime import datetime
from enum import Enum
from sqlalchemy import ForeignKey, VARCHAR, Text, Enum as sqlenum, DateTime, func, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.db import Base
from Patients import Patient
from Users import User
from Mris import MRI
from CaseResearchPapers import CaseResearchPaper


class Status(str, Enum):
    DRAFT = 'draft'
    ACTIVE = 'active'
    COMPLETED = 'completed'


class Case(Base):
    __tablename__ = "cases"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True
    )

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey('patient.id')
    )
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey('user.id')
    )

    title: Mapped[str] = mapped_column(
        VARCHAR(50), 
        nullable=False, 
        default=f'Case_{id}'
    )
    
    description: Mapped[str] = mapped_column(
        Text, 
        nullable=False
    )
    
    status: Mapped[Status] = mapped_column(
        sqlenum(Status), 
        default=Status.DRAFT
    )
    
    report: Mapped[str] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_At: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    patient: Mapped['Patient'] = relationship(back_populates='cases')
    user: Mapped['User'] = relationship(back_populates='cases')
    mris: Mapped[list['MRI']] = relationship(back_populates='cases')
    papers: Mapped[list['CaseResearchPaper']] = relationship(back_populates='cases')