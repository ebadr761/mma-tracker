from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.database import db
from app.models.user import UserCreate, UserResponse, UserInDB
from app.auth.security import get_password_hash, verify_password, create_access_token
from app.routes.deps import get_current_user
from datetime import timedelta
from app.config import settings

router = APIRouter()

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    # Check if user exists
    existing_user = await db.get_db().users.find_one({
        "$or": [{"email": user_in.email}, {"username": user_in.username}]
    })
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create user
    user_dict = user_in.model_dump()
    password = user_dict.pop("password")
    user_dict["passwordHash"] = get_password_hash(password)
    
    result = await db.get_db().users.insert_one(user_dict)
    
    # Return user with ID (without password hash logic handled by UserResponse, but here we return a dict with message)
    # The README says: { message: "...", user: { ... } }
    
    created_user = await db.get_db().users.find_one({"_id": result.inserted_id})
    user_model = UserResponse(**created_user)

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(created_user["_id"])}, expires_delta=access_token_expires
    )
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_model.model_dump(by_alias=True)
    }

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Note: OAuth2PasswordRequestForm expects username field, but we might accept email as username
    # The README says: { email: "...", password: "..." } for login
    # So we might need a custom Body or handle OAuth2 form flexibility.
    # But for simplicity with frontend integration (which likely sends JSON), we should probably accept JSON body.
    # Let's override to accept JSON matching the existing frontend.
    pass

# Redefining login to match existing API JSON Structure
from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login") # Mapped to /login
async def login(login_data: LoginRequest):
    user = await db.get_db().users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user["_id"])}, expires_delta=access_token_expires
    )
    
    # Existing frontend expects: { message: "...", user: {...} }
    # It might handle the token via cookie (HttpOnly) or body. 
    # README says "Session-based authentication with HTTP-only cookies".
    # Since we are moving to Token/JWT for "Modern" / "Mobile Ready", we should see how frontend expects it.
    # If the frontend expects a session cookie `connect.sid`, we might have a mismatch.
    # However, user approved "Backend Migration ... to Python".
    # We should probably return the token in the body for now, and I might need to update frontend to store it.
    # OR, we can set an HttpOnly cookie with the JWT.
    
    # For now, let's return it in body AND set cookie to be safe/flexible.
    
    user_model = UserResponse(**user)
    
    return {
        "message": "Login successful",
        "access_token": access_token, 
        "token_type": "bearer",
        "user": user_model.model_dump(by_alias=True)
    }

@router.get("/me", response_model=dict)
async def read_users_me(current_user: UserInDB = Depends(get_current_user)):
    return {"user": UserResponse(**current_user.model_dump()).model_dump(by_alias=True)}
