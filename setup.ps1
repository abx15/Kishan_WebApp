# AgroBrain AI - Windows Setup Script (PowerShell)
Write-Host "🌟 Starting AgroBrain AI Local Setup..." -ForegroundColor Green

# 1. Backend Setup
Write-Host "📦 Setting up Backend..." -ForegroundColor Cyan
cd agrobrain-backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Create .env if not exists
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..."
    Copy-Item .env.example .env
}

# Seed Data
Write-Host "🌱 Seeding Database..." -ForegroundColor Green
python scripts/seed_data.py
cd ..

# 2. Frontend Setup
Write-Host "⚛️ Setting up Frontend..." -ForegroundColor Cyan
cd agrobrain-frontend
npm install

# Create .env.local if not exists
if (-not (Test-Path .env.local)) {
    Write-Host "Creating .env.local file..."
    Copy-Item .env.example .env.local
}
cd ..

Write-Host "✅ Setup complete! Run .\start.ps1 to start the platform." -ForegroundColor Green
