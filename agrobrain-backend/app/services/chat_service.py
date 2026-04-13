"""
Chat service for AgroBrain AI backend.

Handles AI-powered conversations, session management, language detection,
and integration with weather and farm context.
"""

import time
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional, AsyncGenerator, Tuple

import openai
from openai import AsyncOpenAI, RateLimitError
from bson import ObjectId
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type
)

from app.core.config import settings
from app.core.logger import logger
from app.core.database import get_database
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse, MessageResponse


class ChatService:
    """Service to manage AI chat conversations."""

    SYSTEM_PROMPT = """
You are AgroBrain, an expert AI agricultural advisor for Indian farmers.
You have deep knowledge of:
- Indian crops: wheat, rice, sugarcane, cotton, maize, pulses, vegetables
- Indian seasons: Kharif (Jun-Nov), Rabi (Nov-Apr), Zaid (Apr-Jun)
- Soil types across India, fertilizer brands available in India
- Government schemes: PM-KISAN, Pradhan Mantri Fasal Bima Yojana, Soil Health Card
- Water management, pest control, organic farming

Context: {context}
Current Weather: {weather}
User's Farm: {farm_profile}

Rules:
1. Always respond in the same language as the user's message.
2. If Hindi detected -> respond in simple Hindi (not too formal).
3. Be practical — give actionable advice, not generic.
4. For medical/legal/financial advice -> redirect to official sources.
5. Keep responses under 200 words unless farmer asks for detail.
6. Use Indian units: bigha, acre, quintal, kg/bigha.
"""

    def __init__(self):
        """Initialize ChatService with OpenAI client."""
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.logger = logger.bind(service="chat")

    async def get_or_create_session(self, user_id: str, db, session_id: Optional[str] = None) -> ChatSession:
        """Fetch existing session or create a new one with timeout and message limit check."""
        if session_id:
            doc = await db.chat_sessions.find_one({"session_id": session_id, "user_id": user_id})
            if doc:
                session = ChatSession.from_dict(doc)
                
                # Check for 45-min inactivity timeout
                if session.is_expired(timeout_minutes=45):
                    self.logger.info(f"Session {session_id} expired, archiving")
                    await db.chat_sessions.update_one(
                        {"session_id": session_id},
                        {"$set": {"session.is_active": False, "session.ended_at": datetime.utcnow()}}
                    )
                # Check for 100 message limit rule
                elif len(session.messages) >= 100:
                    self.logger.info(f"Session {session_id} full (>100 msgs), creating pivot")
                    new_session = ChatSession(user_id=user_id, prev_session_id=session_id)
                    # Archive old session
                    await db.chat_sessions.update_one(
                        {"session_id": session_id},
                        {"$set": {"session.is_active": False, "session.ended_at": datetime.utcnow()}}
                    )
                    await db.chat_sessions.insert_one(new_session.to_dict())
                    return new_session
                else:
                    return session

        # Create new session
        new_session = ChatSession(user_id=user_id)
        await db.chat_sessions.insert_one(new_session.to_dict())
        return new_session

    async def get_conversation_history(self, session: ChatSession, limit: int = 10) -> List[Dict[str, str]]:
        """Format last N messages for OpenAI context window (Max 10)."""
        history = []
        recent_msgs = session.messages[-limit:] if session.messages else []
        for msg in recent_msgs:
            history.append({"role": msg.role, "content": msg.content})
        return history

    def detect_language(self, text: str) -> str:
        """
        Detect if text is Hindi or English based on Devanagari Unicode range.
        Rule: If > 20% Devanagari chars -> "hi", else "en".
        """
        if not text:
            return "en"
        
        devanagari_count = 0
        total_chars = 0
        
        for char in text:
            if char.isspace():
                continue
            total_chars += 1
            if '\u0900' <= char <= '\u097F':
                devanagari_count += 1
        
        if total_chars > 0 and (devanagari_count / total_chars) >= 0.20:
            return "hi"
        return "en"

    def is_abusive(self, text: str) -> bool:
        """Simple check for Irrelevant or Abusive content."""
        abusive_keywords = ["गाली", "abuse", "fraud", "scam", "stupid", "idiot"] # Placeholder
        return any(kw in text.lower() for kw in abusive_keywords)

    async def build_context_string(self, user: Dict[str, Any], weather_data: Optional[Dict[str, Any]] = None) -> str:
        """Construct a concise context string for the AI prompt."""
        farm = user.get("farm_profile", {})
        loc = user.get("default_location", {})
        
        context_parts = []
        if loc:
            context_parts.append(f"Location: {loc.get('village', 'Unknown')}, {loc.get('state', 'India')}")
        
        crop_list = farm.get("primary_crops", [])
        if crop_list:
            context_parts.append(f"Primary Crops: {', '.join(crop_list)}")
            
        soil = farm.get("soil_type")
        if soil:
            context_parts.append(f"Soil Type: {soil}")

        weather_str = "Unknown"
        if weather_data and "current" in weather_data:
            curr = weather_data["current"]
            weather_str = f"{curr.get('temp_c')}°C, {curr.get('condition')}, Humidity: {curr.get('humidity_pct')}%"


    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(min=1, max=10),
        retry=retry_if_exception_type(RateLimitError)
    )
    async def _call_openai(self, messages: List[Dict[str, str]]) -> Tuple[str, int]:
        """Call OpenAI API with retry logic."""
        response = await asyncio.wait_for(
            self.client.chat.completions.create(
                model=settings.openai_model,
                messages=messages,
                max_tokens=400,
                temperature=0.7
            ),
            timeout=25.0
        )
        return response.choices[0].message.content, response.usage.total_tokens

    async def send_message(self, request: ChatRequest, current_user: Dict[str, Any], db, redis) -> ChatResponse:
        """Standard REST endpoint for chat messages (no streaming)."""
        start_time = time.time()
        user_id = str(current_user["_id"])
        
        # 1. Get/Create session
        session = await self.get_or_create_session(user_id, db, request.session_id)
        
        # 2. Detect Language
        lang = request.language if request.language != "auto" else self.detect_language(request.message)
        
        # 3. Check for abusive content
        if self.is_abusive(request.message):
            return ChatResponse(
                session_id=session.session_id,
                user_message=MessageResponse(msg_id="err", role="user", content=request.message, language=lang, timestamp=datetime.utcnow()),
                ai_response=MessageResponse(
                    msg_id="err_res", 
                    role="assistant", 
                    content="Maaf kijiye, main keval kheti se jude sawalon ke jawab de sakta hoon. Please ask about farming." if lang == "hi" else "Sorry, I can only answer agricultural queries. Please stay on topic.",
                    language=lang,
                    timestamp=datetime.utcnow()
                )
            )

        # 4. Build Context
        # Try to get weather from Redis (cached by weather service)
        from app.services.weather_service import weather_service
        lat = request.context.get("lat") if request.context else None
        lng = request.context.get("lng") if request.context else None
        
        weather_info = None
        if lat and lng:
            try:
                weather_info = await weather_service.fetch_current_weather(lat, lng, user_id)
            except:
                 pass
        
        ctx_str, weather_str, farm_str = await self.build_context_string(current_user, weather_info.dict() if weather_info else None)
        
        # 4. Prepare OpenAI messages
        history = await self.get_conversation_history(session)
        system_content = self.SYSTEM_PROMPT.format(
            context=ctx_str,
            weather=weather_str,
            farm_profile=farm_str
        )
        
        messages = [{"role": "system", "content": system_content}]
        messages.extend(history)
        messages.append({"role": "user", "content": request.message})
        
        # 5. Call OpenAI with tenacity retries
        try:
            ai_content, tokens = await self._call_openai(messages)
        except RateLimitError:
            self.logger.error("OpenAI rate limit hit after retries")
            raise HTTPException(status_code=429, detail="AI service is currently busy. Please try again in a few minutes.")
        except asyncio.TimeoutError:
            self.logger.error("OpenAI request timed out")
            raise HTTPException(status_code=504, detail="AI Assistant taking too long to respond.")
        except Exception as e:
            self.logger.error(f"OpenAI chat call failed: {e}")
            raise

        # 6. Save messages
        user_msg = ChatMessage(role="user", content=request.message, language_detected=lang)
        ai_msg = ChatMessage(
            role="assistant", 
            content=ai_content, 
            model_used=settings.openai_model,
            tokens_used=tokens,
            response_time_ms=int((time.time() - start_time) * 1000)
        )
        
        session.add_message(user_msg)
        session.add_message(ai_msg)
        
        await db.chat_sessions.update_one(
            {"session_id": session.session_id},
            {"$set": session.to_dict()}
        )
        
        return ChatResponse(
            session_id=session.session_id,
            user_message=MessageResponse(
                msg_id=user_msg.msg_id,
                role=user_msg.role,
                content=user_msg.content,
                language=lang,
                timestamp=user_msg.timestamp
            ),
            ai_response=MessageResponse(
                msg_id=ai_msg.msg_id,
                role=ai_msg.role,
                content=ai_msg.content,
                language=lang,
                timestamp=ai_msg.timestamp
            ),
            tokens_used=tokens,
            response_time_ms=ai_msg.response_time_ms
        )

    async def stream_chat(
        self, 
        message: str, 
        session_id: str, 
        current_user: Dict[str, Any], 
        db
    ) -> AsyncGenerator[str, None]:
        """WebSocket-capable streaming chat."""
        user_id = str(current_user["_id"])
        session = await self.get_or_create_session(user_id, db, session_id)
        
        lang = self.detect_language(message)
        ctx_str, weather_str, farm_str = await self.build_context_string(current_user)
        history = await self.get_conversation_history(session)
        
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT.format(context=ctx_str, weather=weather_str, farm_profile=farm_str)},
            *history,
            {"role": "user", "content": message}
        ]
        
        # Save user message first
        user_msg = ChatMessage(role="user", content=message, language_detected=lang)
        session.add_message(user_msg)
        await db.chat_sessions.update_one({"session_id": session.session_id}, {"$set": session.to_dict()})

        full_response = []
        try:
            stream = await self.client.chat.completions.create(
                model=settings.openai_model,
                messages=messages,
                max_tokens=400,
                temperature=0.7,
                stream=True
            )
            
            async for chunk in stream:
                content = chunk.choices[0].delta.content or ""
                if content:
                    full_response.append(content)
                    yield content
            
            # Save complete AI response
            ai_content = "".join(full_response)
            ai_msg = ChatMessage(
                role="assistant", 
                content=ai_content, 
                model_used=settings.openai_model,
                timestamp=datetime.utcnow()
            )
            session.add_message(ai_msg)
            await db.chat_sessions.update_one({"session_id": session.session_id}, {"$set": session.to_dict()})
            
        except Exception as e:
            self.logger.error(f"Chat streaming failed: {e}")
            yield f"\n[Error: {str(e)}]"

    async def get_all_sessions(self, user_id: str, db, limit: int = 20) -> List[Dict[str, Any]]:
        """Get summarized list of user sessions."""
        cursor = db.chat_sessions.find({"user_id": user_id, "is_active": True}).sort("updated_at", -1).limit(limit)
        sessions = []
        async for doc in cursor:
            last_msg = doc["messages"][-1]["content"] if doc["messages"] else "New Session"
            sessions.append({
                "session_id": doc["session_id"],
                "last_message": last_msg[:50] + "...",
                "total_messages": doc["total_messages"],
                "updated_at": doc["updated_at"],
                "is_active": doc["is_active"]
            })
        return sessions


# Singleton instance
chat_service = ChatService()
