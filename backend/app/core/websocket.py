"""
WebSocket Connection Manager for AgroBrain AI.

Handles active client connections and provides methods for sending 
JSON and text messages to specific users.
"""

from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    """Manages WebSocket connections and messaging."""

    def __init__(self):
        # active_connections[session_id] = WebSocket
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        """Unregister a WebSocket connection."""
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def send_personal_message(self, message: str, session_id: str):
        """Send a string message to a specific session."""
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_text(message)

    async def send_json(self, data: dict, session_id: str):
        """Send a JSON object to a specific session."""
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_json(data)


# Singleton instance
manager = ConnectionManager()
