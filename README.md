# AgroBrain AI - Smart Farming Platform for Indian Farmers

![AgroBrain AI](https://img.shields.io/badge/AgroBrain-AI-green?style=for-the-badge&logo=leaf)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis)

**AgroBrain AI** is a comprehensive smart farming platform designed specifically for Indian farmers. It combines AI-powered recommendations, real-time weather data, soil intelligence, expert agronomist consultations, and market insights to help farmers maximize their yield and income.

## Features

### Core Features
- **User Authentication**: Secure login/registration with email, Google OAuth, and phone verification
- **Role-Based Access**: Farmers, Agronomists, and Admin with appropriate permissions
- **Multilingual Support**: Hindi and English language support
- **Real-time Weather**: Hyperlocal weather data and forecasts
- **Soil Intelligence**: Soil health analysis and recommendations
- **Crop Recommendations**: AI-powered crop selection based on soil and climate
- **Expert Chat**: Connect with certified agronomists for personalized advice
- **Market Intelligence**: Real-time mandi prices and market trends
- **Voice Support**: Voice-enabled interactions for accessibility

### Technical Features
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Rate Limiting**: API protection against abuse
- **Email Verification**: Secure email verification workflow
- **Password Reset**: Secure password recovery system
- **Admin Dashboard**: Complete user and system management
- **Real-time Chat**: Live messaging between farmers and agronomists
- **Data Analytics**: Comprehensive farming insights and statistics

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom farming theme
- **UI Components**: Radix UI + Custom components
- **State Management**: React Context + Auth Provider
- **Icons**: Lucide Icons
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB with Motor (async driver)
- **Cache**: Redis for session management and caching
- **Authentication**: JWT with bcrypt password hashing
- **Email**: SMTP integration for verification and password reset
- **Rate Limiting**: SlowAPI
- **Documentation**: OpenAPI/Swagger automatic docs

### Infrastructure
- **Deployment**: Docker ready
- **CI/CD**: GitHub Actions ready
- **Environment**: Production and development configurations
- **Monitoring**: Comprehensive logging and error handling

## Quick Start

### Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 18 or higher
- **MongoDB**: 4.4 or higher
- **Redis**: 6.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abx15/Kishan_WebApp.git
   cd Kishan_WebApp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env.local
   ```

4. **Environment Configuration**

   **Backend (.env)**:
   ```env
   # Database
   MONGODB_URL=mongodb://localhost:27017
   MONGODB_DB_NAME=kishan
   
   # Redis
   REDIS_URL=redis://localhost:6379
   
   # JWT
   SECRET_KEY=your-super-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=60
   REFRESH_TOKEN_EXPIRE_DAYS=30
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   
   # Email
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
   OPENWEATHER_API_KEY=your-weather-api-key
   ```

   **Frontend (.env.local)**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=AgroBrain AI
   ```

5. **Database Seeding**
   ```bash
   cd backend
   python scripts/seed_data_comprehensive.py
   ```

### Running the Application

#### Option 1: Using Startup Scripts (Recommended)

```bash
# Start both frontend and backend
python start_all.py

# Or start individually
python start_backend.py --seed
python start_frontend.py
```

#### Option 2: Manual Start

```bash
# Backend (Terminal 1)
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Admin Dashboard**: http://localhost:3000/admin (requires admin login)

## Default Login Credentials

After running the seed script, you can use these credentials:

### Admin User
- **Email**: admin@kishan.ai
- **Password**: Admin@123

### Agronomists
- **Email**: sharma@kishan.ai
- **Password**: Agronomist@123

- **Email**: patel@kishan.ai
- **Password**: Agronomist@123

### Farmers
- **Email**: ramesh@kishan.ai
- **Password**: Farmer@123

- **Email**: sita@kishan.ai
- **Password**: Farmer@123

- **Email**: mohan@kishan.ai
- **Password**: Farmer@123

- **Email**: lakshmi@kishan.ai
- **Password**: Farmer@123

## Project Structure

```
agrobrain-ai/
|
|-- backend/                     # FastAPI Backend
|   |-- app/
|   |   |-- core/              # Core utilities (config, database, redis)
|   |   |-- models/            # Database models (user, relationships)
|   |   |-- routes/            # API routes (auth, admin, chat, weather)
|   |   |-- services/          # Business logic (auth, chat, recommendations)
|   |   |-- schemas/           # Pydantic schemas
|   |   |-- ml/                # Machine learning models
|   |   |-- middleware/        # Custom middleware
|   |   |-- main.py            # FastAPI application entry
|   |-- scripts/               # Database seeding and utilities
|   |-- tests/                 # Test suite
|   |-- requirements.txt       # Python dependencies
|   |-- .env.example          # Environment template
|
|-- frontend/                   # Next.js Frontend
|   |-- app/                   # App Router pages
|   |   |-- (auth)/            # Authentication pages
|   |   |-- dashboard/         # Main dashboard
|   |   |-- chat/              # Chat interface
|   |   |-- weather/           # Weather module
|   |   |-- market/            # Market prices
|   |   |-- settings/          # User settings
|   |-- components/            # React components
|   |   |-- ui/                # UI components
|   |   |-- auth/              # Auth components
|   |   |-- shared/            # Shared components
|   |-- contexts/              # React contexts
|   |-- lib/                   # Utilities and API clients
|   |-- hooks/                 # Custom hooks
|   |-- package.json           # Node.js dependencies
|   |-- .env.example           # Environment template
|
|-- docs/                      # Documentation
|   |-- api.md                 # API documentation
|   |-- architecture.md        # System architecture
|   |-- deployment.md          # Deployment guide
|
|-- start_all.py               # Start both servers
|-- start_backend.py           # Start backend only
|-- start_frontend.py          # Start frontend only
|-- README.md                  # This file
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/google` | Google OAuth |
| GET | `/api/v1/auth/verify-email` | Email verification |
| POST | `/api/v1/auth/forgot-password` | Password reset request |
| POST | `/api/v1/auth/reset-password` | Password reset |
| POST | `/api/v1/auth/refresh` | Token refresh |
| POST | `/api/v1/auth/logout` | User logout |
| GET | `/api/v1/auth/me` | Current user info |
| PATCH | `/api/v1/auth/profile` | Update profile |
| POST | `/api/v1/auth/change-password` | Change password |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/users` | List users (paginated) |
| GET | `/api/v1/admin/users/{id}` | User details |
| PATCH | `/api/v1/admin/users/{id}/ban` | Ban/unban user |
| PATCH | `/api/v1/admin/users/{id}/role` | Change user role |
| GET | `/api/v1/admin/stats` | System statistics |
| GET | `/api/v1/admin/logs` | Recent API logs |

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/chat/conversations` | User conversations |
| POST | `/api/v1/chat/conversations` | Start new conversation |
| GET | `/api/v1/chat/conversations/{id}/messages` | Conversation messages |
| POST | `/api/v1/chat/conversations/{id}/messages` | Send message |

## Development

### Code Style

- **Python**: Follow PEP 8, use Black for formatting
- **TypeScript**: Follow ESLint rules, use Prettier for formatting
- **Components**: Use functional components with hooks
- **API**: Follow RESTful conventions

### Testing

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests
cd frontend
npm run test
```

### Database Migrations

```bash
cd backend
python scripts/migrate.py
```

### Adding New Features

1. **Backend**: Add routes in `app/routes/`, services in `app/services/`
2. **Frontend**: Add pages in `app/`, components in `components/`
3. **Database**: Update models in `app/models/`
4. **Tests**: Add corresponding tests

## Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Production Deployment

1. **Environment Setup**: Configure production environment variables
2. **Database**: Set up MongoDB and Redis clusters
3. **SSL**: Configure SSL certificates
4. **Monitoring**: Set up logging and monitoring
5. **CI/CD**: Configure GitHub Actions

### Environment Variables for Production

```env
# Production
NODE_ENV=production
DEBUG=False

# Database (use connection strings)
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/agrobrain
REDIS_URL=redis://user:pass@redis-cluster:6379

# Security (use strong secrets)
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

# Email (production SMTP)
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=your-sendgrid-username
SMTP_PASS=your-sendgrid-password

# External APIs
OPENAI_API_KEY=sk-production-key
OPENWEATHER_API_KEY=production-weather-key
```

## Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Contribution Guidelines

- **Code Quality**: Ensure code passes all tests and linting
- **Documentation**: Update documentation for new features
- **Breaking Changes**: Clearly document any breaking changes
- **Performance**: Consider performance impact of changes
- **Security**: Follow security best practices

### Development Workflow

1. **Setup**: Clone and set up development environment
2. **Issue**: Create an issue for the feature/bug
3. **Branch**: Create feature branch from main
4. **Develop**: Implement the feature with tests
5. **Test**: Ensure all tests pass
6. **PR**: Submit pull request with description
7. **Review**: Address review feedback
8. **Merge**: Merge to main after approval

### Code Review Process

- **Self Review**: Review your own code first
- **Tests**: Ensure adequate test coverage
- **Documentation**: Update relevant documentation
- **Performance**: Consider performance implications
- **Security**: Check for security vulnerabilities

## Support

### Getting Help

- **Documentation**: Check the `/docs` folder
- **API Docs**: Visit http://localhost:8000/docs
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

### Common Issues

1. **Database Connection**: Check MongoDB and Redis are running
2. **Environment Variables**: Ensure all required variables are set
3. **Dependencies**: Run `pip install` and `npm install` after updates
4. **Port Conflicts**: Change ports if 8000/3000 are occupied

### Troubleshooting

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000

# Check database connection
python -c "from app.core.database import get_database; print('DB OK')"

# Check Redis connection
python -c "from app.core.redis import get_redis_client; print('Redis OK')"
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Indian Farmers**: For inspiring this solution
- **Agricultural Scientists**: For providing domain expertise
- **Open Source Community**: For the amazing tools and libraries
- **Contributors**: Everyone who has contributed to this project

## Contact

- **Email**: support@agrobrain.ai
- **Website**: https://agrobrain.ai
- **GitHub**: https://github.com/your-username/agrobrain-ai

---

**Built with passion for Indian agriculture** - Let's grow together! 

Made with :green_heart: for our farmers across India.
