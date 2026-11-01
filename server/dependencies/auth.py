import os

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import Select
from sqlalchemy.orm import Session
from jose import jwt

from db.db import get_db
from db.models.Users import User
from schemas.auth import UserResponse

# extracts the token from login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserResponse:
    decoded = jwt.decode(token, key=os.getenv('SECRET_KEY'), algorithms=os.getenv('ALGORITHM'))

    email = decoded['email']

    stmt = Select(User).where(User.email==email)
    user = db.execute(stmt).scalars().first()

    return user