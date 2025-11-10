# Setup Guide

This guide will help you set up and start the Hospital Records Management System server.

## Quick Start

### For Linux/Mac Users

```bash
./setup.sh
```

### For Windows Users

```powershell
.\setup.ps1
```

## What the Setup Script Does

The setup script provides an interactive way to:

1. ✅ Check all prerequisites (Node.js, npm, Docker)
2. ✅ Create `.env` file from `.env.example` if it doesn't exist
3. ✅ Install all npm dependencies
4. ✅ Set up the database (with Docker or locally)
5. ✅ Run database migrations
6. ✅ Optionally seed the database with sample data
7. ✅ Start the server in development or production mode

## Setup Options

The script offers three setup modes:

### 1. Full Setup with Docker (Recommended)

- Automatically starts MySQL and the application in Docker containers
- No manual MySQL installation required
- Isolated environment
- Best for development and testing

**Requirements:**
- Docker
- Docker Compose

**Usage:**
```bash
./setup.sh
# Select option 1 when prompted
```

### 2. Local Setup

- Uses an existing MySQL server or starts MySQL in Docker
- Runs the application directly on your machine
- Better for debugging and development

**Requirements:**
- Node.js 14+
- MySQL 8.0+ (or Docker to run MySQL container)

**Usage:**
```bash
./setup.sh
# Select option 2 when prompted
```

### 3. Skip Database Setup

- Only starts the server
- Assumes database is already set up and migrated
- Useful for quick restarts

**Usage:**
```bash
./setup.sh
# Select option 3 when prompted
```

## Manual Setup (Alternative)

If you prefer to set up manually:

### Step 1: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Database

**Option A: Using Docker**
```bash
docker compose up -d mysql
```

**Option B: Use Existing MySQL**
- Ensure MySQL is running on the configured host/port
- Create database: `hospital_db`
- Create user with appropriate permissions

### Step 4: Run Migrations

```bash
npm run migrate:latest
```

### Step 5: Seed Database (Optional)

```bash
npm run seed:run
```

### Step 6: Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## Environment Variables

Key environment variables you may need to configure in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `hospital_user` |
| `DB_PASS` | MySQL password | `hospital_pass` |
| `DB_NAME` | Database name | `hospital_db` |
| `JWT_SECRET` | JWT secret key | (must be changed!) |
| `JWT_EXPIRES_IN` | Token expiration | `1h` |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds | `12` |
| `LOG_LEVEL` | Logging level | `info` |

## Docker Commands

If using Docker, here are some useful commands:

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f app

# Stop all services
docker compose down

# Restart services
docker compose restart

# View running containers
docker compose ps

# Access MySQL shell
docker exec -it hospital_mysql mysql -uhospital_user -phospital_pass hospital_db
```

## Troubleshooting

### Port Already in Use

If port 4000 is already in use:
1. Change `PORT` in `.env` file
2. Restart the server

### Cannot Connect to Database

1. Verify MySQL is running:
   ```bash
   docker compose ps  # for Docker
   # or
   systemctl status mysql  # for local MySQL on Linux
   ```

2. Check database credentials in `.env`
3. Ensure database exists:
   ```bash
   mysql -h localhost -u hospital_user -p
   # Enter password and run: SHOW DATABASES;
   ```

### Migration Errors

```bash
# Rollback last migration
npm run migrate:rollback

# Run migrations again
npm run migrate:latest
```

### Permission Denied (Linux/Mac)

If you get permission denied when running `./setup.sh`:
```bash
chmod +x setup.sh
./setup.sh
```

## Default Credentials

After seeding the database, you can log in with these default accounts:

**Admin:**
- Email: `admin@hospital.com`
- Password: `Admin@123`

**Doctor:**
- Email: `doctor@hospital.com`
- Password: `Doctor@123`

**Nurse:**
- Email: `nurse@hospital.com`
- Password: `Nurse@123`

**Pharmacist:**
- Email: `pharmacist@hospital.com`
- Password: `Pharmacist@123`

⚠️ **Important:** Change these passwords in production!

## Verifying the Setup

Once the server is running, verify it's working:

### 1. Health Check

```bash
curl http://localhost:4000/health
```

### 2. Login Test

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"Admin@123"}'
```

### 3. Access API Documentation

Open your browser and navigate to:
- API Base: `http://localhost:4000`
- Check the API_EXAMPLES.md file for available endpoints

## Next Steps

After successful setup:

1. 📖 Read the [API_EXAMPLES.md](API_EXAMPLES.md) for API usage
2. 🔒 Review [HIPAA_COMPLIANCE.md](HIPAA_COMPLIANCE.md) for compliance guidelines
3. 🚀 Check [QUICK_START.md](QUICK_START.md) for quick reference
4. 📝 Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for project overview

## Support

If you encounter issues:

1. Check the logs: `docker compose logs -f` or check console output
2. Verify all environment variables are set correctly
3. Ensure all prerequisites are installed
4. Check MySQL connection and credentials

## Stopping the Server

**Docker setup:**
```bash
docker compose down
```

**Local setup:**
- Press `Ctrl+C` in the terminal where the server is running
