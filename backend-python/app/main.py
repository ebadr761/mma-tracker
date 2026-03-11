import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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
allowed = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [o.strip() for o in allowed.split(",")]

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
    try:
        await db.get_db().command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {e}"
    return {"status": "healthy", "backend": "python-fastapi", "database": db_status}

# Serve Frontend in Production

# Mount static files if directory exists (for Docker build)
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # API routes are already handled above due to order
        # If file exists in static, serve it (e.g. favicon.ico)
        possible_file = os.path.join(static_dir, full_path)
        if os.path.isfile(possible_file):
             return FileResponse(possible_file)
        
        # Otherwise serve index.html for React Router
        return FileResponse(os.path.join(static_dir, "index.html"))

