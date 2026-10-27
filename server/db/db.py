import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker


# load the env variables
load_dotenv()

# base model
class Base(DeclarativeBase):
    pass

# create engine
engine = create_engine(url=os.getenv('DATABASE_URL'))

# create session locale
sessionLocale = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=True)

# get_db
def get_db():
    
    db = sessionLocale()
    
    try:
        yield db

    finally:
        db.close()