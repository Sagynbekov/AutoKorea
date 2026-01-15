"""API routes for car operations."""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.car import CarCreate, CarUpdate, CarResponse
from app.services.car_service import CarService

router = APIRouter(prefix="/api/cars", tags=["cars"])
car_service = CarService()

@router.post("/", response_model=CarResponse, status_code=201)
async def create_car(car_data: CarCreate):
    """Create a new car."""
    car = await car_service.create_car(car_data)
    return CarResponse(
        id=car.id,
        brand=car.brand,
        model=car.model,
        year=car.year,
        vin=car.vin,
        color=car.color,
        mileage=car.mileage,
        purchase_price=car.purchase_price,
        selling_price=car.selling_price,
        status=car.status,
        manager=car.manager,
        location=car.location,
        images=car.images,
        arrival_date=car.arrival_date,
    )

@router.get("/", response_model=List[CarResponse])
async def get_all_cars(
    status: Optional[str] = Query(None, description="Filter by status"),
    manager: Optional[str] = Query(None, description="Filter by manager"),
    limit: Optional[int] = Query(None, description="Limit results"),
):
    """Get all cars with optional filtering."""
    cars = await car_service.get_all_cars(limit=limit, status=status, manager=manager)
    return [
        CarResponse(
            id=car.id,
            brand=car.brand,
            model=car.model,
            year=car.year,
            vin=car.vin,
            color=car.color,
            mileage=car.mileage,
            purchase_price=car.purchase_price,
            selling_price=car.selling_price,
            status=car.status,
            manager=car.manager,
            location=car.location,
            images=car.images,
            arrival_date=car.arrival_date,
        )
        for car in cars
    ]

@router.get("/manager/{manager_name}", response_model=List[CarResponse])
async def get_cars_by_manager(manager_name: str):
    """Get all cars managed by a specific staff member."""
    cars = await car_service.get_cars_by_manager(manager_name)
    return [
        CarResponse(
            id=car.id,
            brand=car.brand,
            model=car.model,
            year=car.year,
            vin=car.vin,
            color=car.color,
            mileage=car.mileage,
            purchase_price=car.purchase_price,
            selling_price=car.selling_price,
            status=car.status,
            manager=car.manager,
            location=car.location,
            images=car.images,
            arrival_date=car.arrival_date,
        )
        for car in cars
    ]

@router.get("/{car_id}", response_model=CarResponse)
async def get_car(car_id: str):
    """Get car by ID."""
    car = await car_service.get_car_by_id(car_id)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    return CarResponse(
        id=car.id,
        brand=car.brand,
        model=car.model,
        year=car.year,
        vin=car.vin,
        color=car.color,
        mileage=car.mileage,
        purchase_price=car.purchase_price,
        selling_price=car.selling_price,
        status=car.status,
        manager=car.manager,
        location=car.location,
        images=car.images,
        arrival_date=car.arrival_date,
    )

@router.put("/{car_id}", response_model=CarResponse)
async def update_car(car_id: str, car_data: CarUpdate):
    """Update car."""
    car = await car_service.update_car(car_id, car_data)
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    
    return CarResponse(
        id=car.id,
        brand=car.brand,
        model=car.model,
        year=car.year,
        vin=car.vin,
        color=car.color,
        mileage=car.mileage,
        purchase_price=car.purchase_price,
        selling_price=car.selling_price,
        status=car.status,
        manager=car.manager,
        location=car.location,
        images=car.images,
        arrival_date=car.arrival_date,
    )

@router.delete("/{car_id}", status_code=204)
async def delete_car(car_id: str):
    """Delete car."""
    success = await car_service.delete_car(car_id)
    if not success:
        raise HTTPException(status_code=404, detail="Car not found")
    return None
