import uuid

from fastapi import Depends, status
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.routing import APIRouter
from sqlalchemy.orm import Session

from db.db import get_db
from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from schemas.paper import PaperCreateInput, PaperOutput, CaseResearchPaperOutput
from services import paper_services


router = APIRouter(prefix='/research-papers', tags=['Research Papers'])


@router.post('/{user_name}/create', status_code=status.HTTP_201_CREATED, response_model=PaperOutput)
async def create_paper(
    user_name: str,
    input: PaperCreateInput,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await paper_services.create_paper(input, current_user, db)


@router.delete('/{user_name}/delete/{paper_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_paper(
    user_name: str,
    paper_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    await paper_services.delete_paper(paper_id, current_user, db)


@router.get('/{user_name}/get_papers', status_code=status.HTTP_200_OK, response_model=list[PaperOutput])
async def get_papers(
    user_name: str,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await paper_services.get_papers(current_user, db)


@router.get('/{user_name}/get_paper/{paper_id}', status_code=status.HTTP_200_OK, response_model=PaperOutput)
async def get_paper(
    user_name: str,
    paper_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await paper_services.get_paper(paper_id, current_user, db)


@router.get('/{user_name}/case/{case_id}', status_code=status.HTTP_200_OK, response_model=list[CaseResearchPaperOutput])
async def get_case_papers(
    user_name: str,
    case_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await paper_services.get_case_papers(case_id, current_user, db)


@router.get('/{user_name}/download/{paper_id}', status_code=status.HTTP_200_OK)
async def download_paper(
    user_name: str,
    paper_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    file_path, title = await paper_services.get_paper_pdf_path(paper_id, current_user, db)
    return FileResponse(
        path=file_path,
        media_type='application/pdf',
        filename=f'{title}.pdf',
    )


@router.get('/{user_name}/open/{paper_id}', status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def open_paper_source(
    user_name: str,
    paper_id: uuid.UUID,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    source_url = await paper_services.get_paper_source_url(paper_id, current_user, db)
    return RedirectResponse(url=source_url, status_code=status.HTTP_307_TEMPORARY_REDIRECT)
