"""
User model for AgroBrain AI backend.

This module defines the UserDocument class for MongoDB users collection
using Motor (async MongoDB driver).
"""

from datetime import datetime
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from bson import ObjectId


@dataclass
class UserDocument:
    """User document model for MongoDB users collection."""
    
    # Basic fields
    _id: Optional[ObjectId] = None
    phone: str = ""
    name: Optional[str] = None
    language: str = "hi"  # Default to Hindi for Indian farmers
    avatar_url: Optional[str] = None
    
    # Location information
    default_location: Dict[str, Any] = field(default_factory=dict)
    
    # Farm profile
    farm_profile: Dict[str, Any] = field(default_factory=dict)
    
    # Status fields
    is_verified: bool = False
    is_active: bool = True
    role: str = "farmer"  # farmer, admin, agronomist
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert UserDocument to dictionary for MongoDB storage."""
        result = {}
        
        # Handle ObjectId conversion
        if self._id is not None:
            result["_id"] = self._id
        
        # Add all fields
        result.update({
            "phone": self.phone,
            "name": self.name,
            "language": self.language,
            "avatar_url": self.avatar_url,
            "default_location": self.default_location,
            "farm_profile": self.farm_profile,
            "is_verified": self.is_verified,
            "is_active": self.is_active,
            "role": self.role,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "last_login": self.last_login
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "UserDocument":
        """Create UserDocument from MongoDB document."""
        # Extract fields with defaults
        return cls(
            _id=data.get("_id"),
            phone=data.get("phone", ""),
            name=data.get("name"),
            language=data.get("language", "hi"),
            avatar_url=data.get("avatar_url"),
            default_location=data.get("default_location", {}),
            farm_profile=data.get("farm_profile", {}),
            is_verified=data.get("is_verified", False),
            is_active=data.get("is_active", True),
            role=data.get("role", "farmer"),
            created_at=data.get("created_at", datetime.utcnow()),
            updated_at=data.get("updated_at", datetime.utcnow()),
            last_login=data.get("last_login")
        )
    
    def update_timestamp(self) -> None:
        """Update the updated_at timestamp."""
        self.updated_at = datetime.utcnow()
    
    def update_last_login(self) -> None:
        """Update the last_login timestamp."""
        self.last_login = datetime.utcnow()
        self.update_timestamp()
    
    def set_default_farm_profile(self) -> None:
        """Set default farm profile for new users."""
        if not self.farm_profile:
            self.farm_profile = {
                "total_area_acres": None,
                "soil_type": None,
                "primary_crops": [],
                "irrigation_type": None,
                "has_soil_sensor": False
            }
    
    def set_default_location(self) -> None:
        """Set default location structure for new users."""
        if not self.default_location:
            self.default_location = {
                "lat": None,
                "lng": None,
                "village": None,
                "district": None,
                "state": None,
                "pincode": None
            }
