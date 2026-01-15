"""Pydantic schemas for Staff validation and serialization."""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class StaffBase(BaseModel):
    """Base staff schema."""
    name: str = Field(..., min_length=1, max_length=200)
    inn: str = Field(..., min_length=10, max_length=12)
    phone: str = Field(..., pattern=r"^\+?[\d\s\-()]+$")
    email: EmailStr
    city: str = Field(..., min_length=1, max_length=100)
    status: Optional[str] = Field(default="active", pattern="^(active|inactive|new)$")

class StaffCreate(StaffBase):
    """Schema for creating a new staff member."""
    pass

class StaffUpdate(BaseModel):
    """Schema for updating a staff member."""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    inn: Optional[str] = Field(None, min_length=10, max_length=12)
    phone: Optional[str] = Field(None, pattern=r"^\+?[\d\s\-()]+$")
    email: Optional[EmailStr] = None
    city: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[str] = Field(None, pattern="^(active|inactive|new)$")
    total_orders: Optional[int] = Field(None, ge=0)
    total_spent: Optional[float] = Field(None, ge=0)

class StaffResponse(StaffBase):
    """Schema for staff response."""
    id: str
    registered_date: datetime
    total_orders: int = 0
    total_spent: float = 0.0
    
    class Config:
        from_attributes = True
