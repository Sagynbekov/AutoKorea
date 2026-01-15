"""Business logic for car operations."""
from typing import List, Optional
from google.cloud.firestore_v1 import FieldFilter
from app.models.car import CarModel
from app.schemas.car import CarCreate, CarUpdate
from app.config import get_db

class CarService:
    """Service for managing cars."""
    
    def __init__(self):
        self.db = get_db()
        self.collection = self.db.collection(CarModel.COLLECTION_NAME)
    
    async def create_car(self, car_data: CarCreate) -> CarModel:
        """Create a new car."""
        car = CarModel(
            brand=car_data.brand,
            model=car_data.model,
            year=car_data.year,
            vin=car_data.vin,
            color=car_data.color,
            mileage=car_data.mileage,
            purchase_price=car_data.purchase_price,
            selling_price=car_data.selling_price,
            status=car_data.status,
            manager=car_data.manager,
            location=car_data.location,
            images=car_data.images,
        )
        
        doc_ref = self.collection.document()
        doc_ref.set(car.to_dict())
        car.id = doc_ref.id
        
        return car
    
    async def get_car_by_id(self, car_id: str) -> Optional[CarModel]:
        """Get car by ID."""
        doc = self.collection.document(car_id).get()
        if not doc.exists:
            return None
        return CarModel.from_dict(doc.to_dict(), car_id)
    
    async def get_all_cars(
        self,
        limit: Optional[int] = None,
        status: Optional[str] = None,
        manager: Optional[str] = None
    ) -> List[CarModel]:
        """Get all cars with optional filtering."""
        query = self.collection
        
        if status:
            query = query.where(filter=FieldFilter("status", "==", status))
        
        if manager:
            query = query.where(filter=FieldFilter("manager", "==", manager))
        
        if limit:
            query = query.limit(limit)
        
        docs = query.stream()
        return [CarModel.from_dict(doc.to_dict(), doc.id) for doc in docs]
    
    async def update_car(
        self,
        car_id: str,
        car_data: CarUpdate
    ) -> Optional[CarModel]:
        """Update car."""
        doc_ref = self.collection.document(car_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        # Update only provided fields
        update_data = {
            k: v for k, v in car_data.model_dump(exclude_unset=True).items()
            if v is not None
        }
        
        # Convert snake_case to camelCase for Firestore
        firestore_data = {}
        field_mapping = {
            "purchase_price": "purchasePrice",
            "selling_price": "sellingPrice",
            "arrival_date": "arrivalDate"
        }
        
        for key, value in update_data.items():
            firestore_key = field_mapping.get(key, key)
            firestore_data[firestore_key] = value
        
        if firestore_data:
            doc_ref.update(firestore_data)
        
        updated_doc = doc_ref.get()
        return CarModel.from_dict(updated_doc.to_dict(), car_id)
    
    async def delete_car(self, car_id: str) -> bool:
        """Delete car."""
        doc_ref = self.collection.document(car_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        doc_ref.delete()
        return True
    
    async def get_cars_by_manager(self, manager_name: str) -> List[CarModel]:
        """Get all cars managed by a specific staff member."""
        return await self.get_all_cars(manager=manager_name)
