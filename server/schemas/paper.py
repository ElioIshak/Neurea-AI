import uuid

from datetime import date, datetime
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class PaperCreateInput(BaseModel):
    title: str = Field(max_length=150)
    authors: dict[str, Any] = Field(default_factory=dict)
    published_at: date
    abstract: str | None = None
    doi: str | None = Field(default=None, max_length=100)
    source_url: str | None = None
    pdf_storage_key: str | None = Field(default=None, max_length=255)
    paper_metadata: dict[str, Any] = Field(default_factory=dict)
    case_id: uuid.UUID | None = None
    relevance_note: str | None = None


class PaperOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    authors: dict[str, Any]
    published_at: date
    abstract: str | None
    doi: str | None
    source_url: str | None
    pdf_storage_key: str | None
    paper_metadata: dict[str, Any] = Field(
        validation_alias='paper_metadata',
        serialization_alias='metadata',
    )
    created_at: datetime


class CaseResearchPaperOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    paper: PaperOutput
    relevance_note: str | None
    added_at: datetime
