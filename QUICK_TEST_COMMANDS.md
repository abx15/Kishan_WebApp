# ⚡ Quick API Testing Commands

## 🚀 One-Click Testing

### Backend Server Status Check
```bash
curl http://localhost:8000/health
```

### Quick Login Tests

#### Admin Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'
```

#### Farmer Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"farmer@test.com","password":"Farmer123!"}'
```

#### Agronomist Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"agronomist@test.com","password":"Agronomist123!"}'
```

### Quick Registration Test
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username":"quicktest",
    "email":"quicktest@example.com",
    "password":"QuickTest123!",
    "name":"Quick Test User",
    "role":"farmer",
    "language":"hi"
  }'
```

### Get User Profile (Replace TOKEN)
```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Test Token Refresh (Replace TOKEN)
```bash
curl -X POST "http://localhost:8000/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"YOUR_REFRESH_TOKEN_HERE"}'
```

---

## 🔧 PowerShell Testing Commands

### Admin Login (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@test.com","password":"Admin123!"}'
```

### Farmer Login (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"farmer@test.com","password":"Farmer123!"}'
```

### Registration (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/register" -Method POST -ContentType "application/json" -Body '{"username":"pptest","email":"pptest@example.com","password":"PowerShell123!","name":"PowerShell Test","role":"farmer","language":"hi"}'
```

---

## 🌐 Browser Testing URLs

Open these directly in your browser:

### Health Check
```
http://localhost:8000/health
```

### API Documentation
```
http://localhost:8000/docs
```

### ReDoc Documentation
```
http://localhost:8000/redoc
```

---

## 📱 Test Results Expected

### Successful Login Response
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "69dde42085834dbba3be0192",
    "username": "testadmin",
    "email": "admin@test.com",
    "name": "Test Admin",
    "role": "admin",
    "is_verified": true,
    "is_active": true,
    "language": "hi"
  }
}
```

### Successful Registration Response
```json
{
  "success": true,
  "message": "Account created successfully!",
  "data": {
    "user_id": "64f8a9b8c9d4a2b8e8f8c9d4",
    "email": "newuser@test.com",
    "message": "Registration successful! You can now login."
  }
}
```

### Health Check Response
```json
{
  "status": "healthy",
  "app": "AgroBrain AI",
  "version": "1.0.0",
  "database": "connected",
  "cache": "connected",
  "debug": true
}
```

---

## 🚨 Error Responses to Test

### Invalid Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@test.com","password":"wrong123!"}'
```
**Expected**: `{"detail":"Invalid email or password"}`

### Duplicate Registration
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testadmin","email":"admin@test.com","password":"Test123!","name":"Duplicate Test","role":"farmer"}'
```
**Expected**: `{"detail":"This email is already registered. Please login."}`

### Access Without Token
```bash
curl -X GET "http://localhost:8000/api/v1/auth/me"
```
**Expected**: `{"detail":"Authentication required"}`

---

## 🎯 Quick Validation Checklist

- [ ] Server responds to health check
- [ ] Admin login works
- [ ] Farmer login works  
- [ ] Agronomist login works
- [ ] Registration creates new users
- [ ] Token authentication works
- [ ] Error responses are proper

**Run these commands to verify everything is working! 🚀**
