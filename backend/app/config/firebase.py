"""Firebase configuration and initialization."""
import firebase_admin
from firebase_admin import credentials, firestore
from functools import lru_cache

_db = None

def initialize_firebase():
    """Initialize Firebase Admin SDK."""
    global _db
    if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    _db = firestore.client()
    return _db

@lru_cache()
def get_db():
    """Get Firestore database client."""
    global _db
    if _db is None:
        return initialize_firebase()
    return _db
