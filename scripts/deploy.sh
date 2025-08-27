#!/bin/bash

echo "🚀 Deploying AgriCalendar..."

# Pull latest changes
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm install --production && cd ..
cd frontend-public && npm install --production && cd ..
cd frontend-admin && npm install --production && cd ..

# Build applications
echo "🔨 Building applications..."
cd frontend-public && npm run build && cd ..
cd frontend-admin && npm run build && cd ..
cd backend && npm run build && cd ..

# Run database migrations
echo "🗄️ Running database migrations..."
cd backend && npx prisma migrate deploy && cd ..

# Restart PM2 processes
echo "🔄 Restarting services..."
pm2 restart ecosystem.config.js

# Optional: Seed database if needed
# cd backend && npm run seed && cd ..

echo "✅ Deployment completed!"
echo "🌐 Site: https://agricalendar.net"
echo "⚙️ Admin: https://agricalendar.net/admin"
