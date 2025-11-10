# Quick Command Reference

## Setup Commands

### Initial Setup
```bash
# Linux/Mac
./setup.sh

# Windows
.\setup.ps1
```

### Manual Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Run migrations
npm run migrate:latest

# Seed database (optional)
npm run seed:run
```

## Server Commands

### Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Database Commands

### Migrations
```bash
# Run all pending migrations
npm run migrate:latest

# Rollback last migration
npm run migrate:rollback

# Create new migration
npm run migrate:make <migration_name>
```

### Seeding
```bash
# Run all seed files
npm run seed:run
```

## Docker Commands

### Basic Operations
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart services
docker compose restart

# View running containers
docker compose ps
```

### Logs
```bash
# View all logs
docker compose logs

# Follow logs (real-time)
docker compose logs -f

# View app logs only
docker compose logs -f app

# View MySQL logs only
docker compose logs -f mysql
```

### Execute Commands in Container
```bash
# Run migrations in container
docker compose exec app npm run migrate:latest

# Seed database in container
docker compose exec app npm run seed:run

# Access app container shell
docker compose exec app sh

# Access MySQL shell
docker compose exec mysql mysql -uhospital_user -phospital_pass hospital_db
```

### Container Management
```bash
# Rebuild containers
docker compose build

# Rebuild and start
docker compose up -d --build

# Remove all containers and volumes
docker compose down -v

# View container stats
docker stats
```

## Development Commands

### Database Inspection
```bash
# Access MySQL directly (local)
mysql -h localhost -u hospital_user -p hospital_db

# Common SQL queries
SHOW TABLES;
DESCRIBE users;
SELECT * FROM knex_migrations;
```

## API Testing

### Health Check
```bash
curl http://localhost:4000/health
```

### Login Test
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"Admin@123"}'
```

### Get Patients (with auth)
```bash
curl http://localhost:4000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting Commands

### Check Port Usage
```bash
# Linux/Mac
lsof -i :4000
netstat -an | grep 4000

# Windows
netstat -ano | findstr :4000
```

### Check Node/npm Version
```bash
node --version
npm --version
```

### Check Docker Status
```bash
docker --version
docker compose version
docker ps
```

### Clear npm Cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Reset Database
```bash
# Rollback all migrations
npm run migrate:rollback

# Run migrations again
npm run migrate:latest

# Reseed
npm run seed:run
```

## Environment Variables

View all environment variables being used:
```bash
# Linux/Mac
cat .env

# Windows
type .env
```

## Logs Location

Application logs are stored in:
- Console output (development)
- `./logs` directory (if configured)
- Docker logs: `docker compose logs -f app`
