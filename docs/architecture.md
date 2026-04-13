# AgroBrain AI - Architecture & Design 🏗️

This document details the modernization and architectural decisions implemented in the AgroBrain AI platform.

## 1. System Overview

AgroBrain AI uses a micro-integrated architecture where a robust FastAPI backend orchestrates various services (Weather, ML, Chat, Voice) and serves a Next.js 15 frontend.

## 2. Backend Modernization

### Pydantic V2 Migration
The backend has been fully migrated to **Pydantic V2** to benefit from massive performance improvements and more robust validation.
- Replaced `class Config` with `model_config = ConfigDict(...)`.
- Updated validators to `field_validator`.
- Standardized schemas in the `app/schemas/` directory.

### Async/Await Integrity
Strict adherence to asynchronous patterns:
- All MongoDB calls use `await` with the `Motor` driver.
- Redis operations are fully asynchronous.
- External API calls use `httpx.AsyncClient`.

### Resilience & Fallbacks
We've implemented a "Degrade Gracefully" strategy:
- **Redis Fallback**: If Redis service is unavailable, the application bypasses caching without crashing.
- **ML Model Fallback**: If the `CropPredictor` model fails to load or predict, the system falls back to a heuristic engine based on historical metadata.
- **Tenacity Retries**: All external API calls (OpenAI, WeatherAPI) are wrapped in `tenacity` retry logic with exponential backoff.

## 3. Frontend Modernization (Next.js 15)

### API Resilience
The Axios client in `agrobrain-frontend/lib/api.ts` has been enhanced:
- **Increased Timeouts**: Standard 15s timeout, with 45s for intensive AI/ML operations.
- **Specialized Error Handling**: Automatic handling of `429` (Rate Limited) and `500` errors.
- **State Hydration**: Improved use of TanStack Query for data fetching and caching.

### UI Enhancements
- Modernized components with better loading states (Skeletons).
- Seamless integration of real-time data into Dashboard cards.

## 4. Service Logic Details

### Recommendation Engine
- **Crop Prediction**: Uses a Random Forest ML model trained on Indian soil data.
- **Daily Tips**: Uses OpenAI to generate localized, seasonal farming advice, cached in Redis.

### Chat & Voice
- Real-time streaming using WebSockets.
- Voice query transformation using keyword-based intent routing.

## 5. Security

- **Auth**: Firebase Auth integration with JWT-based session management.
- **Dev Mode**: A specialized OTP fallback (`123456`) is available for authorized phone numbers during development to bypass SMS latency.
