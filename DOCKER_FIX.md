# Docker Setup Fix

## Issue

The Docker setup has MySQL permission issues due to volume persistence. Here's how to fix it:

## Solution 1: Complete Reset (Recommended)

```bash
# Stop and remove everything including volumes
docker-compose down -v

# Remove the orphaned volume
docker volume rm backend_mysql_data 2>/dev/null || true

# Remove any orphaned containers
docker-compose down --remove-orphans

# Rebuild and start fresh
docker-compose build --no-cache
docker-compose up -d

# Wait for MySQL to initialize (about 30 seconds)
sleep 30

# Check MySQL is ready
docker-compose logs mysql | grep "ready for connections"

# Run migrations manually
docker-compose exec app npm run migrate:latest

# Seed database
docker-compose exec app npm run seed:run

# Restart app
docker-compose restart app

# Check logs
docker-compose logs -f app
```

## Solution 2: Use Local Setup Instead

Since Docker is having persistent issues, we recommend using the local setup:

1. Follow instructions in `LOCAL_SETUP.md`
2. This gives you full control and faster development

## Solution 3: Fix MySQL Permissions Manually

```bash
# Enter MySQL container
docker-compose exec mysql bash

# Login to MySQL as root
mysql -u root -p
# Password: secret

# Run these commands:
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

CREATE USER IF NOT EXISTS 'hospital_user'@'%' IDENTIFIED BY 'hospital_pass';
GRANT ALL PRIVILEGES ON hospital_db.* TO 'hospital_user'@'%';

FLUSH PRIVILEGES;
EXIT;

# Exit container
exit

# Restart app
docker-compose restart app
```

## Verify Setup

```bash
# Check containers are running
docker-compose ps

# Check app logs
docker-compose logs app | tail -20

# Test API
curl http://localhost:4000/api/v1/health
```

## Alternative: Use docker-compose without automated migrations

Update `docker-compose.yml` app command to:

```yaml
command: node src/server.js
```

Then run migrations manually:
```bash
docker-compose exec app npm run migrate:latest
docker-compose exec app npm run seed:run
```

## For Production

Do not use the docker-compose setup as-is for production. Consider:
- Using managed MySQL (AWS RDS, Azure Database, etc.)
- Running migrations separately from app startup
- Using Kubernetes or ECS for orchestration
- Implementing proper secrets management
