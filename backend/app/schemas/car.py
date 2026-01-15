"""Pydantic schemas for Car validation and serialization."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CarBase(BaseModel):
    """Base car schema."""
    brand: str = Field(..., min_length=1, max_length=100)
    model: str = Field(..., min_length=1, max_length=100)
    year: int = Field(..., ge=1900, le=2030)
    vin: str = Field(..., min_length=17, max_length=17)
    color: str = Field(..., min_length=1, max_length=50)
    mileage: int = Field(..., ge=0)
    purchase_price: float = Field(..., ge=0)
    selling_price: float = Field(..., ge=0)
    status: Optional[str] = Field(
        default="available",
        pattern="^(available|reserved|sold|in_transit|in_service)$"
    )
    manager: Optional[str] = None
    location: Optional[str] = None
    images: Optional[List[str]] = []

class CarCreate(CarBase):
    """Schema for creating a new car."""
    pass

class CarUpdate(BaseModel):
    """Schema for updating a car."""
    brand: Optional[str] = Field(None, min_length=1, max_length=100)
    model: Optional[str] = Field(None, min_length=1, max_length=100)
    year: Optional[int] = Field(None, ge=1900, le=2030)
    vin: Optional[str] = Field(None, min_length=17, max_length=17)
    color: Optional[str] = Field(None, min_length=1, max_length=50)
    mileage: Optional[int] = Field(None, ge=0)
    purchase_price: Optional[float] = Field(None, ge=0)
    selling_price: Optional[float] = Field(None, ge=0)
    status: Optional[str] = Field(
        None,
        pattern="^(available|reserved|sold|in_transit|in_service)$"
    )
    manager: Optional[str] = None
    location: Optional[str] = None
    images: Optional[List[str]] = None

class CarResponse(CarBase):
    """Schema for car response."""
    id: str
    arrival_date: datetime
    
    class Config:
        from_attributes = True
