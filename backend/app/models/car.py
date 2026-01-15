"""Car data model for Firestore."""
from typing import Optional, List
from datetime import datetime

class CarModel:
    """Car data model."""
    
    COLLECTION_NAME = "cars"
    
    def __init__(
        self,
        brand: str,
        model: str,
        year: int,
        vin: str,
        color: str,
        mileage: int,
        purchase_price: float,
        selling_price: float,
        status: str = "available",
        manager: Optional[str] = None,
        location: Optional[str] = None,
        images: Optional[List[str]] = None,
        arrival_date: Optional[datetime] = None,
        car_id: Optional[str] = None
    ):
        self.id = car_id
        self.brand = brand
        self.model = model
        self.year = year
        self.vin = vin
        self.color = color
        self.mileage = mileage
        self.purchase_price = purchase_price
        self.selling_price = selling_price
        self.status = status
        self.manager = manager
        self.location = location
        self.images = images or []
        self.arrival_date = arrival_date or datetime.now()
    
    def to_dict(self) -> dict:
        """Convert model to dictionary for Firestore."""
        return {
            "brand": self.brand,
            "model": self.model,
            "year": self.year,
            "vin": self.vin,
            "color": self.color,
            "mileage": self.mileage,
            "purchasePrice": self.purchase_price,
            "sellingPrice": self.selling_price,
            "status": self.status,
            "manager": self.manager,
            "location": self.location,
            "images": self.images,
            "arrivalDate": self.arrival_date,
        }
    
    @classmethod
    def from_dict(cls, data: dict, car_id: str = None):
        """Create model from Firestore dictionary."""
        return cls(
            car_id=car_id,
            brand=data.get("brand", ""),
            model=data.get("model", ""),
            year=data.get("year", 0),
            vin=data.get("vin", ""),
            color=data.get("color", ""),
            mileage=data.get("mileage", 0),
            purchase_price=data.get("purchasePrice", 0.0),
            selling_price=data.get("sellingPrice", 0.0),
            status=data.get("status", "available"),
            manager=data.get("manager"),
            location=data.get("location"),
            images=data.get("images", []),
            arrival_date=data.get("arrivalDate"),
        )
