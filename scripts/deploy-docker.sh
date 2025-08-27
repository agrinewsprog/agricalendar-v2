#!/bin/bash

echo "🚀 Deploying AgriCalendar with Docker..."

# Pull latest changes
git pull origin main

# Stop existing containers
docker-compose -f docker-compose.prod.yml down

# Rebuild and start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Optional: Seed database if needed
# docker-compose -f docker-compose.prod.yml exec backend npm run seed

echo "✅ Deployment completed!"
echo "🌐 Site: https://agricalendar.net"
echo "⚙️ Admin: https://agricalendar.net/admin"
echo ""
echo "📊 Check status with: docker-compose -f docker-compose.prod.yml ps"
echo "📋 View logs with: docker-compose -f docker-compose.prod.yml logs -f"
