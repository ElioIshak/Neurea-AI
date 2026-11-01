from fastapi import FastAPI

from routes import auth


def create_app() -> FastAPI:
    app = FastAPI(
        title="Neurea-AI",
        version='1.0'
    )

    app.include_router(prefix='/api', router=auth.router)

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