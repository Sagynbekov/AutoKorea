"""API routes for staff operations."""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.staff import StaffCreate, StaffUpdate, StaffResponse
from app.services.staff_service import StaffService

router = APIRouter(prefix="/api/staff", tags=["staff"])
staff_service = StaffService()

@router.post("/", response_model=StaffResponse, status_code=201)
async def create_staff(staff_data: StaffCreate):
    """Create a new staff member."""
    staff = await staff_service.create_staff(staff_data)
    return StaffResponse(
        id=staff.id,
        name=staff.name,
        inn=staff.inn,
        phone=staff.phone,
        email=staff.email,
        city=staff.city,
        status=staff.status,
        registered_date=staff.registered_date,
        total_orders=staff.total_orders,
        total_spent=staff.total_spent,
    )

@router.get("/", response_model=List[StaffResponse])
async def get_all_staff(
    status: Optional[str] = Query(None, description="Filter by status"),
    limit: Optional[int] = Query(None, description="Limit results"),
):
    """Get all staff members with optional filtering."""
    staff_list = await staff_service.get_all_staff(limit=limit, status=status)
    return [
        StaffResponse(
            id=staff.id,
            name=staff.name,
            inn=staff.inn,
            phone=staff.phone,
            email=staff.email,
            city=staff.city,
            status=staff.status,
            registered_date=staff.registered_date,
            total_orders=staff.total_orders,
            total_spent=staff.total_spent,
        )
        for staff in staff_list
    ]

@router.get("/search", response_model=List[StaffResponse])
async def search_staff(q: str = Query(..., description="Search query")):
    """Search staff by name, phone, email, or city."""
    staff_list = await staff_service.search_staff(q)
    return [
        StaffResponse(
            id=staff.id,
            name=staff.name,
            inn=staff.inn,
            phone=staff.phone,
            email=staff.email,
            city=staff.city,
            status=staff.status,
            registered_date=staff.registered_date,
            total_orders=staff.total_orders,
            total_spent=staff.total_spent,
        )
        for staff in staff_list
    ]

@router.get("/{staff_id}", response_model=StaffResponse)
async def get_staff(staff_id: str):
    """Get staff member by ID."""
    staff = await staff_service.get_staff_by_id(staff_id)
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    
    return StaffResponse(
        id=staff.id,
        name=staff.name,
        inn=staff.inn,
        phone=staff.phone,
        email=staff.email,
        city=staff.city,
        status=staff.status,
        registered_date=staff.registered_date,
        total_orders=staff.total_orders,
        total_spent=staff.total_spent,
    )

@router.put("/{staff_id}", response_model=StaffResponse)
async def update_staff(staff_id: str, staff_data: StaffUpdate):
    """Update staff member."""
    staff = await staff_service.update_staff(staff_id, staff_data)
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    
    return StaffResponse(
        id=staff.id,
        name=staff.name,
        inn=staff.inn,
        phone=staff.phone,
        email=staff.email,
        city=staff.city,
        status=staff.status,
        registered_date=staff.registered_date,
        total_orders=staff.total_orders,
        total_spent=staff.total_spent,
    )

@router.delete("/{staff_id}", status_code=204)
async def delete_staff(staff_id: str):
    """Delete staff member."""
    success = await staff_service.delete_staff(staff_id)
    if not success:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return None
