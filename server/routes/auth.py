from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from schemas.auth import loginInput, signupInput
from services.auth_service import login, signup
from db.db import get_db


router = APIRouter(prefix='/auth', tags=['Authentication'])

@router.get('/login', status_code=status.HTTP_200_OK)
async def login(input: loginInput, db: Session = Depends(get_db)):
    return await login(input, db)

@router.post('/signup', status_code=status.HTTP_201_CREATED)
async def signup(input: signupInput, db: Session = Depends(get_db)):
    return await signup(input, db)

