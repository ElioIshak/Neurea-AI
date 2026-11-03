import os

from dotenv import load_dotenv
from fastapi import FastAPI

from routes import (
    auth,
    patient,
    cases,
    research_papers,
)

# Import all ORM models so SQLAlchemy can resolve string-based relationships.
from db.models.Cases import Case
from db.models.CaseResearchPapers import CaseResearchPaper
from db.models.Chats import Chat
from db.models.Messages import Message
from db.models.Mris import MRI
from db.models.Papers import Paper
from db.models.Patients import Patient
from db.models.Users import User


def create_app() -> FastAPI:
    load_dotenv()

    app = FastAPI(
        title="Neurea-AI",
        version='1.0',
    )

    prefix = os.getenv('API_PREFIX')

    app.include_router(prefix=prefix, router=auth.router)
    app.include_router(prefix=prefix, router=patient.router)
    app.include_router(prefix=prefix, router=cases.router)
    app.include_router(prefix=prefix, router=research_papers.router)

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
