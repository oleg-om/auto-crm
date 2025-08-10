#!/bin/bash

echo "🚀 Starting Auto CRM with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Please create .env file first:"
    echo "   ./create-env.sh"
    exit 1
fi

echo "✅ .env file found"

# Build and start containers
echo "📦 Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if containers are running
echo "🔍 Checking container status..."
docker-compose ps

echo "✅ Auto CRM is starting up!"
echo "🌐 Access the application at: http://localhost"
echo "📊 MongoDB is available at: localhost:27017"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo "  - Access MongoDB: docker exec -it auto-crm-mongodb mongosh"
