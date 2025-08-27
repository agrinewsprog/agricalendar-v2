#!/bin/bash

echo "🚀 Deploying AgriCalendar..."

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Pull latest changes
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
cd "$PROJECT_ROOT/backend" && npm install --production
cd "$PROJECT_ROOT/frontend-public" && npm install --production  
cd "$PROJECT_ROOT/frontend-admin" && npm install --production

# Build applications
echo "🔨 Building applications..."
cd "$PROJECT_ROOT/frontend-public" && npm run build
cd "$PROJECT_ROOT/frontend-admin" && npm run build
cd "$PROJECT_ROOT/backend" && npm run build

# Run database migrations
echo "🗄️ Running database migrations..."
cd "$PROJECT_ROOT/backend" && npx prisma migrate deploy

# Restart PM2 processes
echo "🔄 Restarting services..."
cd "$PROJECT_ROOT" && pm2 restart ecosystem.config.js

echo "✅ Deployment completed!"
echo "🌐 Site: https://agricalendar.net"
echo "⚙️ Admin: https://agricalendar.net/admin"
