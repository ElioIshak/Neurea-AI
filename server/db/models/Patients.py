import uuid

from datetime import date, datetime
from enum import Enum
from sqlalchemy import ForeignKey, Date, DateTime, Text, func, Enum as sqlenum, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

from db.db import Base

if TYPE_CHECKING:
    from db.models.Users import User
    from db.models.Cases import Case
    from db.models.Mris import MRI

class Sex(str, Enum):
    MALE = 'male'
    FEMALE = 'female'
    RATHER_NOT_SAY = 'rather_not_say'

class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True
    )

    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), 
        ForeignKey("users.id"), 
        primary_key=True, 
        index=True
    )
    
    first_name: Mapped[str] = mapped_column(
        default='John', 
        nullable=False, 
        index=True
    )

    last_name: Mapped[str] = mapped_column(
        default='Doe', 
        nullable=False,
        index=True
    )
    
    sex: Mapped[Sex] = mapped_column(
        sqlenum(Sex),
        default=Sex.RATHER_NOT_SAY, 
        nullable=False
    )

    birthdate: Mapped[date | None] = mapped_column(
        Date, 
        nullable=True
    )
    
    notes: Mapped[str | None] = mapped_column(
        Text, 
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    owner: Mapped["User"] = relationship(back_populates='patients')
    cases: Mapped["Case"] = relationship(back_populates='patients')
    mris: Mapped[list['MRI']] = relationship(back_populates='patients')