"""
Chat routes for AgroBrain AI backend.

Handles RESTful chat messaging, history retrieval, and WebSocket 
streaming for real-time agricultural advice.
"""

from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, Query

from app.core.logger import logger
from app.core.database import get_database
from app.core.redis import get_redis_client
from app.core.websocket import manager
from app.services.auth_service import get_current_user
from app.services.chat_service import chat_service
from app.schemas.chat import (
    ChatRequest, 
    ChatResponse, 
    SessionHistoryResponse, 
    SessionSummary,
    MessageResponse
)

# Create router
router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/message", response_model=ChatResponse)
async def send_chat_message(
    request: ChatRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db = Depends(get_database),
    redis = Depends(get_redis_client)
):
    """
    Send a chat message and get a standard REST response.
    Recommended for mobile devices or simple queries.
    """
    try:
        return await chat_service.send_message(request, current_user, db, redis)
    except Exception as e:
        logger.error(f"Chat route failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to process chat message."
        )


@router.get("/sessions", response_model=List[SessionSummary])
async def get_chat_sessions(
    limit: int = Query(20, ge=1, le=50),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db = Depends(get_database)
):
    """Retrieve list of recent active chat sessions."""
    user_id = str(current_user["_id"])
    return await chat_service.get_all_sessions(user_id, db, limit)


@router.get("/sessions/{session_id}", response_model=SessionHistoryResponse)
async def get_session_history(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get full history of a specific chat session."""
    user_id = str(current_user["_id"])
    doc = await db.chat_sessions.find_one({"session_id": session_id, "user_id": user_id})
    
    if not doc:
        raise HTTPException(status_code=404, detail="Session not found.")
        
    session = SessionHistoryResponse(
        session_id=doc["session_id"],
        messages=[MessageResponse(**m) for m in doc["messages"]],
        total_messages=doc["total_messages"],
        started_at=doc["started_at"],
        context=doc.get("context", {})
    )
    return session


@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db = Depends(get_database)
):
    """Soft delete a chat session."""
    user_id = str(current_user["_id"])
    res = await db.chat_sessions.update_one(
        {"session_id": session_id, "user_id": user_id},
        {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
    )
    
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Session not found.")
        
    return {"success": True, "message": "Session archived successfully."}


@router.websocket("/ws/{session_id}")
async def chat_websocket(
    websocket: WebSocket,
    session_id: str,
    token: str = Query(...),
    db = Depends(get_database)
):
    """
    WebSocket endpoint for real-time streaming chat.
    Authentication is handled via the 'token' query parameter.
    """
    # 1. Authenticate WebSocket
    from jose import jwt
    from app.core.config import settings
    from bson import ObjectId
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
            
    except Exception as e:
        logger.warning(f"WebSocket auth failed: {e}")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # 2. Connect
    await manager.connect(websocket, session_id)
    logger.info(f"WebSocket connected for session {session_id}")

    try:
        while True:
            # Receive text from client
            data = await websocket.receive_text()
            
            # Start streaming response
            await websocket.send_json({"type": "status", "content": "agent_typing"})
            
            async for chunk in chat_service.stream_chat(data, session_id, user, db):
                await websocket.send_json({"type": "token", "content": chunk})
            
            await websocket.send_json({"type": "status", "content": "done"})

    except WebSocketDisconnect:
        manager.disconnect(session_id)
        logger.info(f"WebSocket disconnected for session {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(session_id)
