# Local Setup Guide (Without Docker)

## Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ installed and running
- Git

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional, or use root)
CREATE USER 'hospital_user'@'localhost' IDENTIFIED BY 'hospital_pass';
GRANT ALL PRIVILEGES ON hospital_db.* TO 'hospital_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Configure Environment

Edit `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_root_password
DB_NAME=hospital_db

PORT=4000
NODE_ENV=development

JWT_SECRET=your_very_strong_jwt_secret_min_32_characters_long
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=5

LOG_LEVEL=info
```

## Step 4: Run Migrations

```bash
npm run migrate:latest
```

Expected output:
```
Batch 1 run: 8 migrations
```

## Step 5: Seed Database (Optional)

```bash
npm run seed:run
```

This creates test users:
- **Admin**: alice@hospital.com / Admin@123
- **Doctor**: john.smith@hospital.com / Doctor@123
- **Pharmacist**: sarah.johnson@hospital.com / Pharmacist@123

## Step 6: Start Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Expected output:
```
🚀 Server running in development mode
🏥 Hospital Records Management System
📡 Listening on port 4000
🔗 API Base URL: http://localhost:4000/api/v1
📊 Health Check: http://localhost:4000/api/v1/health
Database connection established successfully
```

## Step 7: Test API

```bash
# Health check
curl http://localhost:4000/api/v1/health

# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@hospital.com",
    "password": "Admin@123"
  }'
```

## Troubleshooting

### Database Connection Error

**Error**: `Access denied for user`

**Solution**:
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT VERSION();"

# Verify credentials in .env match your MySQL setup
```

### Migration Error

**Error**: `Cannot find module 'knex'`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::4000`

**Solution**:
```bash
# Find and kill process using port 4000
lsof -ti:4000 | xargs kill -9

# Or change PORT in .env
```

## Running Tests

```bash
# Run all tests
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## Database Management

### Rollback Last Migration
```bash
npm run migrate:rollback
```

### Create New Migration
```bash
npm run migrate:make add_column_name
```

### Reset Database (⚠️ Deletes all data)
```bash
mysql -u root -p -e "DROP DATABASE hospital_db; CREATE DATABASE hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
npm run migrate:latest
npm run seed:run
```

## Success!

Your Hospital Records Management System should now be running at:
- **API**: http://localhost:4000/api/v1
- **Health**: http://localhost:4000/api/v1/health

See `API_EXAMPLES.md` for complete API documentation.
