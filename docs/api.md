# AgroBrain AI - API Documentation 📡

Base URL: `http://localhost:8000/api/v1`

## 🔐 Authentication

All routes except `/auth/login` and `/auth/verify-otp` require a `Authorization: Bearer <token>` header.

### `POST /auth/verify-otp`
Verify OTP and get tokens.
- **Request**: `{ "phone": "string", "otp_token": "string" }`
- **Response**: `{ "access_token": "...", "refresh_token": "...", "user": {...} }`

### `GET /auth/me`
Get current user profile.

---

## 🌾 Recommendations

### `POST /recommend/crop`
Get AI + ML powered crop recommendations.
- **Request**: `{ "N": 90, "P": 42, "K": 43, "temp": 20, "humidity": 82, "ph": 6.5, "rainfall": 202 }`
- **Response**: `{ "top_crop": "rice", "confidence": 0.95, "recommendations": [...] }`

### `GET /recommend/daily-tips`
Get seasonal farming tips.
- **Response**: `[ { "tip_en": "...", "tip_hi": "...", "category": "..." }, ... ]`

### `GET /recommend/history`
Get recommendation history.
- **Query Params**: `limit=10`

---

## ☁️ Weather

### `GET /weather/current`
Get current weather for coordinates.
- **Query Params**: `lat`, `lng`

### `GET /weather/forecast`
Get 7-day forecast.
- **Query Params**: `lat`, `lng`, `days=7`

---

## 💬 Chat & Voice

### `POST /chat/message`
Send message to AI assistant.
- **Request**: `{ "message": "...", "sessionId": "optional" }`

### `GET /chat/sessions`
Get list of chat sessions.

### `POST /voice/query`
Process text-from-voice query.
- **Request**: `{ "text": "...", "lat": "...", "lng": "..." }`
- **Response**: Mixed response with intent and relevant data (e.g., weather).

---

## 🔧 Voice Intents
Supported voice keywords (mapped to actions):
- **Weather**: "weather", "mausam", "rain", "baarish"
- **Crop**: "crop", "fasal", "suggest", "bee"
- **Soil**: "soil", "mitti", "khad"
