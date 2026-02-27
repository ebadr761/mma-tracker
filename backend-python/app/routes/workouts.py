from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from app.database import db
from app.models.workout import WorkoutCreate, WorkoutResponse, WorkoutInDB
from app.models.user import UserInDB
from app.routes.deps import get_current_user
from datetime import datetime, timezone
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=dict)
async def get_workouts(
    limit: int = 100,
    skip: int = 0,
    current_user: UserInDB = Depends(get_current_user)
):
    cursor = db.get_db().workouts.find({"userId": current_user.id})
    cursor.sort([("date", -1), ("createdAt", -1)]).skip(skip).limit(limit)
    
    workouts = await cursor.to_list(length=limit)
    
    return {
        "workouts": [WorkoutResponse(**w).model_dump(by_alias=True) for w in workouts]
    }

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_workout(
    workout_in: WorkoutCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    workout_dict = workout_in.model_dump()
    workout_dict["userId"] = current_user.id
    now = datetime.now(timezone.utc)
    workout_dict["createdAt"] = now
    workout_dict["updatedAt"] = now
    
    result = await db.get_db().workouts.insert_one(workout_dict)
    
    created_workout = await db.get_db().workouts.find_one({"_id": result.inserted_id})
    
    return {
        "message": "Workout created successfully",
        "workout": WorkoutResponse(**created_workout).model_dump(by_alias=True)
    }

@router.get("/stats/summary")
async def get_stats(current_user: UserInDB = Depends(get_current_user)):
    pipeline = [
        {"$match": {"userId": current_user.id}},
        {"$group": {
            "_id": None,
            "totalSessions": {"$sum": 1},
            "totalDuration": {"$sum": "$duration"},
            "avgIntensity": {"$avg": "$intensity"}
        }}
    ]
    
    result = await db.get_db().workouts.aggregate(pipeline).to_list(length=1)
    
    if not result:
        return {"stats": {"totalSessions": 0, "totalDuration": 0, "avgIntensity": 0}}
    
    stats = result[0]
    return {
        "stats": {
            "totalSessions": stats["totalSessions"],
            "totalDuration": stats["totalDuration"],
            "avgIntensity": round(stats["avgIntensity"], 1)
        }
    }

@router.put("/{id}", response_model=dict)
async def update_workout(
    id: str,
    workout_in: WorkoutCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    update_data = workout_in.model_dump(exclude_unset=True)
    update_data["updatedAt"] = datetime.now(timezone.utc)
    
    result = await db.get_db().workouts.find_one_and_update(
        {"_id": ObjectId(id), "userId": current_user.id},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Workout not found")
        
    return {
        "message": "Workout updated successfully",
        "workout": WorkoutResponse(**result).model_dump(by_alias=True)
    }

@router.delete("/{id}", response_model=dict)
async def delete_workout(
    id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    result = await db.get_db().workouts.delete_one(
        {"_id": ObjectId(id), "userId": current_user.id}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
        
    return {"message": "Workout deleted successfully"}

@router.get("/{id}", response_model=dict)
async def get_workout(
    id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    workout = await db.get_db().workouts.find_one(
        {"_id": ObjectId(id), "userId": current_user.id}
    )
    
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
        
    return {"workout": WorkoutResponse(**workout).model_dump(by_alias=True)}
