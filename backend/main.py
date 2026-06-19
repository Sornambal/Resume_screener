"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import upload, screen, results
from .services.embedder import load_model
from .services.qa_checker import load_nli_model

app = FastAPI(
    title="Resume Screening QA API",
    description="Recruiter QA tool for evaluating resumes against job descriptions",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router)
app.include_router(screen.router)
app.include_router(results.router)


@app.on_event("startup")
async def startup_event():
    """Load models at startup."""
    print("Loading embedding model...")
    load_model()
    print("Loading NLI model...")
    load_nli_model()
    print("Models loaded successfully!")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "Resume Screening QA API",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    """Health check."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
