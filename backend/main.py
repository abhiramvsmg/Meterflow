from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Explicit imports
from routes.auth_routes import router as auth_router
from routes.api_routes import router as api_router
from routes.billing_routes import router as billing_router
from routes.key_routes import router as key_router
from routes.stats_routes import router as stats_router

app = FastAPI(title="MeterFlow API", description="API Billing Platform Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(api_router)
app.include_router(billing_router)
app.include_router(key_router)
app.include_router(stats_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MeterFlow API", "status": "online"}

@app.get("/health")
def health_check():
    return {"status": "ok", "routes_loaded": True}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)