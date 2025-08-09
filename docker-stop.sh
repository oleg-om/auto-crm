#!/bin/bash

echo "🛑 Stopping Auto CRM Docker containers..."

# Stop and remove containers
docker-compose down

echo "✅ Containers stopped successfully!"
echo ""
echo "💾 Your MongoDB data is preserved in the 'mongodb_data' volume"
echo "📋 To completely remove everything (including data):"
echo "   docker-compose down -v"
