# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Docker (Recommended)

```bash
# 1. Start the application
docker-compose up -d

# 2. Wait for MySQL to be ready (about 30 seconds)
docker-compose logs -f mysql

# 3. Run migrations
docker-compose exec app npm run migrate:latest

# 4. Seed the database
docker-compose exec app npm run seed:run

# 5. Test the API
curl http://localhost:4000/api/v1/health
```

### Option 2: Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# 3. Create database
mysql -u root -p -e "CREATE DATABASE hospital_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Run migrations
npm run migrate:latest

# 5. Seed the database
npm run seed:run

# 6. Start the server
npm run dev
```

## 🔐 Test Credentials

After seeding, you can login with:

**Admin:**
- Email: `alice@hospital.com`
- Password: `Admin@123`

**Doctor:**
- Email: `john.smith@hospital.com`
- Password: `Doctor@123`

**Pharmacist:**
- Email: `sarah.johnson@hospital.com`
- Password: `Pharmacist@123`

## 📝 First API Calls

### 1. Login
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@hospital.com",
    "password": "Admin@123"
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Alice Admin",
      "email": "alice@hospital.com",
      "role": "admin"
    }
  }
}
```

Save the token for subsequent requests!

### 2. Get All Patients
```bash
TOKEN="your_token_here"

curl -X GET "http://localhost:4000/api/v1/patients?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Create a Patient
```bash
curl -X POST http://localhost:4000/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "dob": "1985-06-15",
    "gender": "male",
    "phone": "+1234567890",
    "email": "john.doe@example.com",
    "address": "123 Main St, City, State 12345",
    "allergies": "Penicillin",
    "known_conditions": "Hypertension"
  }'
```

### 4. Create a Prescription
```bash
curl -X POST http://localhost:4000/api/v1/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "notes": "Patient presenting with bacterial infection",
    "items": [
      {
        "inventory_id": 1,
        "med_name": "Amoxicillin 500mg",
        "dose": "500mg",
        "frequency": "TID (three times daily)",
        "route": "oral",
        "quantity": 14,
        "instructions": "Take with food. Complete full course."
      }
    ]
  }'
```

### 5. Check Inventory
```bash
curl -X GET "http://localhost:4000/api/v1/inventory?page=1&limit=10&expiring_soon=true" \
  -H "Authorization: Bearer $TOKEN"
```

### 6. View Audit Logs (Admin Only)
```bash
curl -X GET "http://localhost:4000/api/v1/audit/logs?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

## 🧪 Run Tests

```bash
# Run all tests
npm test

# With coverage
npm test -- --coverage
```

## 📊 Verify Installation

Check all endpoints:
```bash
# Health check
curl http://localhost:4000/api/v1/health

# Should return:
# {"status":"success","message":"Server is running","timestamp":"2024-01-01T12:00:00.000Z"}
```

## 🛠️ Useful Commands

```bash
# View logs
docker-compose logs -f app

# Access database
docker-compose exec mysql mysql -u hospital_user -p hospital_db

# Run migrations
npm run migrate:latest

# Rollback last migration
npm run migrate:rollback

# Create new migration
npm run migrate:make add_new_column

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🔍 Troubleshooting

### Database Connection Error
```bash
# Check if MySQL is running
docker-compose ps

# View MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Port Already in Use
```bash
# Change port in .env
PORT=4001

# Or stop existing service
lsof -ti:4000 | xargs kill -9
```

### Migration Errors
```bash
# Reset database (WARNING: Deletes all data!)
docker-compose exec mysql mysql -u root -p -e "DROP DATABASE hospital_db; CREATE DATABASE hospital_db;"
npm run migrate:latest
npm run seed:run
```

## 📖 Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Review [HIPAA_COMPLIANCE.md](HIPAA_COMPLIANCE.md) for production deployment
3. Explore the [API endpoints](README.md#api-endpoints)
4. Check the [SQL_SCHEMA.sql](SQL_SCHEMA.sql) for database structure
5. Review test files in `tests/` for usage examples

## 🎯 Common Use Cases

### Register a New User (Admin Only)
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Dr. Jane Smith",
    "email": "jane.smith@hospital.com",
    "password": "SecurePass@123",
    "role": "doctor"
  }'
```

### Search Patients
```bash
curl -X GET "http://localhost:4000/api/v1/patients?search=John&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Patient Medical Records
```bash
curl -X GET http://localhost:4000/api/v1/patients/1/records \
  -H "Authorization: Bearer $TOKEN"
```

### Update Inventory
```bash
curl -X PUT http://localhost:4000/api/v1/inventory/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "quantity": 500,
    "location": "Pharmacy A, Shelf 4"
  }'
```

## ✅ Success!

You should now have a fully functional Hospital Records Management System running locally. Start building your healthcare application! 🏥
