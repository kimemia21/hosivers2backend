# Hospital Records Management System

A production-ready Node.js backend application for managing hospital records with role-based access control (RBAC), audit trails, and HIPAA-like safeguards.

## 📋 Features

- **Authentication & Authorization**
  - Secure user registration and login with JWT tokens
  - Password hashing using bcrypt (12 rounds)
  - Role-based access control (Admin, Doctor, Pharmacist, Receptionist)
  - Token-based authentication

- **Complete CRUD Operations**
  - Departments
  - Doctors (Healthcare Providers)
  - Patients (with demographics and medical history)
  - Inventory (Medications & Supplies with batch/expiry tracking)
  - Prescriptions (with line items and inventory management)

- **Security & Compliance**
  - Helmet.js for security headers
  - CORS configuration
  - Rate limiting (global and auth-specific)
  - Input validation and sanitization (Joi)
  - SQL injection protection (parameterized queries via Knex.js)
  - PHI redaction in logs
  - Audit trail for all sensitive operations

- **Advanced Features**
  - Pagination, filtering, and search
  - Atomic transactions (prescription creation with inventory deduction)
  - Soft deletes for patients and users
  - Comprehensive audit logging
  - Structured error handling
  - Request logging with Pino

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL 8.x
- **Query Builder**: Knex.js
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Joi
- **Logging**: Pino
- **Testing**: Jest + Supertest
- **Security**: Helmet, express-rate-limit, CORS
- **Containerization**: Docker + Docker Compose

## 📁 Project Structure

```
.
├── src/
│   ├── config/           # Database and environment configuration
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth, validation, error handling, audit
│   ├── validators/       # Joi validation schemas
│   ├── utils/            # Logger, error classes, helpers
│   ├── migrations/       # Database migrations
│   ├── seeds/            # Seed data
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── tests/               # Unit and integration tests
├── docker-compose.yml   # Docker configuration
├── Dockerfile           # Container image
├── package.json
└── README.md
```

## 🚀 Getting Started

### ⚡ Quick Setup (Recommended)

We provide automated setup scripts for easy installation:

**Linux/Mac:**
```bash
./setup.sh
```

**Windows:**
```powershell
.\setup.ps1
```

The setup script will:
- ✅ Check prerequisites (Node.js, npm, Docker)
- ✅ Create `.env` file from template
- ✅ Install dependencies
- ✅ Set up database (Docker or local)
- ✅ Run migrations and optionally seed data
- ✅ Start the server

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

### 📖 Manual Setup

#### Prerequisites

- Node.js 18+ and npm
- MySQL 8.x (or use Docker)
- Git

#### Installation Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd hospital-records-management
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=hospital_db

# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration (use a strong random secret!)
JWT_SECRET=your_very_strong_secret_min_32_characters_long
JWT_EXPIRES_IN=1h

# Security
BCRYPT_SALT_ROUNDS=12
```

4. **Run database migrations**

```bash
npm run migrate:latest
```

5. **Seed the database (optional)**

```bash
npm run seed:run
```

This creates test users:
- **Admin**: `alice@hospital.com` / `Admin@123`
- **Doctor**: `john.smith@hospital.com` / `Doctor@123`
- **Pharmacist**: `sarah.johnson@hospital.com` / `Pharmacist@123`

6. **Start the server**

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will be available at: `http://localhost:4000`

### 🐳 Docker Setup (Recommended)

1. **Start the application with Docker Compose**

```bash
docker-compose up -d
```

This will:
- Start MySQL container
- Start the application container
- Run migrations automatically
- Expose the API on port 4000

2. **Run migrations (if not auto-run)**

```bash
docker-compose exec app npm run migrate:latest
```

3. **Seed the database**

```bash
docker-compose exec app npm run seed:run
```

4. **View logs**

```bash
docker-compose logs -f app
```

5. **Stop the application**

```bash
docker-compose down
```

## 📚 API Documentation

### Base URL

```
http://localhost:4000/api/v1
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### **Authentication**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Admin only |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/refresh` | Refresh token | Public |

#### **Patients**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/patients` | Get all patients (paginated) | Admin, Doctor, Receptionist |
| GET | `/patients/:id` | Get patient by ID | Admin, Doctor, Receptionist |
| POST | `/patients` | Create patient | Admin, Doctor, Receptionist |
| PUT | `/patients/:id` | Update patient | Admin, Doctor, Receptionist |
| DELETE | `/patients/:id` | Delete patient (soft) | Admin |
| GET | `/patients/:id/records` | Get patient records | Admin, Doctor |

#### **Prescriptions**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/prescriptions` | Get all prescriptions | Admin, Doctor, Pharmacist |
| GET | `/prescriptions/:id` | Get prescription by ID | Admin, Doctor, Pharmacist |
| POST | `/prescriptions` | Create prescription | Admin, Doctor |
| PUT | `/prescriptions/:id` | Update prescription | Admin, Doctor |

#### **Inventory**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/inventory` | Get all inventory | Admin, Doctor, Pharmacist |
| GET | `/inventory/:id` | Get inventory item | Admin, Doctor, Pharmacist |
| POST | `/inventory` | Create inventory item | Admin, Pharmacist |
| PUT | `/inventory/:id` | Update inventory item | Admin, Pharmacist |
| DELETE | `/inventory/:id` | Delete inventory item | Admin |

#### **Departments**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/departments` | Get all departments | Admin, Doctor, Receptionist |
| GET | `/departments/:id` | Get department by ID | Admin, Doctor, Receptionist |
| POST | `/departments` | Create department | Admin |
| PUT | `/departments/:id` | Update department | Admin |
| DELETE | `/departments/:id` | Delete department | Admin |

#### **Doctors**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/doctors` | Get all doctors | Admin, Doctor, Receptionist |
| GET | `/doctors/:id` | Get doctor by ID | Admin, Doctor, Receptionist |
| POST | `/doctors` | Create doctor | Admin |
| PUT | `/doctors/:id` | Update doctor | Admin |
| DELETE | `/doctors/:id` | Delete doctor | Admin |

#### **Audit Logs**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/audit/logs` | Get audit logs | Admin only |

### Example Requests

#### 1. Register User (Admin)

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@hospital.com",
    "password": "SecurePass@123",
    "role": "doctor"
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@hospital.com",
    "password": "Admin@123"
  }'
```

#### 3. Create Patient

```bash
curl -X POST http://localhost:4000/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "dob": "1980-05-10",
    "gender": "male",
    "phone": "+1234567890",
    "email": "john.doe@email.com",
    "address": "123 Main St",
    "allergies": "Penicillin",
    "known_conditions": "Hypertension"
  }'
```

#### 4. Create Prescription

```bash
curl -X POST http://localhost:4000/api/v1/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <doctor-token>" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "notes": "Patient has bacterial infection",
    "items": [
      {
        "inventory_id": 1,
        "med_name": "Amoxicillin 500mg",
        "dose": "500mg",
        "frequency": "TID",
        "route": "oral",
        "quantity": 21,
        "instructions": "Take with food"
      }
    ]
  }'
```

#### 5. Search Patients

```bash
curl -X GET "http://localhost:4000/api/v1/patients?page=1&limit=10&search=john" \
  -H "Authorization: Bearer <your-token>"
```

#### 6. Get Inventory with Filters

```bash
curl -X GET "http://localhost:4000/api/v1/inventory?page=1&expiring_soon=true&low_stock=true" \
  -H "Authorization: Bearer <your-token>"
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Test Coverage

The test suite includes:
- Authentication tests (register, login, token validation)
- Patient CRUD operations
- Prescription creation with inventory management
- Input validation
- Authorization checks

## 🔒 Security & HIPAA Compliance

### Implemented Security Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - Strong password requirements (min 8 chars, uppercase, lowercase, number, special char)
   - Role-based access control (RBAC)
   - Password hashing with bcrypt (12 rounds)

2. **Data Protection**
   - PHI (Protected Health Information) redacted from logs
   - Parameterized queries to prevent SQL injection
   - Input validation and sanitization
   - Rate limiting to prevent abuse
   - Helmet.js for security headers

3. **Audit Trail**
   - All CREATE, UPDATE, DELETE operations logged
   - Tracks user, action, object type, and changes
   - Immutable audit logs for compliance

4. **Soft Deletes**
   - Patients and users are soft-deleted (deleted_at timestamp)
   - Preserves historical records for compliance

### Production Hardening Requirements

For HIPAA compliance and production deployment:

#### 1. **Encryption**

- **At Rest**: Enable MySQL encryption at rest (InnoDB encryption)
- **In Transit**: Use TLS/SSL for all connections
  - Configure MySQL with SSL certificates
  - Enforce HTTPS with valid SSL certificates (Let's Encrypt, etc.)
  - Set `secure: true` for cookies
- **Application-Level**: Encrypt sensitive fields (national_id, SSN) using AES-256

```javascript
// Example: Enable SSL in production (knexfile.js)
ssl: {
  rejectUnauthorized: true,
  ca: fs.readFileSync('/path/to/ca-cert.pem'),
  key: fs.readFileSync('/path/to/client-key.pem'),
  cert: fs.readFileSync('/path/to/client-cert.pem'),
}
```

#### 2. **Access Controls**

- Implement IP whitelisting for admin endpoints
- Use VPN for database access
- Implement MFA (Multi-Factor Authentication)
- Regular access reviews and least privilege principle
- Session timeout and automatic logout

#### 3. **Logging & Monitoring**

- **Centralized Logging**: Ship logs to ELK stack, Splunk, or CloudWatch
- **SIEM Integration**: Real-time security monitoring
- **Alerts**: Set up alerts for:
  - Failed login attempts
  - Unusual data access patterns
  - Bulk data exports
  - System errors

#### 4. **Database Security**

- **Backups**:
  - Automated daily encrypted backups
  - Test restore procedures monthly
  - Retention: 7 years for medical records
  - Offsite/cloud backup storage
- **Access Control**:
  - Use dedicated database users with minimal privileges
  - Rotate credentials regularly
  - Enable MySQL audit plugin

```bash
# Example backup script
mysqldump --ssl-mode=REQUIRED \
  --user=backup_user --password \
  --single-transaction \
  hospital_db | gzip | \
  openssl enc -aes-256-cbc -salt -out backup_$(date +%Y%m%d).sql.gz.enc
```

#### 5. **Infrastructure**

- **Containers**: Use non-root users, scan images for vulnerabilities
- **Network**: Deploy in private subnets, use security groups/firewalls
- **Secrets Management**: Use AWS Secrets Manager, HashiCorp Vault, etc.
- **Updates**: Regular security patches for OS, Node.js, and dependencies

#### 6. **Compliance Documentation**

- **Business Associate Agreement (BAA)**: With all third-party services
- **Risk Assessment**: Annual HIPAA risk analysis
- **Policies**: Document security policies and procedures
- **Training**: Annual HIPAA training for all staff
- **Incident Response**: Breach notification procedures

#### 7. **Application Hardening**

```javascript
// Additional production settings
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Stricter CORS
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true,
  maxAge: 86400,
}));
```

## 📊 Database Schema

The database schema includes 8 main tables:

- **users**: User accounts with roles
- **departments**: Hospital departments
- **doctors**: Doctor profiles linked to users
- **patients**: Patient demographics and medical info
- **inventory**: Medications and supplies with batch/expiry tracking
- **prescriptions**: Prescription headers
- **prescription_items**: Prescription line items
- **audit_logs**: Audit trail for compliance

See migration files in `src/migrations/` for detailed schema.

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DB_HOST=your-db-host.rds.amazonaws.com
DB_USER=hospital_prod_user
DB_PASS=<strong-password>
DB_NAME=hospital_prod
JWT_SECRET=<64-char-random-string>
LOG_LEVEL=warn
```

### Docker Production Build

```bash
docker build -t hospital-records:latest .
docker run -d \
  --name hospital-api \
  -p 4000:4000 \
  --env-file .env.production \
  hospital-records:latest
```

### Cloud Deployment Recommendations

- **AWS**: ECS/Fargate + RDS MySQL + ALB + CloudWatch
- **Azure**: App Service + Azure Database for MySQL + Application Insights
- **GCP**: Cloud Run + Cloud SQL + Cloud Logging

## 📝 Migration Commands

```bash
# Run all pending migrations
npm run migrate:latest

# Rollback last batch
npm run migrate:rollback

# Create new migration
npm run migrate:make migration_name

# Run seed files
npm run seed:run
```

## 🤝 Contributing

1. Follow the existing code structure
2. Write tests for new features
3. Update documentation
4. Ensure all tests pass before submitting

## 📄 License

MIT License

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Check the API documentation
- Review test files for usage examples

## ⚠️ Disclaimer

This system handles Protected Health Information (PHI). Ensure compliance with:
- HIPAA (United States)
- GDPR (European Union)
- Local healthcare data protection regulations

**This is a reference implementation. Additional security hardening and legal review are required for production use in healthcare environments.**
# hosivers2backend
