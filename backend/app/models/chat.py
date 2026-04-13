"""
Chat models for AgroBrain AI backend.

This module defines the ChatSession and ChatMessage document models for
storing conversation history between farmers and the AI agronomist.
"""

from datetime import datetime
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from bson import ObjectId


@dataclass
class ChatMessage:
    """Single chat message model."""
    
    role: str  # 'user' or 'assistant'
    content: str
    msg_id: str = field(default_factory=lambda: str(ObjectId()))
    content_type: str = "text"  # text, audio_transcript
    language_detected: Optional[str] = None
    model_used: Optional[str] = None
    tokens_used: int = 0
    response_time_ms: int = 0
    timestamp: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self) -> Dict[str, Any]:
        """Convert message to dictionary."""
        return {
            "msg_id": self.msg_id,
            "role": self.role,
            "content": self.content,
            "content_type": self.content_type,
            "language_detected": self.language_detected,
            "model_used": self.model_used,
            "tokens_used": self.tokens_used,
            "response_time_ms": self.response_time_ms,
            "timestamp": self.timestamp
        }


@dataclass
class ChatSession:
    """Chat session document model for MongoDB."""
    
    user_id: str
    _id: Optional[ObjectId] = None
    session_id: str = field(default_factory=lambda: str(ObjectId()))
    
    # Session metadata (nested as requested)
    session_info: Dict[str, Any] = field(default_factory=lambda: {
        "started_at": datetime.utcnow(),
        "ended_at": None,
        "total_messages": 0,
        "language": "hi",
        "is_active": True,
        "context": {
            "location_id": None,
            "active_crop": None,
            "weather_condition": None
        }
    })
    
    # Embedded messages array
    messages: List[ChatMessage] = field(default_factory=list)
    
    # Metadata for the document itself
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)
    prev_session_id: Optional[str] = None  # For linking long conversations

    def to_dict(self) -> Dict[str, Any]:
        """Convert ChatSession to dictionary for MongoDB."""
        result = {
            "user_id": self.user_id,
            "session_id": self.session_id,
            "session": self.session_info,
            "messages": [m.to_dict() for m in self.messages],
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "prev_session_id": self.prev_session_id
        }
        if self._id:
            result["_id"] = self._id
        return result

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ChatSession":
        """Create ChatSession from MongoDB document."""
        messages = [
            ChatMessage(
                role=m["role"],
                content=m["content"],
                msg_id=m.get("msg_id"),
                content_type=m.get("content_type", "text"),
                language_detected=m.get("language_detected"),
                model_used=m.get("model_used"),
                tokens_used=m.get("tokens_used", 0),
                response_time_ms=m.get("response_time_ms", 0),
                timestamp=m.get("timestamp", datetime.utcnow())
            ) for m in data.get("messages", [])
        ]
        
        return cls(
            user_id=data["user_id"],
            _id=data.get("_id"),
            session_id=data.get("session_id"),
            session_info=data.get("session", {}),
            messages=messages,
            created_at=data.get("created_at", datetime.utcnow()),
            updated_at=data.get("updated_at", datetime.utcnow()),
            prev_session_id=data.get("prev_session_id")
        )
    
    def add_message(self, message: ChatMessage) -> None:
        """Add message to session and update counters."""
        self.messages.append(message)
        self.session_info["total_messages"] = len(self.messages)
        self.updated_at = datetime.utcnow()

    def is_expired(self, timeout_minutes: int = 45) -> bool:
        """Check if session has timed out due to inactivity."""
        if not self.session_info.get("is_active", True):
            return True
        inactivity = datetime.utcnow() - self.updated_at
        return inactivity.total_seconds() > (timeout_minutes * 60)
