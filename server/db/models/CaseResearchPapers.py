import uuid

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text, func, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

from db.db import Base

if TYPE_CHECKING:
    from db.models.Cases import Case
    from db.models.Papers import Paper

class CaseResearchPaper(Base):
    __tablename__ = "case_research_papers"

    case_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("cases.id", ondelete="CASCADE"),
        primary_key=True,
    )

    paper_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("research_papers.id", ondelete="CASCADE"),
        primary_key=True,
    )

    relevance_note: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    added_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    case: Mapped["Case"] = relationship(
        back_populates="papers"
    )

    paper: Mapped["Paper"] = relationship(
        back_populates="cases"
    )
