from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from database import get_db
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from models import User

router = APIRouter(tags=["Authentication"])

@router.post("/register")
def register(user_data: dict = Body(...), db: Session = Depends(get_db)):
    if not user_data.get("email") or not user_data.get("password"):
        raise HTTPException(status_code=400, detail="Email and password required")
        
    db_user = db.query(User).filter(User.email == user_data["email"]).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data["password"])
    new_user = User(
        email=user_data["email"], 
        hashed_password=hashed_password,
        full_name=user_data.get("full_name", "Operator")
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "email": new_user.email}

@router.post("/token")
def login(form_data: dict = Body(...), db: Session = Depends(get_db)):
    if not form_data.get("email") or not form_data.get("password"):
        raise HTTPException(status_code=400, detail="Email and password required")

    user = db.query(User).filter(User.email == form_data["email"]).first()
    if not user or not verify_password(form_data["password"], user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name
    }
