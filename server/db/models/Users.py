import uuid

from sqlalchemy import UUID
from sqlalchemy.orm import mapped_column, Mapped, relationship
from typing import TYPE_CHECKING

from db.db import Base

if TYPE_CHECKING:
    from db.models.Cases import Case
    from db.models.Patients import Patient
    from db.models.Papers import Paper


class User(Base):
    __tablename__ = 'users'

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    name: Mapped[str] = mapped_column(nullable=False)

    email: Mapped[str] = mapped_column(
        unique=True,
        nullable=False,
    )

    hashed_pass: Mapped[str] = mapped_column(nullable=False)

    patients: Mapped[list['Patient']] = relationship(back_populates='owner')
    cases: Mapped[list['Case']] = relationship(back_populates='user')
    papers: Mapped[list['Paper']] = relationship(back_populates='owner')
