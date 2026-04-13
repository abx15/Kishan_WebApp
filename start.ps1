# AgroBrain AI - Windows Startup Script (PowerShell)
Write-Host "🚀 Starting AgroBrain AI Services..." -ForegroundColor Green

# Start Backend in a new window
Write-Host "Starting Backend on http://localhost:8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd agrobrain-backend; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"

# Start Frontend in a new window
Write-Host "Starting Frontend on http://localhost:3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd agrobrain-frontend; npm run dev"

Write-Host "✨ All services are launching! Check the new windows for logs." -ForegroundColor Green
Write-Host "Backend API: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "Frontend Dashboard: http://localhost:3000" -ForegroundColor Gray
