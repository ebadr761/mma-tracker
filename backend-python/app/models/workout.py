from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal
from datetime import datetime
from app.models.common import PyObjectId

DisciplineType = Literal[
    'Boxing', 'Wrestling', 'BJJ', 'Muay Thai', 
    'Strength & Conditioning', 'Cardio', 'Mobility', 
    'Sprints', 'Squats', 'Bench Press'
]

class WorkoutBase(BaseModel):
    discipline: DisciplineType
    duration: int = Field(ge=1)
    intensity: int = Field(ge=1, le=10)
    notes: Optional[str] = ""
    date: str # YYYY-MM-DD

class WorkoutCreate(WorkoutBase):
    pass

class WorkoutInDB(WorkoutBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    userId: PyObjectId
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class WorkoutResponse(WorkoutInDB):
    pass
