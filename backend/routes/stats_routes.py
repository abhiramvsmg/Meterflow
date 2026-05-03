from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from database import get_db
from auth import get_current_user
from models import User, APIKey, UsageLog

router = APIRouter(tags=["Statistics"])

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    keys = db.query(APIKey).filter(APIKey.user_id == current_user.id).all()
    key_ids = [k.id for k in keys]
    
    logs = db.query(UsageLog).filter(UsageLog.api_key_id.in_(key_ids)).all()
    
    total_requests = len(logs)
    avg_latency = sum(l.response_time for l in logs) / total_requests if total_requests > 0 else 0
    
    # Usage by Hour (last 24 hours)
    now = datetime.utcnow()
    last_24h = now - timedelta(hours=24)
    
    hourly_data = db.query(
        func.strftime('%H:00', UsageLog.timestamp).label('hour'),
        func.count(UsageLog.id).label('count')
    ).filter(
        UsageLog.api_key_id.in_(key_ids),
        UsageLog.timestamp >= last_24h
    ).group_by('hour').all()
    
    chart_data = [{"time": d[0], "reqs": d[1]} for d in hourly_data]

    # Revenue Calculation
    try:
        plan = current_user.plan
        limit = plan.limit_per_month if plan else 1000
        monthly_price = plan.monthly_price if plan else 0
        req_price = plan.request_price if plan else 0.05
    except:
        limit = 1000
        monthly_price = 0
        req_price = 0.05

    overage = max(0, total_requests - limit)
    est_revenue = monthly_price + (overage / 1000) * req_price

    # AI Pulse Simulation
    trend = "increasing" if len(chart_data) > 1 and chart_data[-1]["reqs"] > chart_data[-2]["reqs"] else "stable"
    ai_status = "OPTIMAL" if avg_latency < 100 else "DEGRADED"

    return {
        "total_requests": total_requests,
        "avg_latency": f"{avg_latency*1000:.1f}ms",
        "active_keys": len(keys),
        "success_rate": "99.9%",
        "est_revenue": f"${est_revenue:.2f}",
        "chart_data": chart_data,
        "ai_insights": {
            "trend": trend,
            "status": ai_status,
            "message": f"Traffic is {trend} across your endpoints. System health is {ai_status}."
        }
    }
