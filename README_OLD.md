# 🌾 AgroBrain AI: The Digital Backbone for Bharat's Farmers 🤖

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)

**AgroBrain AI** is a state-of-the-art, production-grade intelligence ecosystem designed to revolutionize Indian agriculture. By fusing satellite telemetry, soil matrix analysis, and neural-network-driven expert systems, we provide farmers with actionable intelligence to maximize yield, minimize resource waste, and mitigate market risks.

---

## 🏛️ System Architecture: The "Bharat Stack" for Agriculture

AgroBrain AI is built on a resilient, high-availability micro-services architecture designed to perform in low-connectivity rural environments.

### 🌐 Frontend (The Interface of Growth)
- **Engine**: Next.js 15 (App Router) for superior performance and SEO.
- **Design System**: "Living Laboratory" aesthetic—a custom glassmorphic UI using Tailwind CSS and Framer Motion for smooth, organic interactions.
- **State Management**: Lightweight and reactive state using Zustand.
- **Resilience**: Client-side caching and optimistic UI updates for seamless use in areas with fluctuating internet.

### ⚙️ Backend (The Neural Core)
- **Framework**: FastAPI (Asynchronous Python) utilizing Pydantic V2 for strict type safety.
- **ML Engine**: Scikit-learn powered predictive models for crop variety matching.
- **Task Orchestration**: APScheduler for automated background jobs (weather alerts, price syncing).
- **Security**: Rate-limiting via SlowAPI, secure JWT authentication with Firebase, and DNS-over-HTTPS fallbacks for database stability.

---

## 🚀 Specialized Modules

### 🌦️ 1. Weather Intelligence (Satellite-Driven)
*   **Precision**: Hyperlocal data based on sub-meter field coordinates.
*   **ML Triggers**: Automated irrigation recommendations based on evapotranspiration rates.
*   **Alert System**: Real-time pushes for extreme weather events (hail, frost, locust movement).

### 🌱 2. Crop Recommendation (Soil Matrix)
*   **Chemical Analysis**: Direct mapping of N-P-K (Nitrogen, Phosphorus, Potassium) and pH levels.
*   **Variety Matching**: Recommends specific crop varieties that maximize profit based on current soil health and climatic conditions.

### 💬 3. Multilingual AI Agronomist
*   **Neural NLP**: Context-aware conversational AI supporting **Hindi, English, Telugu, Tamil, Marathi, Punjabi**, and more.
*   **Voice-First**: Integrated neural TTS (Text-to-Speech) and STT (Speech-to-Text) for hands-free field use.

### 💰 4. Market Intelligence Portal
*   **Live Mandi Prices**: Aggregates real-time price data from major Indian agricultural markets.
*   **Profit Optimizer**: Predictive charts showing historical price trends to help farmers decide exactly *when* to sell.

---

## 🛠️ Tech Stack Deep-Dive

| Layer | Technologies | Role |
| :--- | :--- | :--- |
| **UI/UX** | Next.js 15, Tailwind CSS, Framer Motion, Lucide | Interaction & Visualization |
| **Logic** | FastAPI, TypeScript, Zustand | Routing & State Management |
| **Data** | MongoDB (Motor), Redis | Persistence & High-Speed Caching |
| **AI/ML** | OpenAI GPT-4o, Scikit-learn, LangChain | Reasoning & Predictions |
| **Infra** | Firebase Auth, GitHub Actions, Docker | Security & CI/CD |

---

## 📂 Navigation Map

```text
├── frontend/                # Next.js 15 Premium UI
│   ├── app/                 # Page routes (Dashboard, Market, Weather, etc.)
│   ├── components/          # Radix UI + Custom Glassmorphic components
│   │   ├── shared/          # Navigation, Sidebar, Theme Toggles
│   │   └── ui/              # Primitive UI Atom elements
│   └── lib/                 # API Clients, Utils, Constant Mappings
├── backend/                 # FastAPI Micro-services
│   ├── app/
│   │   ├── routes/          # API Endpoints (Auth, Weather, Chat, Admin)
│   │   ├── services/        # Business logic & 3rd-party integrations
│   │   ├── ml/              # Model loaders & predictors
│   │   └── core/            # Config, Logger, DB, Redis managers
│   └── scripts/             # Data seeding & setup tools
└── docs/                    # Integrated documentation hub
```

---

## 🚦 Installation & Deployment

### Environment Configuration
Create a `.env` file in the `backend/` and `frontend/` root:
```env
# Backend
DATABASE_URL=mongodb+srv://...
REDIS_URL=redis://...
OPENAI_API_KEY=sk-...
FIREBASE_CREDENTIALS_PATH=./firebase-key.json

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Quick Initiation
1. **Frontend**:
   ```bash
   cd frontend && npm install && npm run dev
   ```
2. **Backend**:
   ```bash
   cd backend && pip install -r requirements.txt && python main.py
   ```

---

## 📜 Roadmap
- [ ] Integration with IoT soil sensors for real-time monitoring.
- [ ] Image-based pest detection (AgroLens).
- [ ] Blockchain-based Mandi receipt verification.
- [ ] Offline-first Progressive Web App (PWA) optimization.

---

## 📄 License
Licensed under the **MIT License**.

Built for the future of Indian Agriculture. 🛰️🇮🇳
