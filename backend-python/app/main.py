from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import db
from app.routes import auth, workouts, ml

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db.connect()
    yield
    # Shutdown
    db.disconnect()

app = FastAPI(
    title="MMA Tracker API",
    description="Python/FastAPI backend for MMA Tracker",
    version="2.0.0",
    lifespan=lifespan
)

# CORS config
origins = [
    "http://localhost:5173", # Vite dev server
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(workouts.router, prefix="/api/workouts", tags=["Workouts"])
app.include_router(ml.router, prefix="/api/ml", tags=["ML"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "backend": "python-fastapi"}
