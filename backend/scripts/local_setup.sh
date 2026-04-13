#!/bin/bash

# AgroBrain AI - Local Setup Script
echo "🌟 Starting AgroBrain AI Local Setup..."

# 1. Backend Setup
echo "📦 Setting up Backend..."
cd agrobrain-backend
python -m venv venv
source venv/bin/activate || source venv/Scripts/activate
pip install -r requirements.txt

# Create .env if not exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

# Seed Data
echo "🌱 Seeding Database..."
python scripts/seed_data.py
cd ..

# 2. Frontend Setup
echo "⚛️ Setting up Frontend..."
cd agrobrain-frontend
npm install

# Create .env.local if not exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
fi
cd ..

echo "✅ Setup complete! run ./scripts/start_dev.sh to start the platform."
