import time
import httpx
from fastapi import Request, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import APIKey, UsageLog, API

async def gateway_middleware(request: Request, target_path: str, db: Session):
    api_key = request.headers.get("X-API-KEY")
    if not api_key:
        raise HTTPException(status_code=401, detail="API Key Missing")
    
    key_record = db.query(APIKey).filter(APIKey.key == api_key, APIKey.is_active == True).first()
    if not key_record:
        raise HTTPException(status_code=403, detail="Invalid or Inactive API Key")
    
    if key_record.current_usage >= key_record.usage_limit:
        raise HTTPException(status_code=429, detail="Usage Limit Exceeded")

    # Resolve target URL
    # Default to JSONPlaceholder if no specific API is tied to the key
    target_url = f"https://jsonplaceholder.typicode.com/{target_path}"
    
    # If the key is tied to a specific API model, use its base URL
    if key_record.api_ref:
        target_url = f"{key_record.api_ref.base_url.rstrip('/')}/{target_path}"
    elif "pokemon" in target_path:
        target_url = f"https://pokeapi.co/api/v2/{target_path.replace('pokemon/', '')}"

    start_time = time.time()
    
    async with httpx.AsyncClient() as client:
        method = request.method
        headers = {k: v for k, v in request.headers.items() if k.lower() not in ["host", "x-api-key"]}
        body = await request.body()
        
        try:
            response = await client.request(
                method,
                target_url,
                headers=headers,
                content=body,
                params=dict(request.query_params)
            )
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Target API Error: {str(e)}")

    duration = time.time() - start_time
    
    # Log usage
    key_record.current_usage += 1
    log = UsageLog(
        api_key_id=key_record.id,
        endpoint=target_path,
        method=method,
        status_code=response.status_code,
        response_time=duration
    )
    db.add(log)
    db.commit()

    return response
