# AgroBrain AI - Deployment & Setup 🛠️

This guide covers local development setup and deployment instructions.

## 🛠️ Local Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB 6.0+
- Redis Server
- OpenAI API Key

### 2. Backend Setup
```bash
cd agrobrain-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env      # Configure your environment variables
```

**Key Environment Variables:**
- `MONGODB_URL`: Connection string for MongoDB.
- `REDIS_URL`: Connection string for Redis (e.g., `redis://localhost:6379`).
- `OPENAI_API_KEY`: Your OpenAI key.
- `FIREBASE_CREDENTIALS_PATH`: Path to your Firebase service account JSON.

### 3. Frontend Setup
```bash
cd agrobrain-frontend
npm install
cp .env.example .env.local
npm run dev
```

## 🐳 Docker Deployment

The platform is Docker-ready.

### 1. Building Containers
```bash
docker-compose build
```

### 2. Running the Stack
```bash
docker-compose up -d
```
This starts:
- **Backend API**: `localhost:8000`
- **Frontend App**: `localhost:3000`
- **MongoDB**: `localhost:27017`
- **Redis**: `localhost:6379`

## 🧪 Seeding Data

To bootstrap the database with sample crops, soil data, and tips:
```bash
cd agrobrain-backend
python scripts/seed_data.py
```

## 🚀 Production Optimization

- **Backend**: Uses `gunicorn` with `uvicorn` workers.
- **Frontend**: Next.js production build with automatic static optimization.
- **Caching**: Redis is utilized for weather alerts and daily tips with TTL logic.
