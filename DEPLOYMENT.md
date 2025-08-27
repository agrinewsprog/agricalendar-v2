# AgriCalendar - Deployment Guide

## 🚀 Production Deployment

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Nginx
- PM2 (for Node.js process management) or Docker

### 🔧 Server Configuration

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name agricalendar.net www.agricalendar.net;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name agricalendar.net www.agricalendar.net;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;

    # API Backend
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin Panel
    location /admin/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Public Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 📦 Deployment Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/agricalendar-v2.git
   cd agricalendar-v2
   ```

2. **Configure environment variables:**

   ```bash
   # Backend
   cp backend/.env.production backend/.env
   # Edit the database URL and other production values

   # Frontend Public
   cp frontend-public/.env.production frontend-public/.env

   # Frontend Admin
   cp frontend-admin/.env.production frontend-admin/.env
   ```

3. **Deploy with PM2:**

   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

4. **Or deploy with Docker:**
   ```bash
   chmod +x scripts/deploy-docker.sh
   ./scripts/deploy-docker.sh
   ```

### 🔧 Services Management

#### PM2 Commands

```bash
# Start all services
pm2 start ecosystem.config.js

# Restart all services
pm2 restart all

# Check status
pm2 status

# View logs
pm2 logs

# Stop all services
pm2 stop all
```

#### Docker Commands

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# View status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### 🗄️ Database

The application uses PostgreSQL with Prisma ORM. Migrations are automatically applied during deployment.

### 🌐 URLs

- **Public Site:** https://agricalendar.net
- **Admin Panel:** https://agricalendar.net/admin
- **API:** https://agricalendar.net/api

### 🔒 Security

- The admin panel can be restricted by IP if needed (configure in Nginx)
- SSL/TLS is required for production
- Environment variables contain sensitive data - keep them secure

### 📊 Monitoring

Monitor the applications using:

- PM2 monitoring: `pm2 monit`
- Nginx logs: `/var/log/nginx/`
- Application logs: PM2 or Docker logs
