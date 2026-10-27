import uuid

from sqlalchemy import UUID
from sqlalchemy.orm import mapped_column, Mapped, relationship

from db.db import Base
from Patients import Patient
from Cases import Case

class User(Base):
    __tablename__ = 'users'

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True
    )
    
    name: Mapped[str] = mapped_column(nullable=False)
    
    email: Mapped[str] = mapped_column(
        unique=True, 
        nullable=False
    )
    
    hashed_pass: Mapped[str] = mapped_column(nullable=False)

    patients: Mapped[list['Patient']] = relationship(back_populates='users')
    cases: Mapped[list['Case']] = relationship(back_populates='users')
    