from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from models import User, APIKey, Plan, Invoice

router = APIRouter(tags=["Billing"])

@router.get("/plans")
def list_plans(db: Session = Depends(get_db)):
    return db.query(Plan).all()

@router.post("/billing/plan/{plan_id}")
def update_plan(plan_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        return {"error": "Plan not found"}
    current_user.plan_id = plan_id
    db.commit()
    return {"message": f"Plan updated to {plan.name}", "plan_id": plan_id}

@router.get("/billing/usage")
def get_usage_cost(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    keys = db.query(APIKey).filter(APIKey.user_id == current_user.id).all()
    total_usage = sum(k.current_usage for k in keys)
    
    # Use current plan for calculation
    plan = current_user.plan
    if not plan:
        plan = db.query(Plan).first() # Fallback to first plan
    
    # Calculate cost: base price + (overage * price_per_1000)
    overage = max(0, total_usage - plan.limit_per_month)
    cost = plan.monthly_price + (overage / 1000) * plan.request_price
    
    return {
        "total_requests": total_usage,
        "current_cost": round(cost, 2),
        "currency": "USD",
        "next_billing_date": "2026-05-22",
        "current_plan": plan.name
    }
