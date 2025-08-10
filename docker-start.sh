#!/bin/bash

echo "🚀 Starting Auto CRM with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if env volume exists and initialize if needed
if ! docker volume inspect auto-crm_env_file >/dev/null 2>&1; then
    echo "📝 Initializing .env file in Docker volume..."
    ./init-env.sh
else
    echo "✅ .env volume already exists"
fi

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
