import uuid

from datetime import datetime
from enum import Enum
from sqlalchemy import ForeignKey, ForeignKeyConstraint, VARCHAR, Text, Enum as sqlenum, DateTime, func, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

from db.db import Base

if TYPE_CHECKING:
    from db.models.Patients import Patient
    from db.models.Users import User
    from db.models.Mris import MRI
    from db.models.CaseResearchPapers import CaseResearchPaper
    from db.models.Chats import Chat


class Status(str, Enum):
    DRAFT = 'draft'
    ACTIVE = 'active'
    COMPLETED = 'completed'


class Case(Base):
    __tablename__ = "cases"
    __table_args__ = (
        ForeignKeyConstraint(
            ["patient_id", "user_id"],
            ["patients.id", "patients.owner_user_id"],
            name="fk_cases_patient_owner",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    patient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey('users.id'),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        VARCHAR(50),
        nullable=False,
        default='Untitled case',
    )

    description: Mapped[str] = mapped_column(Text, nullable=False)

    status: Mapped[Status] = mapped_column(
        sqlenum(Status),
        default=Status.DRAFT,
        nullable=False,
    )

    report: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    deleted_at: Mapped[datetime | None] = mapped_column(
        "deleted_At",
        DateTime(timezone=True),
        nullable=True,
    )

    patient: Mapped['Patient'] = relationship(back_populates='cases')
    user: Mapped['User'] = relationship(back_populates='cases')
    mris: Mapped[list['MRI']] = relationship(back_populates='case')
    papers: Mapped[list['CaseResearchPaper']] = relationship(
        back_populates='case',
        cascade='all, delete-orphan',
        passive_deletes=True,
    )
    chat: Mapped['Chat | None'] = relationship(
        back_populates='case',
        uselist=False,
        cascade='all, delete-orphan',
        passive_deletes=True,
    )
