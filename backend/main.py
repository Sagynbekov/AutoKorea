from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.firebase import initialize_firebase
from app.routes import staff_router, car_router

# Initialize Firebase
initialize_firebase()

# Create FastAPI app
app = FastAPI(
    title="AutoKorea API",
    description="API for AutoKorea car dealership management system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(staff_router)
app.include_router(car_router)

# Health check route
@app.get("/")
def read_root():
    return {
        "status": "Server is running",
        "db_connected": True,
        "version": "1.0.0"
    }
