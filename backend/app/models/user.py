"""
User model for AgroBrain AI backend.

This module defines the UserDocument class for MongoDB users collection
using Motor (async MongoDB driver) with complete auth system.
"""

from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from bson import ObjectId
import uuid


@dataclass
class UserDocument:
    """Complete user document model for MongoDB users collection."""
    
    # Identity
    username: str = ""
    email: str = ""
    phone: Optional[str] = None
    name: str = ""
    avatar_url: Optional[str] = None
    bio: str = ""
    
    # Auth
    hashed_password: Optional[str] = None
    google_id: Optional[str] = None
    auth_provider: str = "email"  # "email" | "google"
    is_verified: bool = False
    email_verify_token: Optional[str] = None
    password_reset_token: Optional[str] = None
    password_reset_expires: Optional[datetime] = None
    
    # Role & Access
    role: str = "farmer"  # "farmer" | "agronomist" | "admin"
    is_active: bool = True
    is_banned: bool = False
    ban_reason: Optional[str] = None
    
    # Language & Location
    language: str = "hi"  # "hi" | "en"
    default_location: Dict[str, Any] = field(default_factory=dict)
    
    # Farm Profile (farmer only)
    farm_profile: Dict[str, Any] = field(default_factory=dict)
    
    # Agronomist Profile (agronomist only)
    agronomist_profile: Dict[str, Any] = field(default_factory=dict)
    
    # Stats
    login_count: int = 0
    last_login: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    
    # MongoDB _id
    _id: Optional[ObjectId] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert UserDocument to dictionary for MongoDB storage."""
        result = {}
        
        # Handle ObjectId conversion
        if self._id is not None:
            result["_id"] = self._id
        
        # Add all fields
        result.update({
            "username": self.username,
            "email": self.email,
            "phone": self.phone,
            "name": self.name,
            "avatar_url": self.avatar_url,
            "bio": self.bio,
            "hashed_password": self.hashed_password,
            "google_id": self.google_id,
            "auth_provider": self.auth_provider,
            "is_verified": self.is_verified,
            "email_verify_token": self.email_verify_token,
            "password_reset_token": self.password_reset_token,
            "password_reset_expires": self.password_reset_expires,
            "role": self.role,
            "is_active": self.is_active,
            "is_banned": self.is_banned,
            "ban_reason": self.ban_reason,
            "language": self.language,
            "default_location": self.default_location,
            "farm_profile": self.farm_profile,
            "agronomist_profile": self.agronomist_profile,
            "login_count": self.login_count,
            "last_login": self.last_login,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "UserDocument":
        """Create UserDocument from MongoDB document."""
        return cls(
            _id=data.get("_id"),
            username=data.get("username", ""),
            email=data.get("email", ""),
            phone=data.get("phone"),
            name=data.get("name", ""),
            avatar_url=data.get("avatar_url"),
            bio=data.get("bio", ""),
            hashed_password=data.get("hashed_password"),
            google_id=data.get("google_id"),
            auth_provider=data.get("auth_provider", "email"),
            is_verified=data.get("is_verified", False),
            email_verify_token=data.get("email_verify_token"),
            password_reset_token=data.get("password_reset_token"),
            password_reset_expires=data.get("password_reset_expires"),
            role=data.get("role", "farmer"),
            is_active=data.get("is_active", True),
            is_banned=data.get("is_banned", False),
            ban_reason=data.get("ban_reason"),
            language=data.get("language", "hi"),
            default_location=data.get("default_location", {}),
            farm_profile=data.get("farm_profile", {}),
            agronomist_profile=data.get("agronomist_profile", {}),
            login_count=data.get("login_count", 0),
            last_login=data.get("last_login"),
            created_at=data.get("created_at", datetime.utcnow()),
            updated_at=data.get("updated_at", datetime.utcnow())
        )
    
    def update_timestamp(self) -> None:
        """Update the updated_at timestamp."""
        self.updated_at = datetime.utcnow()
    
    def update_last_login(self) -> None:
        """Update the last_login timestamp and increment login count."""
        self.last_login = datetime.utcnow()
        self.login_count += 1
        self.update_timestamp()
    
    def set_default_farm_profile(self) -> None:
        """Set default farm profile for farmer users."""
        if not self.farm_profile:
            self.farm_profile = {
                "total_area_acres": 0,
                "soil_type": "",
                "primary_crops": [],
                "irrigation_type": "",
                "has_soil_sensor": False
            }
    
    def set_default_agronomist_profile(self) -> None:
        """Set default agronomist profile for agronomist users."""
        if not self.agronomist_profile:
            self.agronomist_profile = {
                "specialization": [],
                "experience_years": 0,
                "states_served": [],
                "is_approved": False
            }
    
    def set_default_location(self) -> None:
        """Set default location structure for new users."""
        if not self.default_location:
            self.default_location = {
                "lat": 26.84,
                "lng": 80.94,
                "village": "",
                "district": "",
                "state": "",
                "pincode": ""
            }
    
    def generate_email_verify_token(self) -> str:
        """Generate email verification token."""
        self.email_verify_token = str(uuid.uuid4())
        self.update_timestamp()
        return self.email_verify_token
    
    def generate_password_reset_token(self) -> str:
        """Generate password reset token with 1 hour expiry."""
        self.password_reset_token = str(uuid.uuid4())
        self.password_reset_expires = datetime.utcnow() + timedelta(hours=1)
        self.update_timestamp()
        return self.password_reset_token
    
    def is_password_reset_token_valid(self) -> bool:
        """Check if password reset token is valid and not expired."""
        if not self.password_reset_token or not self.password_reset_expires:
            return False
        return datetime.utcnow() < self.password_reset_expires
    
    def is_email_verify_token_valid(self) -> bool:
        """Check if email verification token is still valid (24hr)."""
        if not self.email_verify_token:
            return False
        # Email tokens are valid for 24 hours
        expiry_time = self.created_at + timedelta(hours=24)
        return datetime.utcnow() < expiry_time
    
    def clear_password_reset_token(self) -> None:
        """Clear password reset token."""
        self.password_reset_token = None
        self.password_reset_expires = None
        self.update_timestamp()
    
    def clear_email_verify_token(self) -> None:
        """Clear email verification token after successful verification."""
        self.email_verify_token = None
        self.update_timestamp()


# MongoDB Indexes to be created
async def create_user_indexes(db):
    """Create necessary indexes for users collection."""
    await db.users.create_index("email", unique=True)
    await db.users.create_index("username", unique=True)
    await db.users.create_index("phone", unique=True, sparse=True)
    await db.users.create_index("google_id", unique=True, sparse=True)
    await db.users.create_index("role")
    await db.users.create_index("created_at")
    await db.users.create_index("email_verify_token", sparse=True)
    await db.users.create_index("password_reset_token", sparse=True)
