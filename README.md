# 🌾 AgroBrain AI: The Digital Backbone for Bharat's Farmers 🤖

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**AgroBrain AI** is a premium, production-grade intelligence ecosystem designed to revolutionize Indian agriculture. By fusing satellite data, soil matrix analysis, and neural-network-driven expert systems, we provide farmers with actionable intelligence to maximize yield and minimize risk.

---

## ✨ Features: The "Living Laboratory" Experience

### 🌍 1. Hyperlocal Intelligence Hub
- **Satellite Weather**: Real-time precipitation, humidity, and UV tracking with sub-meter coordinate precision.
- **Neural Forecaster**: AI-driven 7-day outlooks optimized for field operations (irrigation, harvest, spray).

### 🌱 2. Precision Crop Recommendation
- **Soil Matrix Engine**: Input Nitrogen (N), Phosphorus (P), Potassium (K), pH, and Moisture levels.
- **Expert matching**: Instant recommendations for the highest-yield crops based on specialized soil chemistry.

### 📈 3. Market Intelligence Portal
- **Mandi Price Tracking**: Stay updated with real-time crop price fluctuations across Indian markets.
- **Trend Prediction**: Identify the best time to sell based on seasonal intelligence.

### 🎙️ 4. Neural Voice & Multilingual AI
- **Hands-Free Operation**: Optimized neural voice assistant for field use.
- **Agri-Expert Chat**: AI Agronomist support in **Hindi, English, Punjabi, Marathi**, and 8+ regional languages.

### 🔒 5. Institutional-Grade Security
- **Biometric-Ready Auth**: Secure registration and login flows.
- **Data Sovereignty**: Encrypted field intelligence data solely for farmer benefit.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) | High-performance, SEO-optimized UI |
| **Styling** | Tailwind CSS & Framer Motion | Premium "Living Laboratory" aesthetic |
| **Backend** | FastAPI & Pydantic V2 | Async, high-throughput Python API |
| **Database** | MongoDB & Redis | Scalable storage with low-latency caching |
| **AI/ML** | OpenAI GPT-4o & Scikit-learn | Neural logic and predictive modeling |
| **Real-time** | WebSockets | Live chat and data streaming |

---

## 📂 Project Structure

```text
├── frontend/              # Next.js 15 Premium UI
│   ├── app/               # Page routes (Dashboard, Market, Weather, etc.)
│   ├── components/        # Radix UI + Custom Glassmorphic components
│   └── lib/               # API clients and shared utilities
├── backend/               # FastAPI Microservices
│   ├── app/               # Core logic (AI, Weather, Crops)
│   ├── models/            # Pydantic schemas and database models
│   └── scripts/           # Data seeding and setup tools
└── docs/                  # Detailed architecture and API guides
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB instance (Atlas or Local)
- Redis server

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
./venv/Scripts/activate # On Windows
pip install -r requirements.txt
python main.py
```

---

## 📖 Related Documentation
- [🏗️ System Architecture](docs/architecture.md)
- [📡 API Documentation](docs/api.md)
- [🚢 Deployment Guide](docs/deployment.md)

---

## 📄 License
This project is licensed under the **MIT License**.

Built with ❤️ for the backbone of Bharat.
