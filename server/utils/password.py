import bcrypt
import os


def verify_pass(password: str, hashed_pass:str) -> bool:
    return bcrypt.checkpw(password, hashed_pass)


def hash_pass(password: str) -> str:
    return bcrypt.hashpw(password=password, salt=os.getenv('SALT'))