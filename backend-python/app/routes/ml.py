from fastapi import APIRouter, Depends
from app.database import db
from app.routes.deps import get_current_user
from app.models.user import UserInDB
from app.ml.engine import MLEngine

router = APIRouter()

@router.get("/insights")
async def get_insights(current_user: UserInDB = Depends(get_current_user)):
    # Fetch all user workouts
    cursor = db.get_db().workouts.find({"userId": current_user.id})
    workouts = await cursor.to_list(length=1000) # Analyze last 1000 sessions
    
    # Clean data for engine
    workout_data = [{**w, "_id": str(w["_id"]), "userId": str(w["userId"])} for w in workouts]
    
    engine = MLEngine(workout_data)
    
    return {
        "weaknesses": engine.analyze_weaknesses(),
        "burnout": engine.predict_burnout(),
        "focus": engine.get_recommended_focus()
    }
