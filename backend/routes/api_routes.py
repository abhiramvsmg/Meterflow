from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from models import User, API

router = APIRouter(tags=["API Registry"])

@router.post("/apis")
def register_api(api_data: dict = Body(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not api_data.get("name") or not api_data.get("base_url"):
        raise HTTPException(status_code=400, detail="Name and Base URL are required")

    new_api = API(
        name=api_data["name"],
        description=api_data.get("description", ""),
        base_url=api_data["base_url"],
        user_id=current_user.id
    )
    db.add(new_api)
    db.commit()
    db.refresh(new_api)
    return new_api

@router.get("/apis")
def list_apis(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(API).filter(API.user_id == current_user.id).all()

@router.delete("/apis/{api_id}")
def delete_api(api_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    api_record = db.query(API).filter(API.id == api_id, API.user_id == current_user.id).first()
    if not api_record:
        raise HTTPException(status_code=404, detail="API not found")
    db.delete(api_record)
    db.commit()
    return {"message": "API deleted"}
