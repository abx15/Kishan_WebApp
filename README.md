# AgroBrain AI - Smart Farming Platform 🌾🤖

AgroBrain AI is a production-grade, full-stack ecosystem designed to empower Indian farmers with real-time AI agricultural advice, weather predictions, and soil-specific crop recommendations.

## 🚀 Key Features

- **AI Agronomist**: Context-aware chat and voice assistant supporting English and Hindi.
- **Smart Weather**: Multi-layer weather analysis with ML-based irrigation planning and safety alerts.
- **Crop Intelligence**: Scientific crop recommendations based on soil parameters (N, P, K, pH, Moisture).
- **Voice-First Design**: Optimized for hands-free operation in the field.
- **Resilient Architecture**: Robust service-level fallbacks and Redis caching for high availability.

## 🏗️ Modernized Architecture

The platform has been modernized to ensure production-grade stability:

- **Backend**: FastAPI with Pydantic V2, Motor (Async MongoDB), and Tenacity-based retry logic.
- **Frontend**: Next.js 15 (App Router) with TanStack Query and specialized API resilience.
- **Reliability**:
  - **Redis Fallback**: Graceful degradation when Redis is offline.
  - **ML Reliability**: Model pre-loading and error handling with heuristic fallbacks.
  - **Firebase Dev Mode**: Secure OTP fallback (`123456`) for rapid development.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TailwindCSS, TypeScript, Zustand, Framer Motion.
- **Backend**: FastAPI, OpenAI (GPT-4o), MongoDB, Redis, APScheduler.
- **Infrastructure**: Docker, GitHub Actions, Firebase Auth.

## 📂 Project Structure

```text
├── agrobrain-backend/     # FastAPI Modernized Backend
│   ├── app/               # Core application logic
│   ├── scripts/           # Setup and seed scripts
│   └── tests/             # Integration and Unit tests
├── agrobrain-frontend/    # Next.js 15 Modernized Frontend
│   ├── app/               # App Router pages
│   ├── components/        # UI and Feature components
│   └── lib/               # Shared utilities and API client
└── docs/                  # Detailed documentation
```

## 🚦 Getting Started

Detailed instructions for local setup and deployment can be found in:
- [Local Setup & Deployment](docs/deployment.md)
- [Architecture & Design](docs/architecture.md)
- [API Reference](docs/api.md)

## 📄 License

This project is licensed under the MIT License.
