from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user, generate_api_key
from models import User, APIKey, API

router = APIRouter(tags=["API Keys"])

@router.post("/keys")
def create_key(key_data: dict = Body(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not key_data.get("name"):
        raise HTTPException(status_code=400, detail="Key name is required")

    new_key = APIKey(
        key=generate_api_key(),
        name=key_data["name"],
        user_id=current_user.id,
        api_id=key_data.get("api_id") if key_data.get("api_id") != "" else None,
        usage_limit=key_data.get("usage_limit", 1000),
        current_usage=0
    )
    db.add(new_key)
    db.commit()
    db.refresh(new_key)
    return new_key

@router.get("/keys")
def list_keys(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(APIKey).filter(APIKey.user_id == current_user.id).all()

@router.delete("/keys/{key_id}")
def delete_key(key_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    key_record = db.query(APIKey).filter(APIKey.id == key_id, APIKey.user_id == current_user.id).first()
    if not key_record:
        raise HTTPException(status_code=404, detail="Key not found")
    db.delete(key_record)
    db.commit()
    return {"message": "Key deleted"}
