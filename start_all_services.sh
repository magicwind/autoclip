#!/bin/bash

# AutoClip - Start All Services Script
# This script starts all required services for the AutoClip application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to start a service in background and save PID
start_service() {
    local service_name=$1
    local command=$2
    local pid_file=$3
    local log_file=$4
    
    print_status "Starting $service_name..."
    
    # Start the service in background
    nohup $command > "$log_file" 2>&1 &
    local pid=$!
    
    # Save PID to file
    echo $pid > "$pid_file"
    
    # Wait a moment and check if process is still running
    sleep 2
    if kill -0 $pid 2>/dev/null; then
        print_success "$service_name started successfully (PID: $pid)"
        return 0
    else
        print_error "$service_name failed to start"
        return 1
    fi
}

# Create logs directory if it doesn't exist
mkdir -p logs

print_status "Starting AutoClip services..."

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists python; then
    print_error "Python is not installed or not in PATH"
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js is not installed or not in PATH"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed or not in PATH"
    exit 1
fi

# Check if virtual environment exists and activate it
if [ -d ".venv" ]; then
    print_status "Activating Python virtual environment..."
    source .venv/bin/activate
    print_success "Virtual environment activated"
else
    print_warning "No virtual environment found at .venv"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Please copy env.example to .env and configure it."
    if [ -f "env.example" ]; then
        print_status "Copying env.example to .env..."
        cp env.example .env
        print_success ".env file created from template"
    fi
fi

# 1. Start Valkey/Redis server
print_status "Starting Valkey/Redis server..."
VALKEY_CMD="/opt/homebrew/opt/valkey/bin/valkey-server"
VALKEY_CONF="/opt/homebrew/etc/valkey.conf"

if [ -f "$VALKEY_CMD" ] && [ -f "$VALKEY_CONF" ]; then
    if port_in_use 6379; then
        print_warning "Port 6379 is already in use. Valkey/Redis might already be running."
    else
        start_service "Valkey" "$VALKEY_CMD $VALKEY_CONF" "valkey.pid" "logs/valkey.log"
    fi
else
    print_warning "Valkey not found at expected location. Trying to start Redis with brew..."
    if command_exists brew; then
        brew services start redis 2>/dev/null || print_warning "Could not start Redis with brew"
    else
        print_error "Neither Valkey nor Redis found. Please install one of them."
        exit 1
    fi
fi

# 2. Start FastAPI backend
print_status "Starting FastAPI backend server..."
if port_in_use 8000; then
    print_warning "Port 8000 is already in use. Backend might already be running."
else
    BACKEND_CMD="python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"
    start_service "Backend" "$BACKEND_CMD" "backend.pid" "logs/backend.log"
fi

# 3. Start Celery worker
print_status "Starting Celery worker..."
CELERY_CMD="celery -A backend.core.celery_app worker --loglevel=debug --queues=processing,video,notification,upload,celery"
start_service "Celery Worker" "$CELERY_CMD" "celery.pid" "logs/celery.log"

# 4. Start Frontend development server
print_status "Starting Frontend development server..."
if port_in_use 3000; then
    print_warning "Port 3000 is already in use. Frontend might already be running."
else
    if [ -d "frontend" ]; then
        cd frontend
        
        # Check if node_modules exists
        if [ ! -d "node_modules" ]; then
            print_status "Installing frontend dependencies..."
            npm install
        fi
        
        # Start frontend server
        FRONTEND_CMD="npm run dev"
        start_service "Frontend" "$FRONTEND_CMD" "../frontend.pid" "../logs/frontend.log"
        cd ..
    else
        print_error "Frontend directory not found"
    fi
fi

# Wait a moment for all services to stabilize
sleep 3

# Check service status
print_status "Checking service status..."

services_running=0

# Check backend
if port_in_use 8000; then
    print_success "Backend API is running on http://localhost:8000"
    services_running=$((services_running + 1))
else
    print_error "Backend API is not responding on port 8000"
fi

# Check frontend
if port_in_use 3000; then
    print_success "Frontend is running on http://localhost:3000"
    services_running=$((services_running + 1))
else
    print_error "Frontend is not responding on port 3000"
fi

# Check Redis/Valkey
if port_in_use 6379; then
    print_success "Redis/Valkey is running on port 6379"
    services_running=$((services_running + 1))
else
    print_error "Redis/Valkey is not responding on port 6379"
fi

# Check Celery (by checking if PID file exists and process is running)
if [ -f "celery.pid" ] && kill -0 $(cat celery.pid) 2>/dev/null; then
    print_success "Celery worker is running (PID: $(cat celery.pid))"
    services_running=$((services_running + 1))
else
    print_error "Celery worker is not running"
fi

echo ""
print_status "Service startup complete!"
print_status "Services running: $services_running/4"

if [ $services_running -eq 4 ]; then
    print_success "All services are running successfully!"
    echo ""
    echo "Access points:"
    echo "  • Frontend:     http://localhost:3000"
    echo "  • Backend API:  http://localhost:8000"
    echo "  • API Docs:     http://localhost:8000/docs"
    echo ""
    echo "To stop all services, run: ./stop_autoclip.sh"
else
    print_warning "Some services failed to start. Check the logs in the 'logs/' directory."
fi

echo ""
print_status "Logs are available in:"
echo "  • Backend:  logs/backend.log"
echo "  • Frontend: logs/frontend.log"
echo "  • Celery:   logs/celery.log"
echo "  • Valkey:   logs/valkey.log"