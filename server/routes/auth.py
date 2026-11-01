from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from schemas.auth import loginInput, signupInput
from services.auth_service import login, signup
from db.db import get_db


router = APIRouter(prefix='/auth')

@router.get('/login')
async def login(input: loginInput, db: Session = Depends(get_db)):
    return await login(input, db)

@router.post('/signup')
async def signup(input: signupInput, db: Session = Depends(get_db)):
    return await signup(input, db)

