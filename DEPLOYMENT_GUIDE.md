# AgroBrain AI - Complete Deployment Guide

## Status: Servers Running Successfully! 

- **Backend**: Running on http://localhost:8000
- **Frontend**: Running on http://localhost:3000
- **API Docs**: Available at http://localhost:8000/docs

---

## 1. Local Development Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- MongoDB 4.4+
- Redis 6.0+

### Quick Start Commands

#### Option 1: Using PowerShell Script (Windows)
```powershell
.\start.ps1
```

#### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

#### Option 3: Using Python Scripts
```bash
# Start both services
python start_all.py

# Or start individually
python start_backend.py --seed
python start_frontend.py
```

---

## 2. Render Deployment (Backend + Database)

### Backend Deployment on Render

#### Step 1: Prepare Backend
```bash
# Ensure backend has requirements.txt
cd backend
pip freeze > requirements.txt
```

#### Step 2: Create `render.yaml`
```yaml
services:
  - type: web
    name: agrobrain-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.9
      - key: MONGODB_URL
        fromDatabase:
          name: agrobrain-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          type: redis
          name: agrobrain-redis
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: FRONTEND_URL
        value: https://your-frontend-app.onrender.com

databases:
  - name: agrobrain-db
    databaseName: agrobrain
    user: agrobrain

services:
  - type: redis
    name: agrobrain-redis
    ipAllowList: []
```

#### Step 3: Environment Variables on Render
Go to your Render service dashboard and add these environment variables:

```env
# Required
MONGODB_URL=mongodb://user:pass@host:port/database
REDIS_URL=redis://user:pass@host:port
SECRET_KEY=your-super-secret-key-here
FRONTEND_URL=https://your-frontend-app.onrender.com

# Optional but Recommended
GOOGLE_CLIENT_ID=your-google-client-id
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
OPENAI_API_KEY=sk-your-openai-key
OPENWEATHER_API_KEY=your-weather-api-key

# Production Settings
DEBUG=False
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30
```

#### Step 4: Deploy to Render
1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Render will automatically detect and deploy your backend

---

## 3. Vercel Deployment (Frontend)

### Frontend Deployment on Vercel

#### Step 1: Configure Frontend for Production
Create `vercel.json` in frontend directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@backend-url"
  }
}
```

#### Step 2: Update `.env.local` for Production
```env
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
NEXT_PUBLIC_APP_NAME=AgroBrain AI
```

#### Step 3: Deploy to Vercel
1. Push your code to GitHub
2. Go to Vercel dashboard
3. Import your GitHub repository
4. Vercel will automatically detect Next.js
5. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL
6. Deploy!

---

## 4. Complete Deployment Workflow

### Pre-deployment Checklist

#### Backend Preparation
- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] Redis connection tested
- [ ] API endpoints working locally
- [ ] CORS configured for frontend URL

#### Frontend Preparation  
- [ ] Environment variables set
- [ ] API calls pointing to production backend
- [ ] Build process tested (`npm run build`)
- [ ] Responsive design checked

### Deployment Steps

#### 1. Deploy Backend First
```bash
# Commit and push backend changes
git add .
git commit -m "Deploy backend to production"
git push origin main
```

#### 2. Deploy Frontend
```bash
# Commit and push frontend changes
git add .
git commit -m "Deploy frontend to production" 
git push origin main
```

#### 3. Post-deployment Testing
- [ ] Backend health check: `https://your-backend.onrender.com/health`
- [ ] API docs accessible: `https://your-backend.onrender.com/docs`
- [ ] Frontend loads: `https://your-frontend.vercel.app`
- [ ] Login functionality works
- [ ] All API calls successful

---

## 5. Production Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/agrobrain
REDIS_URL=redis://user:pass@redis-cluster:6379

# Security
SECRET_KEY=your-production-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# Frontend URL
FRONTEND_URL=https://your-frontend.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Email Service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=your-sendgrid-username
SMTP_PASS=your-sendgrid-password
FROM_EMAIL=noreply@agrobrain.ai
FROM_NAME=AgroBrain AI

# External APIs
OPENAI_API_KEY=sk-production-openai-key
OPENWEATHER_API_KEY=production-weather-api-key

# Production Settings
DEBUG=False
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_APP_NAME=AgroBrain AI
```

---

## 6. Monitoring and Maintenance

### Health Checks
```bash
# Backend health
curl https://your-backend.onrender.com/health

# Frontend status
curl https://your-frontend.vercel.app
```

### Log Monitoring
- **Render**: Check service logs in dashboard
- **Vercel**: Check function logs in dashboard
- **Database**: Monitor MongoDB Atlas metrics
- **Redis**: Monitor Redis performance

### Backup Strategy
- **MongoDB**: Enable automated backups in Atlas
- **Redis**: Use Redis persistence if needed
- **Code**: Keep GitHub repository updated

---

## 7. Troubleshooting

### Common Issues

#### Backend Deployment Issues
1. **Port binding**: Use `$PORT` environment variable
2. **Database connection**: Check MongoDB URL format
3. **CORS errors**: Verify `FRONTEND_URL` is correct
4. **Missing dependencies**: Ensure `requirements.txt` is complete

#### Frontend Deployment Issues
1. **API calls failing**: Check `NEXT_PUBLIC_API_URL`
2. **Build errors**: Run `npm run build` locally first
3. **Environment variables**: Ensure they start with `NEXT_PUBLIC_`

### Debug Commands
```bash
# Check backend logs (Render)
render logs agrobrain-backend

# Check frontend build (Vercel)
vercel logs

# Test API endpoints
curl -X GET "https://your-backend.onrender.com/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 8. Security Best Practices

### Backend Security
- Use strong `SECRET_KEY`
- Enable HTTPS only
- Implement rate limiting
- Validate all inputs
- Use environment variables for secrets

### Frontend Security  
- Validate API responses
- Implement proper error handling
- Use secure cookies for tokens
- Enable CSP headers

### Database Security
- Use MongoDB Atlas security features
- Implement proper user permissions
- Enable network access controls
- Regular security updates

---

## 9. Performance Optimization

### Backend Optimization
- Use Redis for caching
- Implement database indexes
- Enable compression
- Use connection pooling

### Frontend Optimization
- Enable Next.js optimizations
- Use static generation where possible
- Implement proper caching
- Optimize images and assets

---

## 10. Scaling Considerations

### When to Scale
- High CPU usage (>80%)
- Memory pressure
- Slow response times
- Database connection limits

### Scaling Options
- **Render**: Upgrade to higher tier
- **Database**: Scale MongoDB Atlas cluster
- **CDN**: Use Vercel's built-in CDN
- **Load Balancing**: Multiple backend instances

---

## Quick Deployment Commands

### One-Command Deployment (if configured)
```bash
# Deploy everything
./deploy.sh
```

### Manual Deployment
```bash
# Backend
git push origin main  # Triggers Render deployment

# Frontend  
vercel --prod        # Deploys to Vercel production
```

---

## Support

### Getting Help
- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Issues**: Create issue in repository
- **Email**: support@agrobrain.ai

### Emergency Contacts
- **Backend Issues**: Check Render dashboard
- **Frontend Issues**: Check Vercel dashboard
- **Database Issues**: Check MongoDB Atlas

---

**Ready to deploy! Your AgroBrain AI platform is now configured for production deployment on Render and Vercel.**
