# AutoClip Technical Stack

## Architecture

AutoClip uses a modern full-stack architecture with separate frontend and backend services:

- **Frontend**: React 18 + TypeScript + Ant Design + Vite
- **Backend**: FastAPI + SQLAlchemy + Celery + WebSocket
- **Database**: SQLite (development) / PostgreSQL (production)
- **Message Queue**: Redis + Celery
- **AI Processing**: Tongyi Qianwen API + custom pipeline
- **Video Processing**: FFmpeg + yt-dlp

## Backend Stack

- **FastAPI**: Modern Python web framework with automatic API documentation
- **SQLAlchemy 2.0**: ORM with async support
- **Celery**: Distributed task queue for async processing
- **Redis**: Message broker and caching
- **Pydantic**: Data validation and serialization
- **WebSocket**: Real-time communication for progress updates
- **yt-dlp**: YouTube/Bilibili video downloading
- **FFmpeg**: Video processing and manipulation

## Frontend Stack

- **React 18**: UI framework with Hooks and functional components
- **TypeScript 5.0+**: Type safety and better development experience
- **Ant Design**: Enterprise-class UI component library
- **Vite**: Fast build tool with hot reload
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **React Player**: Video player component

## Common Commands

### Development Setup

```bash
# Clone and setup
git clone <repo-url>
cd autoclip

# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install system dependencies (macOS)
brew install redis ffmpeg

# Start Redis
brew services start redis
```

### Development Servers

```bash
# Quick start (development)
./quick_start.sh

# Full start with monitoring
./start_autoclip.sh

# Check system status
./status_autoclip.sh

# Stop all services
./stop_autoclip.sh
```

### Manual Service Management

```bash
# Backend (from project root)
python scripts/start_backend.py
# or
cd backend && python -m uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm run dev

# Celery Worker
celery -A backend.core.celery_app worker --loglevel=info

# Celery Beat (scheduler)
celery -A backend.core.celery_app beat --loglevel=info

# Flower (Celery monitoring)
celery -A backend.core.celery_app flower --port=5555
```

### Docker Deployment

```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up -d

# Docker scripts
./docker-start.sh      # Start services
./docker-stop.sh       # Stop services
./docker-status.sh     # Check status
```

### Testing and Linting

```bash
# Backend tests
cd backend && python -m pytest

# Frontend linting
cd frontend && npm run lint

# Frontend build
cd frontend && npm run build
```

## Configuration

- Environment variables in `.env` file (copy from `env.example`)
- Backend config in `backend/core/config.py`
- Frontend config in `frontend/src/config/`
- Docker config in `docker-compose.yml` and `docker-compose.dev.yml`

## Key Ports

- **Frontend**: 3000 (development)
- **Backend API**: 8000
- **Redis**: 6379
- **Flower**: 5555 (Celery monitoring)

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc