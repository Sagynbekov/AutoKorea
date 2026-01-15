"""Business logic for staff operations."""
from typing import List, Optional
from google.cloud.firestore_v1 import FieldFilter
from app.models.staff import StaffModel
from app.schemas.staff import StaffCreate, StaffUpdate
from app.config import get_db

class StaffService:
    """Service for managing staff members."""
    
    def __init__(self):
        self.db = get_db()
        self.collection = self.db.collection(StaffModel.COLLECTION_NAME)
    
    async def create_staff(self, staff_data: StaffCreate) -> StaffModel:
        """Create a new staff member."""
        staff = StaffModel(
            name=staff_data.name,
            inn=staff_data.inn,
            phone=staff_data.phone,
            email=staff_data.email,
            city=staff_data.city,
            status=staff_data.status,
        )
        
        doc_ref = self.collection.document()
        doc_ref.set(staff.to_dict())
        staff.id = doc_ref.id
        
        return staff
    
    async def get_staff_by_id(self, staff_id: str) -> Optional[StaffModel]:
        """Get staff member by ID."""
        doc = self.collection.document(staff_id).get()
        if not doc.exists:
            return None
        return StaffModel.from_dict(doc.to_dict(), staff_id)
    
    async def get_all_staff(
        self,
        limit: Optional[int] = None,
        status: Optional[str] = None
    ) -> List[StaffModel]:
        """Get all staff members with optional filtering."""
        query = self.collection
        
        if status:
            query = query.where(filter=FieldFilter("status", "==", status))
        
        if limit:
            query = query.limit(limit)
        
        docs = query.stream()
        return [StaffModel.from_dict(doc.to_dict(), doc.id) for doc in docs]
    
    async def update_staff(
        self,
        staff_id: str,
        staff_data: StaffUpdate
    ) -> Optional[StaffModel]:
        """Update staff member."""
        doc_ref = self.collection.document(staff_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return None
        
        # Update only provided fields
        update_data = {
            k: v for k, v in staff_data.model_dump(exclude_unset=True).items()
            if v is not None
        }
        
        # Convert snake_case to camelCase for Firestore
        firestore_data = {}
        field_mapping = {
            "total_orders": "totalOrders",
            "total_spent": "totalSpent",
            "registered_date": "registeredDate"
        }
        
        for key, value in update_data.items():
            firestore_key = field_mapping.get(key, key)
            firestore_data[firestore_key] = value
        
        if firestore_data:
            doc_ref.update(firestore_data)
        
        updated_doc = doc_ref.get()
        return StaffModel.from_dict(updated_doc.to_dict(), staff_id)
    
    async def delete_staff(self, staff_id: str) -> bool:
        """Delete staff member."""
        doc_ref = self.collection.document(staff_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            return False
        
        doc_ref.delete()
        return True
    
    async def search_staff(self, query: str) -> List[StaffModel]:
        """Search staff by name, phone, email, or city."""
        # Note: Firestore doesn't support full-text search natively
        # This is a basic implementation. For production, consider using
        # Algolia, Elasticsearch, or Firebase Extensions for full-text search
        all_staff = await self.get_all_staff()
        
        query_lower = query.lower()
        results = []
        
        for staff in all_staff:
            if (query_lower in staff.name.lower() or
                query_lower in staff.phone or
                query_lower in staff.email.lower() or
                query_lower in staff.city.lower()):
                results.append(staff)
        
        return results
