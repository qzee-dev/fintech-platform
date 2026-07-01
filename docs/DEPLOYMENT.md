# Deployment Guide

## Production Deployment

### Prerequisites
- Docker & Docker Compose
- Docker registry (Docker Hub, ECR, etc.)
- Server with at least 4GB RAM
- SSL certificate for HTTPS

## Deployment Steps

### 1. Prepare Environment Variables

Create `.env.production` file:
```env
NODE_ENV=production
JWT_SECRET=<generate-strong-random-string>
POSTGRES_USER=fintech_prod_user
POSTGRES_PASSWORD=<generate-strong-password>
POSTGRES_DB=fintech_prod_db
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<app-password>
TWILIO_ACCOUNT_SID=<your-sid>
TWILIO_AUTH_TOKEN=<your-token>
TWILIO_PHONE=<your-phone>
```

### 2. Build Docker Images

```bash
# Build all services
docker-compose build

# Or build specific service
docker build -t fintech/user-service:latest ./services/user-service
```

### 3. Push to Registry

```bash
# Login to registry
docker login

# Tag images
docker tag fintech/user-service:latest myregistry/fintech/user-service:latest

# Push images
docker push myregistry/fintech/user-service:latest
```

### 4. Deploy to Server

```bash
# SSH into server
ssh user@production-server

# Clone repository
git clone https://github.com/qzee-dev/fintech-platform.git
cd fintech-platform

# Create production compose file
cp docker-compose.yml docker-compose.prod.yml

# Copy environment file
cp .env.example .env.production
# Edit .env.production with production values

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

### 5. Setup Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/fintech`:

```nginx
server {
    listen 80;
    server_name api.fintech.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name fintech.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Setup SSL with Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.fintech.com -d fintech.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### 7. Database Backup

Create backup script `/home/user/backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/user/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

docker exec fintech-platform_postgres_1 pg_dump -U fintech_prod_user fintech_prod_db | \
  gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

Schedule with cron:
```bash
crontab -e
# Add: 0 2 * * * /home/user/backup-db.sh
```

### 8. Monitoring Setup

Install monitoring tools:

```bash
# Install Docker stats
docker stats --all --no-stream

# Setup log aggregation
docker-compose logs -f --tail=100
```

## Health Checks

All services have health check endpoints:

```bash
# Check service health
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
```

## Scaling

### Horizontal Scaling with Load Balancer

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  user-service:
    build: ./services/user-service
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

### Database Scaling

- Use read replicas for better performance
- Implement database connection pooling
- Consider managed databases (RDS, Cloud SQL)

## Security Hardening

1. **Firewall Configuration**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Docker Security**
   ```bash
   # Use read-only file systems
   docker run --read-only
   
   # Drop capabilities
   docker run --cap-drop=ALL
   ```

3. **Network Isolation**
   - Use Docker networks for service isolation
   - Never expose services directly
   - Use API gateway for all requests

## Troubleshooting

### Service Not Starting
```bash
docker-compose logs user-service
docker-compose up user-service --no-detach
```

### Database Connection Issues
```bash
docker exec fintech-platform_postgres_1 psql -U fintech_prod_user -c "SELECT 1"
```

### High Memory Usage
```bash
docker stats
docker-compose down
docker system prune -a
```

## Maintenance

### Regular Updates
```bash
# Update base images
docker pull node:18-alpine
docker pull postgres:15-alpine

# Rebuild services
docker-compose build --pull
docker-compose up -d
```

### Log Rotation
```bash
# Configure Docker daemon for log rotation
cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

sudo systemctl restart docker
```
