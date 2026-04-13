"""
Voice routes for AgroBrain AI backend.

Handles voice-to-text processing and intelligent intent routing
to appropriate services.
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.logger import logger
from app.core.database import get_database
from app.core.redis import get_redis_client
from app.services.auth_service import get_current_user
from app.services.voice_service import voice_service
from app.schemas.chat import VoiceRequest, VoiceResponse

# Create router
router = APIRouter(prefix="/voice", tags=["Voice"])

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)


@router.post("/query", response_model=VoiceResponse)
@limiter.limit("30/minute")
async def process_voice_query(
    request: Request,
    voice_req: VoiceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db = Depends(get_database),
    redis = Depends(get_redis_client)
):
    """
    Process a transcribed voice query.
    Detects intent and routes to:
    - Weather
    - Irrigation
    - Crop Recommendations
    - General Chat
    """
    try:
        user_id = str(current_user["_id"])
        self_logger = logger.bind(user_id=user_id)
        
        self_logger.info(f"Voice query received: {voice_req.text[:50]}...")
        
        # Process query via voice service
        result = await voice_service.process_voice_query(
            voice_req, 
            current_user, 
            db, 
            redis
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Voice route failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to process voice query."
        )
