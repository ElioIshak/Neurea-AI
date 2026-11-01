import datetime
import os

from fastapi import HTTPException
from jose import jwt
from sqlalchemy import select, insert
from sqlalchemy.orm import Session

from db.models.Users import User
from schemas.auth import loginInput, signupInput, loginOutput, signupOutput
from utils.password import verify_pass, hash_pass


async def login(input: loginInput, db: Session) -> loginOutput:
    email, password = input.email, input.password

    stmt = select(User).where(User.email==email)
    user = db.execute(stmt).scalar_one_or_none()

    if user is None:
        raise ValueError(status=401, detail='Invalid email')

    if verify_pass(password, user.hashed_pass) is False:
        raise ValueError(status=401, detail='Incorrect password')

    token = jwt.encode(
        {
            'sub': user.id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=15)
        },
        key=os.getenv('JWT_KEY'),
        algorithm=os.getenv('JWT_ALGORITHM')
    )

    if token is None:
        raise HTTPException(detail='Error in encoding the token')

    return {'token': token, 'token_type': 'bearer'}


async def signup(input:signupInput, db: Session) -> signupOutput:
    name, email, password = input.name, input.email, input.password

    if email is None:
        raise ValueError(detail='missing email')

    stmt = select(User).where(User.email == email)
    existing = db.execute(stmt).scalar_one_or_none()

    if existing is not None:
        raise ValueError(detail='email already used')

    hashed_pass = hash_pass(password)
    
    stmt = insert(User).values(
        {
        'name': name,
        'email': email,
        'hashed_pass': hashed_pass
        }
    ).returning(User)

    data = db.execute(stmt).scalar_one_or_none()

    if data is None:
        raise HTTPException(detail='Error in creating user')

    return data


    