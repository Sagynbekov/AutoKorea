"""Staff data model for Firestore."""
from typing import Optional
from datetime import datetime

class StaffModel:
    """Staff member data model."""
    
    COLLECTION_NAME = "staff"
    
    def __init__(
        self,
        name: str,
        inn: str,
        phone: str,
        email: str,
        city: str,
        status: str = "active",
        registered_date: Optional[datetime] = None,
        total_orders: int = 0,
        total_spent: float = 0.0,
        staff_id: Optional[str] = None
    ):
        self.id = staff_id
        self.name = name
        self.inn = inn
        self.phone = phone
        self.email = email
        self.city = city
        self.status = status
        self.registered_date = registered_date or datetime.now()
        self.total_orders = total_orders
        self.total_spent = total_spent
    
    def to_dict(self) -> dict:
        """Convert model to dictionary for Firestore."""
        return {
            "name": self.name,
            "inn": self.inn,
            "phone": self.phone,
            "email": self.email,
            "city": self.city,
            "status": self.status,
            "registeredDate": self.registered_date,
            "totalOrders": self.total_orders,
            "totalSpent": self.total_spent,
        }
    
    @classmethod
    def from_dict(cls, data: dict, staff_id: str = None):
        """Create model from Firestore dictionary."""
        return cls(
            staff_id=staff_id,
            name=data.get("name", ""),
            inn=data.get("inn", ""),
            phone=data.get("phone", ""),
            email=data.get("email", ""),
            city=data.get("city", ""),
            status=data.get("status", "active"),
            registered_date=data.get("registeredDate"),
            total_orders=data.get("totalOrders", 0),
            total_spent=data.get("totalSpent", 0.0),
        )
