"""
Chat schemas for AgroBrain AI backend.

Pydantic models for chat requests, responses, and session management.
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class MessageResponse(BaseModel):
    """Schema for a single message in a response."""
    msg_id: str
    role: str
    content: str
    language: str
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ChatRequest(BaseModel):
    """Schema for a new chat message request."""
    message: str = Field(..., max_length=500, description="User's query")
    session_id: Optional[str] = Field(None, description="Current chat session ID")
    language: str = Field("auto", description="hi, en, or auto")
    context: Optional[Dict[str, Any]] = Field(None, description="Optional context like active_crop, lat, lng")


class ChatResponse(BaseModel):
    """Schema for a standard chat response."""
    session_id: str
    user_message: MessageResponse
    ai_response: MessageResponse
    tokens_used: int = 0
    response_time_ms: int = 0


class VoiceRequest(BaseModel):
    """Schema for a voice query (already transcribed)."""
    text: str = Field(..., description="Transcribed text from browser")
    language: str = Field("hi", description="hi or en")
    lat: Optional[float] = None
    lng: Optional[float] = None


class VoiceResponse(BaseModel):
    """Schema for voice query response."""
    response_text: str
    response_hi: Optional[str] = None
    response_en: Optional[str] = None
    intent: str
    action_taken: str
    response_time_ms: int


class SessionSummary(BaseModel):
    """Brief summary of a chat session."""
    session_id: str
    last_message: str
    total_messages: int
    updated_at: datetime
    is_active: bool


class SessionHistoryResponse(BaseModel):
    """Complete history of a chat session."""
    session_id: str
    messages: List[MessageResponse]
    total_messages: int
    started_at: datetime
    context: Dict[str, Any]


class FeedbackRequest(BaseModel):
    """Schema for chat message feedback."""
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
