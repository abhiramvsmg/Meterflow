from database import SessionLocal
from models import Plan
from auth import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        # Check if plans already exist
        if db.query(Plan).first() is None:
            # Create default plans
            free_plan = Plan(name="Free", monthly_price=0.0, request_price=0.0, limit_per_month=1000)
            pro_plan = Plan(name="Pro", monthly_price=9.99, request_price=0.01, limit_per_month=10000)
            enterprise_plan = Plan(name="Enterprise", monthly_price=49.99, request_price=0.005, limit_per_month=100000)
            
            db.add(free_plan)
            db.add(pro_plan)
            db.add(enterprise_plan)
            db.commit()
            print("Default plans seeded.")
        else:
            print("Plans already exist.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()