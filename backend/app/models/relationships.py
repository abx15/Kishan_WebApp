"""
Database relationship models for AgroBrain AI.

This module defines the relationship models and database schemas for:
- Farm management
- Chat conversations
- Recommendations
- Weather and soil data
- Market data
- Crop management
"""

from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from bson import ObjectId
import uuid


@dataclass
class FarmDocument:
    """Farm document model for MongoDB farms collection."""
    
    user_id: ObjectId
    farm_name: str
    location: Dict[str, Any] = field(default_factory=dict)
    total_area_acres: float = 0.0
    soil_type: str = ""
    ph_level: float = 7.0
    organic_matter: float = 0.0
    irrigation_source: str = ""
    certifications: List[str] = field(default_factory=list)
    farm_boundaries: Optional[Dict[str, Any]] = None
    current_crops: List[Dict[str, Any]] = field(default_factory=list)
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    
    # MongoDB _id
    _id: Optional[ObjectId] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert FarmDocument to dictionary for MongoDB storage."""
        result = {}
        
        if self._id is not None:
            result["_id"] = self._id
        
        result.update({
            "user_id": self.user_id,
            "farm_name": self.farm_name,
            "location": self.location,
            "total_area_acres": self.total_area_acres,
            "soil_type": self.soil_type,
            "ph_level": self.ph_level,
            "organic_matter": self.organic_matter,
            "irrigation_source": self.irrigation_source,
            "certifications": self.certifications,
            "farm_boundaries": self.farm_boundaries,
            "current_crops": self.current_crops,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "FarmDocument":
        """Create FarmDocument from MongoDB document."""
        return cls(
            _id=data.get("_id"),
            user_id=data.get("user_id"),
            farm_name=data.get("farm_name", ""),
            location=data.get("location", {}),
            total_area_acres=data.get("total_area_acres", 0.0),
            soil_type=data.get("soil_type", ""),
            ph_level=data.get("ph_level", 7.0),
            organic_matter=data.get("organic_matter", 0.0),
            irrigation_source=data.get("irrigation_source", ""),
            certifications=data.get("certifications", []),
            farm_boundaries=data.get("farm_boundaries"),
            current_crops=data.get("current_crops", []),
            created_at=data.get("created_at", datetime.utcnow()),
            updated_at=data.get("updated_at", datetime.utcnow())
        )


@dataclass
class ChatDocument:
    """Chat conversation document model."""
    
    user_id: ObjectId
    agronomist_id: ObjectId
    status: str = "active"  # active, resolved, closed
    topic: str = ""
    priority: str = "medium"  # low, medium, high, urgent
    tags: List[str] = field(default_factory=list)
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    last_message_at: Optional[datetime] = None
    
    # MongoDB _id
    _id: Optional[ObjectId] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert ChatDocument to dictionary for MongoDB storage."""
        result = {}
        
        if self._id is not None:
            result["_id"] = self._id
        
        result.update({
            "user_id": self.user_id,
            "agronomist_id": self.agronomist_id,
            "status": self.status,
            "topic": self.topic,
            "priority": self.priority,
            "tags": self.tags,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "last_message_at": self.last_message_at
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ChatDocument":
        """Create ChatDocument from MongoDB document."""
        return cls(
            _id=data.get("_id"),
            user_id=data.get("user_id"),
            agronomist_id=data.get("agronomist_id"),
            status=data.get("status", "active"),
            topic=data.get("topic", ""),
            priority=data.get("priority", "medium"),
            tags=data.get("tags", []),
            created_at=data.get("created_at", datetime.utcnow()),
            updated_at=data.get("updated_at", datetime.utcnow()),
            last_message_at=data.get("last_message_at")
        )


@dataclass
class MessageDocument:
    """Chat message document model."""
    
    chat_id: ObjectId
    sender_id: ObjectId
    sender_type: str = "user"  # user, agronomist, admin
    message: str = ""
    message_hi: str = ""
    message_type: str = "text"  # text, image, file, voice
    attachments: List[Dict[str, Any]] = field(default_factory=list)
    is_read: bool = False
    
    # Timestamps
    timestamp: datetime = field(default_factory=datetime.utcnow)
    
    # MongoDB _id
    _id: Optional[ObjectId] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert MessageDocument to dictionary for MongoDB storage."""
        result = {}
        
        if self._id is not None:
            result["_id"] = self._id
        
        result.update({
            "chat_id": self.chat_id,
            "sender_id": self.sender_id,
            "sender_type": self.sender_type,
            "message": self.message,
            "message_hi": self.message_hi,
            "message_type": self.message_type,
            "attachments": self.attachments,
            "read": self.is_read,
            "timestamp": self.timestamp
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "MessageDocument":
        """Create MessageDocument from MongoDB document."""
        return cls(
            _id=data.get("_id"),
            chat_id=data.get("chat_id"),
            sender_id=data.get("sender_id"),
            sender_type=data.get("sender_type", "user"),
            message=data.get("message", ""),
            message_hi=data.get("message_hi", ""),
            message_type=data.get("message_type", "text"),
            attachments=data.get("attachments", []),
            is_read=data.get("read", False),
            timestamp=data.get("timestamp", datetime.utcnow())
        )


@dataclass
class RecommendationDocument:
    """Recommendation document model."""
    
    user_id: ObjectId
    crop_type: str
    recommendation_type: str  # fertilizer, irrigation, pest_control, harvesting, planting
    recommendation: Dict[str, Any] = field(default_factory=dict)
    confidence_score: float = 0.0
    season: str = ""
    implementation_status: str = "pending"  # pending, implemented, rejected
    implementation_notes: str = ""
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    implemented_at: Optional[datetime] = None
    
    # MongoDB _id
    _id: Optional[ObjectId] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert RecommendationDocument to dictionary for MongoDB storage."""
        result = {}
        
        if self._id is not None:
            result["_id"] = self._id
        
        result.update({
            "user_id": self.user_id,
            "crop_type": self.crop_type,
            "recommendation_type": self.recommendation_type,
            "recommendation": self.recommendation,
            "confidence_score": self.confidence_score,
            "season": self.season,
            "implemented": self.implementation_status == "implemented",
            "implementation_status": self.implementation_status,
            "implementation_notes": self.implementation_notes,
            "created_at": self.created_at,
            "expires_at": self.expires_at,
            "implemented_at": self.implemented_at
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "RecommendationDocument":
        """Create RecommendationDocument from MongoDB document."""
        return cls(
            _id=data.get("_id"),
            user_id=data.get("user_id"),
            crop_type=data.get("crop_type", ""),
            recommendation_type=data.get("recommendation_type", ""),
            recommendation=data.get("recommendation", {}),
            confidence_score=data.get("confidence_score", 0.0),
            season=data.get("season", ""),
            implementation_status=data.get("implementation_status", "pending"),
            implementation_notes=data.get("implementation_notes", ""),
            created_at=data.get("created_at", datetime.utcnow()),
            expires_at=data.get("expires_at"),
            implemented_at=data.get("implemented_at")
        )


@dataclass
class WeatherDataDocument:
    """Weather data document model."""
    
    user_id: ObjectId
    date: datetime
    location: Dict[str, Any] = field(default_factory=dict)
    temperature: Dict[str, float] = field(default_factory=dict)  # max, min, avg
    humidity: float = 0.0
    rainfall: float = 0.0
    wind_speed: float = 0.0
    wind_direction: float = 0.0
    soil_moisture: float = 0.0
    uv_index: float = 0.0
    pressure: float = 0.0
    visibility: float = 0.0
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    
    # MongoDB _id
    _id: Optional[ObjectId] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert WeatherDataDocument to dictionary for MongoDB storage."""
        result = {}
        
        if self._id is not None:
            result["_id"] = self._id
        
        result.update({
            "user_id": self.user_id,
            "date": self.date.date() if isinstance(self.date, datetime) else self.date,
            "location": self.location,
            "temperature": self.temperature,
            "humidity": self.humidity,
            "rainfall": self.rainfall,
            "wind_speed": self.wind_speed,
            "wind_direction": self.wind_direction,
            "soil_moisture": self.soil_moisture,
            "uv_index": self.uv_index,
            "pressure": self.pressure,
            "visibility": self.visibility,
            "created_at": self.created_at
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "WeatherDataDocument":
        """Create WeatherDataDocument from MongoDB document."""
        return cls(
            _id=data.get("_id"),
            user_id=data.get("user_id"),
            date=data.get("date", datetime.utcnow()),
            location=data.get("location", {}),
            temperature=data.get("temperature", {}),
            humidity=data.get("humidity", 0.0),
            rainfall=data.get("rainfall", 0.0),
            wind_speed=data.get("wind_speed", 0.0),
            wind_direction=data.get("wind_direction", 0.0),
            soil_moisture=data.get("soil_moisture", 0.0),
            uv_index=data.get("uv_index", 0.0),
            pressure=data.get("pressure", 0.0),
            visibility=data.get("visibility", 0.0),
            created_at=data.get("created_at", datetime.utcnow())
        )


@dataclass
class SoilDataDocument:
    """Soil data document model."""
    
    user_id: ObjectId
    date: datetime
    location: Dict[str, Any] = field(default_factory=dict)
    ph: float = 7.0
    nitrogen: float = 0.0  # kg/ha
    phosphorus: float = 0.0  # kg/ha
    potassium: float = 0.0  # kg/ha
    organic_matter: float = 0.0  # percentage
    soil_type: str = ""
    texture: Dict[str, float] = field(default_factory=dict)  # sand, silt, clay percentages
    water_holding_capacity: float = 0.0
    electrical_conductivity: float = 0.0  # dS/m
    micronutrients: Dict[str, float] = field(default_factory=dict)  # zinc, iron, manganese, copper
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    
    # MongoDB _id
    _id: Optional[ObjectId] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert SoilDataDocument to dictionary for MongoDB storage."""
        result = {}
        
        if self._id is not None:
            result["_id"] = self._id
        
        result.update({
            "user_id": self.user_id,
            "date": self.date.date() if isinstance(self.date, datetime) else self.date,
            "location": self.location,
            "ph": self.ph,
            "nitrogen": self.nitrogen,
            "phosphorus": self.phosphorus,
            "potassium": self.potassium,
            "organic_matter": self.organic_matter,
            "soil_type": self.soil_type,
            "texture": self.texture,
            "water_holding_capacity": self.water_holding_capacity,
            "electrical_conductivity": self.electrical_conductivity,
            "micronutrients": self.micronutrients,
            "created_at": self.created_at
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "SoilDataDocument":
        """Create SoilDataDocument from MongoDB document."""
        return cls(
            _id=data.get("_id"),
            user_id=data.get("user_id"),
            date=data.get("date", datetime.utcnow()),
            location=data.get("location", {}),
            ph=data.get("ph", 7.0),
            nitrogen=data.get("nitrogen", 0.0),
            phosphorus=data.get("phosphorus", 0.0),
            potassium=data.get("potassium", 0.0),
            organic_matter=data.get("organic_matter", 0.0),
            soil_type=data.get("soil_type", ""),
            texture=data.get("texture", {}),
            water_holding_capacity=data.get("water_holding_capacity", 0.0),
            electrical_conductivity=data.get("electrical_conductivity", 0.0),
            micronutrients=data.get("micronutrients", {}),
            created_at=data.get("created_at", datetime.utcnow())
        )


@dataclass
class MarketDataDocument:
    """Market data document model."""
    
    crop: str
    mandi: str
    location: Dict[str, Any] = field(default_factory=dict)
    date: datetime
    price_per_quintal: float = 0.0
    min_price: float = 0.0
    max_price: float = 0.0
    trend: str = "stable"  # up, down, stable
    volume: int = 0  # quintals
    quality_grade: str = "A"  # A, B, C
    market_conditions: str = "normal"  # normal, high_demand, low_demand
    weather_impact: str = "none"  # none, positive, negative
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    
    # MongoDB _id
    _id: Optional[ObjectId] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert MarketDataDocument to dictionary for MongoDB storage."""
        result = {}
        
        if self._id is not None:
            result["_id"] = self._id
        
        result.update({
            "crop": self.crop,
            "mandi": self.mandi,
            "location": self.location,
            "date": self.date.date() if isinstance(self.date, datetime) else self.date,
            "price_per_quintal": self.price_per_quintal,
            "min_price": self.min_price,
            "max_price": self.max_price,
            "trend": self.trend,
            "volume": self.volume,
            "quality_grade": self.quality_grade,
            "market_conditions": self.market_conditions,
            "weather_impact": self.weather_impact,
            "created_at": self.created_at
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "MarketDataDocument":
        """Create MarketDataDocument from MongoDB document."""
        return cls(
            _id=data.get("_id"),
            crop=data.get("crop", ""),
            mandi=data.get("mandi", ""),
            location=data.get("location", {}),
            date=data.get("date", datetime.utcnow()),
            price_per_quintal=data.get("price_per_quintal", 0.0),
            min_price=data.get("min_price", 0.0),
            max_price=data.get("max_price", 0.0),
            trend=data.get("trend", "stable"),
            volume=data.get("volume", 0),
            quality_grade=data.get("quality_grade", "A"),
            market_conditions=data.get("market_conditions", "normal"),
            weather_impact=data.get("weather_impact", "none"),
            created_at=data.get("created_at", datetime.utcnow())
        )


@dataclass
class CropDocument:
    """Crop metadata document model."""
    
    name: str
    label: str
    season: str = ""
    water_needs: str = ""
    growing_days: int = 0
    optimal_ph: tuple = (6.0, 7.5)
    optimal_temperature: tuple = (20, 30)  # Celsius
    soil_types: List[str] = field(default_factory=list)
    common_diseases: List[str] = field(default_factory=list)
    common_pests: List[str] = field(default_factory=list)
    fertilizer_requirements: Dict[str, float] = field(default_factory=dict)
    yield_per_acre: float = 0.0  # quintals
    market_demand: str = "medium"  # low, medium, high
    
    # Timestamps
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    
    # MongoDB _id
    _id: Optional[ObjectId] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert CropDocument to dictionary for MongoDB storage."""
        result = {}
        
        if self._id is not None:
            result["_id"] = self._id
        
        result.update({
            "name": self.name,
            "label": self.label,
            "season": self.season,
            "water_needs": self.water_needs,
            "growing_days": self.growing_days,
            "optimal_ph": self.optimal_ph,
            "optimal_temperature": self.optimal_temperature,
            "soil_types": self.soil_types,
            "common_diseases": self.common_diseases,
            "common_pests": self.common_pests,
            "fertilizer_requirements": self.fertilizer_requirements,
            "yield_per_acre": self.yield_per_acre,
            "market_demand": self.market_demand,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "CropDocument":
        """Create CropDocument from MongoDB document."""
        return cls(
            _id=data.get("_id"),
            name=data.get("name", ""),
            label=data.get("label", ""),
            season=data.get("season", ""),
            water_needs=data.get("water_needs", ""),
            growing_days=data.get("growing_days", 0),
            optimal_ph=data.get("optimal_ph", (6.0, 7.5)),
            optimal_temperature=data.get("optimal_temperature", (20, 30)),
            soil_types=data.get("soil_types", []),
            common_diseases=data.get("common_diseases", []),
            common_pests=data.get("common_pests", []),
            fertilizer_requirements=data.get("fertilizer_requirements", {}),
            yield_per_acre=data.get("yield_per_acre", 0.0),
            market_demand=data.get("market_demand", "medium"),
            created_at=data.get("created_at", datetime.utcnow()),
            updated_at=data.get("updated_at", datetime.utcnow())
        )


# Database indexes creation function
async def create_relationship_indexes(db):
    """Create necessary indexes for relationship collections."""
    
    # Farms indexes
    await db.farms.create_index("user_id")
    await db.farms.create_index("location")
    await db.farms.create_index("created_at")
    
    # Chats indexes
    await db.chats.create_index("user_id")
    await db.chats.create_index("agronomist_id")
    await db.chats.create_index("status")
    await db.chats.create_index("created_at")
    await db.chats.create_index("last_message_at")
    
    # Messages indexes
    await db.messages.create_index("chat_id")
    await db.messages.create_index("sender_id")
    await db.messages.create_index("timestamp")
    await db.messages.create_index("read")
    
    # Recommendations indexes
    await db.recommendations.create_index("user_id")
    await db.recommendations.create_index("crop_type")
    await db.recommendations.create_index("recommendation_type")
    await db.recommendations.create_index("created_at")
    await db.recommendations.create_index("expires_at")
    
    # Weather data indexes
    await db.weather_data.create_index("user_id")
    await db.weather_data.create_index("date")
    await db.weather_data.create_index("location")
    await db.weather_data.create_index("created_at")
    
    # Soil data indexes
    await db.soil_data.create_index("user_id")
    await db.soil_data.create_index("date")
    await db.soil_data.create_index("location")
    await db.soil_data.create_index("created_at")
    
    # Market data indexes
    await db.market_data.create_index("crop")
    await db.market_data.create_index("mandi")
    await db.market_data.create_index("date")
    await db.market_data.create_index("location")
    await db.market_data.create_index("created_at")
    
    # Crops indexes
    await db.crops.create_index("name")
    await db.crops.create_index("season")
    await db.crops.create_index("label")
    
    print("All relationship indexes created successfully!")
