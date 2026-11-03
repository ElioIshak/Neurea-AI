import uuid

from datetime import date, datetime
from sqlalchemy import Uuid, VARCHAR, Text, ForeignKey, Date, DateTime, func, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Any, TYPE_CHECKING

from db.db import Base

if TYPE_CHECKING:
    from db.models.CaseResearchPapers import CaseResearchPaper
    from db.models.Users import User


class Paper(Base):
    __tablename__ = "papers"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey('users.id'),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(VARCHAR(150), nullable=False, index=True)
    authors: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
    published_at: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    abstract: Mapped[str | None] = mapped_column(Text, nullable=True)
    doi: Mapped[str | None] = mapped_column(VARCHAR(100), nullable=True)
    source_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    pdf_storage_key: Mapped[str | None] = mapped_column(VARCHAR(255), nullable=True)

    paper_metadata: Mapped[dict[str, Any]] = mapped_column(
        'metadata',
        JSON,
        nullable=False,
        default=dict,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    owner: Mapped["User"] = relationship(back_populates="papers")
    cases: Mapped[list["CaseResearchPaper"]] = relationship(back_populates="paper")
