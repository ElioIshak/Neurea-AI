import os
import uuid
from pathlib import Path
from urllib.parse import urlparse

from fastapi import HTTPException
from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload

from db.models.CaseResearchPapers import CaseResearchPaper
from db.models.Cases import Case
from db.models.Papers import Paper
from schemas.auth import UserResponse
from schemas.paper import PaperCreateInput, PaperOutput, CaseResearchPaperOutput


def _user_id(current_user: UserResponse) -> uuid.UUID:
    return uuid.UUID(str(current_user.id))


# add a research paper to the user's library; optionally associate it with a case
async def create_paper(paper_input: PaperCreateInput, current_user: UserResponse, db: Session) -> PaperOutput:
    user_id = _user_id(current_user)

    if paper_input.case_id is not None:
        case_stmt = select(Case).where(
            Case.id == paper_input.case_id,
            Case.user_id == user_id,
            Case.deleted_at.is_(None),
        )
        case = db.execute(case_stmt).scalar_one_or_none()
        if case is None:
            raise HTTPException(status_code=404, detail='Case does not exist')

    paper_data = paper_input.model_dump(exclude={'case_id', 'relevance_note'})
    paper = Paper(**paper_data, user_id=user_id)

    db.add(paper)
    db.flush()

    if paper_input.case_id is not None:
        association = CaseResearchPaper(
            case_id=paper_input.case_id,
            paper_id=paper.id,
            relevance_note=paper_input.relevance_note,
        )
        db.add(association)

    db.commit()
    db.refresh(paper)

    return paper


# delete a research paper from the user's library
async def delete_paper(paper_id: uuid.UUID, current_user: UserResponse, db: Session) -> bool:
    stmt = select(Paper).where(
        Paper.id == paper_id,
        Paper.user_id == _user_id(current_user),
    )
    paper = db.execute(stmt).scalar_one_or_none()

    if paper is None:
        raise HTTPException(status_code=404, detail='Research paper does not exist')

    db.execute(
        delete(CaseResearchPaper).where(CaseResearchPaper.paper_id == paper_id)
    )
    db.delete(paper)
    db.commit()

    return True


# get a research paper by ID
async def get_paper(paper_id: uuid.UUID, current_user: UserResponse, db: Session) -> PaperOutput:
    stmt = select(Paper).where(
        Paper.id == paper_id,
        Paper.user_id == _user_id(current_user),
    )
    paper = db.execute(stmt).scalar_one_or_none()

    if paper is None:
        raise HTTPException(status_code=404, detail='Research paper does not exist')

    return paper


# get all research papers in the user's library
async def get_papers(current_user: UserResponse, db: Session) -> list[PaperOutput]:
    stmt = select(Paper).where(
        Paper.user_id == _user_id(current_user)
    ).order_by(Paper.created_at.desc())

    return db.execute(stmt).scalars().all()


# get research papers associated with a case
async def get_case_papers(case_id: uuid.UUID, current_user: UserResponse, db: Session) -> list[CaseResearchPaperOutput]:
    user_id = _user_id(current_user)
    case_stmt = select(Case.id).where(
        Case.id == case_id,
        Case.user_id == user_id,
        Case.deleted_at.is_(None),
    )
    if db.execute(case_stmt).scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail='Case does not exist')

    stmt = (
        select(CaseResearchPaper)
        .join(CaseResearchPaper.paper)
        .where(
            CaseResearchPaper.case_id == case_id,
            Paper.user_id == user_id,
        )
        .options(selectinload(CaseResearchPaper.paper))
        .order_by(CaseResearchPaper.added_at.desc())
    )

    return db.execute(stmt).scalars().all()


# resolve a stored PDF from the configured local paper storage directory
async def get_paper_pdf_path(paper_id: uuid.UUID, current_user: UserResponse, db: Session) -> tuple[Path, str]:
    paper = await get_paper(paper_id, current_user, db)

    if not paper.pdf_storage_key:
        raise HTTPException(status_code=404, detail='No PDF is stored for this research paper')

    storage_dir = os.getenv('PAPER_STORAGE_DIR')
    if not storage_dir:
        raise HTTPException(status_code=503, detail='Paper PDF storage is not configured')

    root = Path(storage_dir).expanduser().resolve()
    file_path = (root / paper.pdf_storage_key).resolve()

    if not file_path.is_relative_to(root):
        raise HTTPException(status_code=400, detail='Invalid paper storage key')

    if not file_path.is_file():
        raise HTTPException(status_code=404, detail='Research paper PDF was not found')

    return file_path, paper.title


# get the external source URL for a research paper
async def get_paper_source_url(paper_id: uuid.UUID, current_user: UserResponse, db: Session) -> str:
    paper = await get_paper(paper_id, current_user, db)

    if not paper.source_url:
        raise HTTPException(status_code=404, detail='No external link is available for this research paper')

    parsed_url = urlparse(paper.source_url)
    if parsed_url.scheme not in {'http', 'https'} or not parsed_url.netloc:
        raise HTTPException(status_code=400, detail='The research paper URL is invalid')

    return paper.source_url
