from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    plan_id = Column(Integer, ForeignKey("plans.id"), default=1)
    
    api_keys = relationship("APIKey", back_populates="owner")
    apis = relationship("API", back_populates="owner")
    invoices = relationship("Invoice", back_populates="user")
    plan = relationship("Plan")

class API(Base):
    __tablename__ = "apis"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    base_url = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="apis")
    keys = relationship("APIKey", back_populates="api_ref")

class APIKey(Base):
    __tablename__ = "api_keys"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    api_id = Column(Integer, ForeignKey("apis.id"), nullable=True) # Optional: key tied to specific API
    usage_limit = Column(Integer, default=1000)
    current_usage = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    owner = relationship("User", back_populates="api_keys")
    api_ref = relationship("API", back_populates="keys")
    logs = relationship("UsageLog", back_populates="api_key_ref")

class UsageLog(Base):
    __tablename__ = "usage_logs"
    id = Column(Integer, primary_key=True, index=True)
    api_key_id = Column(Integer, ForeignKey("api_keys.id"))
    endpoint = Column(String)
    method = Column(String)
    status_code = Column(Integer)
    response_time = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    api_key_ref = relationship("APIKey", back_populates="logs")

class Plan(Base):
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String) # e.g., "Free", "Pro", "Enterprise"
    monthly_price = Column(Float)
    request_price = Column(Float) # Cost per 1000 requests
    limit_per_month = Column(Integer)

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    status = Column(String) # "pending", "paid"
    date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="invoices")
