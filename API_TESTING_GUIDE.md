# 🧪 AgroBrain AI - API Testing Guide

## 📋 Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [Environment Variables](#environment-variables)
3. [Authentication Flow](#authentication-flow)
4. [API Endpoints](#api-endpoints)
5. [Test Users](#test-users)
6. [Postman Setup](#postman-setup)
7. [Manual Testing](#manual-testing)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js installed
- Backend server running on `http://localhost:8000`
- Postman Desktop App (recommended)

### Start Backend Server
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### Verify Server is Running
Open `http://localhost:8000/health` in browser or Postman:
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

## 🔧 Environment Variables

### For Postman
Create environment variables in Postman:

| Variable | Value | Description |
|----------|-------|-------------|
| `BASE_URL` | `http://localhost:8000/api/v1` | API Base URL |
| `ACCESS_TOKEN` | *auto-generated* | JWT Access Token |
| `REFRESH_TOKEN` | *auto-generated* | JWT Refresh Token |

---

## 🔐 Authentication Flow

### 1. Register New User
```http
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "TestPass123!",
  "name": "Test User",
  "role": "farmer",
  "language": "hi"
}
```

### 2. Login User
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "64f8a9b8c9d4a2b8e8f8c9d4",
    "username": "testuser",
    "email": "test@example.com",
    "name": "Test User",
    "role": "farmer",
    "is_verified": true,
    "is_active": true,
    "language": "hi",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Access Protected Endpoints
```http
GET {{BASE_URL}}/auth/me
Authorization: Bearer {{ACCESS_TOKEN}}
```

---

## 📡 API Endpoints

### 🔑 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/refresh` | Refresh access token | ❌ |
| POST | `/auth/logout` | User logout | ✅ |
| GET | `/auth/me` | Get current user profile | ✅ |
| PATCH | `/auth/profile` | Update user profile | ✅ |
| POST | `/auth/change-password` | Change password | ✅ |
| GET | `/auth/check-username` | Check username availability | ❌ |
| GET | `/auth/check-email` | Check email availability | ❌ |

### 👤 User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/users` | List all users (admin only) | ✅ |
| GET | `/users/{id}` | Get user by ID | ✅ |
| PATCH | `/users/{id}` | Update user (admin/self) | ✅ |
| DELETE | `/users/{id}` | Delete user (admin only) | ✅ |

### 🌤️ Weather Services

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/weather/current` | Get current weather | ✅ |
| GET | `/weather/forecast` | Get weather forecast | ✅ |
| POST | `/weather/log` | Log weather data | ✅ |

### 🌾 Crop Recommendations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/recommend/crops` | Get crop recommendations | ✅ |
| GET | `/recommend/history` | Get recommendation history | ✅ |
| GET | `/recommend/{id}` | Get specific recommendation | ✅ |

### 💬 Chat Services

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/chat/start` | Start new chat session | ✅ |
| POST | `/chat/message` | Send message | ✅ |
| GET | `/chat/sessions` | Get chat sessions | ✅ |
| GET | `/chat/sessions/{id}` | Get chat session details | ✅ |
| DELETE | `/chat/sessions/{id}` | Delete chat session | ✅ |

### 🎤 Voice Services

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/voice/speech-to-text` | Convert speech to text | ✅ |
| POST | `/voice/text-to-speech` | Convert text to speech | ✅ |
| POST | `/voice/command` | Process voice command | ✅ |

---

## 👥 Test Users

### Pre-created Users for Testing

| Role | Email | Password | Username | User ID |
|------|-------|----------|----------|---------|
| Admin | `admin@test.com` | `Admin123!` | `testadmin` | `69dde42085834dbba3be0192` |
| Farmer | `farmer@test.com` | `Farmer123!` | `testfarmer` | `69dde42685834dbba3be0193` |
| Agronomist | `agronomist@test.com` | `Agronomist123!` | `testagronomist` | `69dde42b85834dbba3be0194` |

### Quick Login Test
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "Admin123!"
}
```

---

## 📮 Postman Setup

### 1. Import Collection
1. Open Postman
2. Click "Import" → "File"
3. Select `backend/postman_collection.json`
4. Choose "Create new environment"

### 2. Set Environment Variables
1. Go to "Environments" tab
2. Create new environment called "AgroBrain AI"
3. Add variables:
   ```
   BASE_URL: http://localhost:8000/api/v1
   ACCESS_TOKEN: (leave empty - will be auto-filled)
   REFRESH_TOKEN: (leave empty - will be auto-filled)
   ```

### 3. Configure Authentication Tests
The collection includes automatic token management. After login:
- `ACCESS_TOKEN` and `REFRESH_TOKEN` are automatically set
- All subsequent requests use the token automatically

### 4. Test Authentication Flow
1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login` (sets tokens automatically)
3. **Get Profile**: `GET /auth/me` (uses token)
4. **Logout**: `POST /auth/logout` (clears tokens)

---

## 🧪 Manual Testing (cURL Examples)

### Register User
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@test.com",
    "password": "NewUser123!",
    "name": "New User",
    "role": "farmer",
    "language": "hi"
  }'
```

### Login User
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "NewUser123!"
  }'
```

### Get User Profile (with token)
```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Refresh Token
```bash
curl -X POST "http://localhost:8000/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

---

## 🔍 Testing Scenarios

### ✅ Positive Test Cases

1. **User Registration**
   - Valid email, password, username
   - All roles (farmer, agronomist, admin)
   - Optional fields (phone, language)

2. **User Login**
   - Correct credentials
   - Case-insensitive email
   - All user roles

3. **Token Management**
   - Access token generation
   - Token refresh
   - Token validation

4. **Profile Management**
   - Get current user
   - Update profile
   - Change password

### ❌ Negative Test Cases

1. **Registration Errors**
   - Duplicate email
   - Duplicate username
   - Weak password
   - Invalid email format
   - Invalid role

2. **Login Errors**
   - Wrong password
   - Non-existent email
   - Inactive account
   - Banned account

3. **Authorization Errors**
   - Access without token
   - Invalid token
   - Expired token
   - Insufficient permissions

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. "Login failed" Error
**Cause**: Frontend error handling issue
**Solution**: Check backend response format, ensure proper error parsing

#### 2. "401 Unauthorized" 
**Cause**: Missing or invalid token
**Solution**: 
- Check if `ACCESS_TOKEN` is set in environment
- Verify token format: `Bearer <token>`
- Try refreshing token

#### 3. "403 Forbidden"
**Cause**: Insufficient permissions
**Solution**: Check user role and endpoint permissions

#### 4. "422 Validation Error"
**Cause**: Invalid request data
**Solution**: Check request body format and required fields

#### 5. "Connection Refused"
**Cause**: Backend server not running
**Solution**: Start backend server on port 8000

#### 6. "Database Connection Failed"
**Cause**: MongoDB/Redis connection issues
**Solution**: Check environment variables and network connection

### Debug Tips

1. **Check Backend Logs**: Look at console output for detailed errors
2. **Use Browser DevTools**: Network tab shows request/response details
3. **Test with cURL**: Eliminate Postman-specific issues
4. **Verify Environment**: Ensure all variables are correctly set
5. **Check Token Expiry**: Tokens expire after 1 hour

---

## 📞 Support

If you encounter issues:

1. Check the backend console for error messages
2. Verify all prerequisites are met
3. Test with the provided examples
4. Check this troubleshooting guide
5. Review the API documentation at `http://localhost:8000/docs`

---

## 🎯 Quick Start Checklist

- [ ] Backend server running on port 8000
- [ ] Database and Redis connected
- [ ] Postman environment configured
- [ ] Test users created
- [ ] Authentication flow working
- [ ] All endpoints responding correctly

**Happy Testing! 🚀**
