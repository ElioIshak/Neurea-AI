import os

from dotenv import load_dotenv
from fastapi import FastAPI

from routes import (
    auth,
    patient
)


def create_app() -> FastAPI:

    load_dotenv()

    app = FastAPI(
        title="Neurea-AI",
        version='1.0'
    )

    prefix = os.getenv('API_PREFIX')

    app.include_router(prefix=prefix, router=auth.router)
    app.include_router(prefix=prefix, router=patient.router)

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )