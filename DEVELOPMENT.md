# Development Environment Setup Guide

This guide will help you set up a complete development environment for AgroBrain AI.

## Prerequisites

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: Minimum 10GB free space
- **Internet**: Required for package installation and external APIs

### Required Software

#### 1. Python 3.8+
```bash
# Check Python version
python --version
python3 --version

# Install Python (if not installed)
# Windows: Download from python.org
# macOS: brew install python3
# Linux: sudo apt-get install python3 python3-pip
```

#### 2. Node.js 18+
```bash
# Check Node.js version
node --version
npm --version

# Install Node.js (if not installed)
# Windows: Download from nodejs.org
# macOS: brew install node
# Linux: 
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 3. MongoDB 4.4+
```bash
# Install MongoDB
# Windows: Download from mongodb.com
# macOS: brew tap mongodb/brew && brew install mongodb-community
# Linux: 
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 4. Redis 6.0+
```bash
# Install Redis
# Windows: Download from redis.io or use WSL
# macOS: brew install redis
# Linux: sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## IDE Setup

### Recommended IDEs

1. **Visual Studio Code** (Recommended)
2. **PyCharm Professional**
3. **WebStorm**

### VS Code Extensions

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.black-formatter",
    "ms-python.flake8",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "mongodb.mongodb-vscode",
    "humao.rest-client",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "files.exclude": {
    "**/__pycache__": true,
    "**/node_modules": true,
    "**/.git": true,
    "**/.DS_Store": true,
    "**/Thumbs.db": true
  }
}
```

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/agrobrain-ai.git
cd agrobrain-ai
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local file with your configuration
```

### 4. Database Setup

```bash
# Navigate to backend directory
cd ../backend

# Seed the database with sample data
python scripts/seed_data_comprehensive.py
```

## Environment Configuration

### Backend Environment Variables (.env)

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=agrobrain

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@agrobrain.ai
FROM_NAME=AgroBrain AI

# Frontend URL
FRONTEND_URL=http://localhost:3000

# External APIs
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4o
OPENWEATHER_API_KEY=your-openweather-api-key
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

# Firebase (Optional)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=500

# App Configuration
APP_NAME=AgroBrain AI
APP_VERSION=1.0.0
DEBUG=True
```

### Frontend Environment Variables (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AgroBrain AI

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Firebase (Optional)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key

# App Configuration
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Running the Application

### Option 1: Using Startup Scripts (Recommended)

```bash
# Start both frontend and backend
python start_all.py

# Start backend only
python start_backend.py

# Start frontend only
python start_frontend.py

# Seed database and start backend
python start_backend.py --seed
```

### Option 2: Manual Start

```bash
# Terminal 1: Start Backend
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

### Option 3: Using Docker (Advanced)

```bash
# Create docker-compose.yml
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Development Workflow

### 1. Code Style and Formatting

#### Python (Backend)
```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .

# Run tests
pytest tests/
```

#### TypeScript (Frontend)
```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check

# Run tests
npm run test
```

### 2. Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
```

### 3. Database Migrations

```bash
# Create new migration
python scripts/create_migration.py "migration_name"

# Run migrations
python scripts/migrate.py

# Rollback migration
python scripts/rollback.py "migration_name"
```

## Testing

### Backend Testing

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_auth.py::test_login
```

### Frontend Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### API Testing

Use the built-in API documentation:
- Open http://localhost:8000/docs
- Use the interactive Swagger UI to test endpoints

Or use curl/Postman:
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@agrobrain.ai", "password": "Admin@123"}'
```

## Debugging

### Backend Debugging

```bash
# Run with debugger
python -m pdb app/main.py

# Use VS Code debugger
# Set breakpoints in VS Code and use F5 to start debugging
```

### Frontend Debugging

```bash
# Run with debugging
npm run dev

# Use browser dev tools
# Chrome: F12 -> Sources tab
# Firefox: F12 -> Debugger tab
```

### Database Debugging

```bash
# Connect to MongoDB
mongo agrobrain

# View collections
show collections

# Query users
db.users.find().pretty()

# View indexes
db.users.getIndexes()
```

## Common Issues and Solutions

### 1. Port Conflicts

**Problem**: Port 8000 or 3000 already in use

**Solution**:
```bash
# Find process using port
# Windows:
netstat -ano | findstr :8000
# macOS/Linux:
lsof -i :8000

# Kill process
# Windows:
taskkill /PID <PID> /F
# macOS/Linux:
kill -9 <PID>

# Or use different ports
uvicorn app.main:app --port 8001
```

### 2. MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB

**Solution**:
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### 3. Redis Connection Issues

**Problem**: Cannot connect to Redis

**Solution**:
```bash
# Check Redis status
sudo systemctl status redis-server

# Start Redis
sudo systemctl start redis-server

# Test Redis connection
redis-cli ping
```

### 4. Environment Variable Issues

**Problem**: Missing or incorrect environment variables

**Solution**:
```bash
# Check if .env file exists
ls -la .env

# Verify .env file content
cat .env

# Restart services after changing .env
```

### 5. Dependency Issues

**Problem**: Package installation fails

**Solution**:
```bash
# Clear pip cache
pip cache purge

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# For frontend
rm -rf node_modules package-lock.json
npm install
```

## Performance Optimization

### Backend Performance

```bash
# Enable MongoDB indexes
python -c "from app.models.user import create_user_indexes; from app.models.relationships import create_relationship_indexes; import asyncio; asyncio.run(create_user_indexes())"

# Monitor Redis usage
redis-cli info memory

# Check database performance
mongostat
```

### Frontend Performance

```bash
# Analyze bundle size
npm run build
npm run analyze

# Enable production mode
NODE_ENV=production npm run build
```

## Security Considerations

### Development Security

1. **Never commit secrets** to version control
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** in production
4. **Validate all inputs** on both client and server
5. **Use parameterized queries** to prevent SQL injection
6. **Implement rate limiting** on public endpoints

### Security Testing

```bash
# Test authentication
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "wrong"}'

# Test rate limiting
for i in {1..100}; do
  curl http://localhost:8000/api/v1/auth/register
done
```

## Contributing to AgroBrain AI

### Code Review Process

1. **Self-review** your code before submitting
2. **Add tests** for new functionality
3. **Update documentation** as needed
4. **Follow coding standards** and best practices
5. **Test thoroughly** before submitting PR

### Pull Request Guidelines

1. **Clear title** and description
2. **Link to relevant issues**
3. **Screenshots** for UI changes
4. **Test results** included
5. **Breaking changes** clearly documented

### Development Best Practices

1. **Write clean, readable code**
2. **Add meaningful comments** where necessary
3. **Keep functions small** and focused
4. **Use descriptive variable names**
5. **Handle errors gracefully**
6. **Log important events**
7. **Write tests for critical paths**

## Getting Help

### Resources

- **Documentation**: Check the `/docs` folder
- **API Docs**: http://localhost:8000/docs
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions

### Community

- **Slack**: Join our Slack workspace
- **Discord**: Join our Discord server
- **Twitter**: Follow us @agrobrain_ai

### Support

- **Email**: support@agrobrain.ai
- **Issues**: https://github.com/your-username/agrobrain-ai/issues
- **Discussions**: https://github.com/your-username/agrobrain-ai/discussions

---

Happy coding! Let's build something amazing for Indian farmers together.
