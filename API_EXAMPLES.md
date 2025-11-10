# API Examples

Complete collection of API examples for the Hospital Records Management System.

## Base URL
```
http://localhost:4000/api/v1
```

## Authentication Examples

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNjc4NDAwMCwiZXhwIjoxNzA2Nzg3NjAwfQ.xxx",
    "user": {
      "id": 1,
      "name": "Alice Admin",
      "email": "alice@hospital.com",
      "role": "admin"
    }
  }
}
```

### 2. Register New User (Admin Only)
```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "Dr. Emily Brown",
    "email": "emily.brown@hospital.com",
    "password": "SecurePass@2024",
    "role": "doctor"
  }'
```

## Department Examples

### 1. Get All Departments
```bash
curl -X GET http://localhost:4000/api/v1/departments \
  -H "Authorization: Bearer <token>"
```

### 2. Create Department
```bash
curl -X POST http://localhost:4000/api/v1/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "name": "Neurology",
    "description": "Diagnosis and treatment of nervous system disorders"
  }'
```

### 3. Update Department
```bash
curl -X PUT http://localhost:4000/api/v1/departments/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "description": "Updated description for cardiology department"
  }'
```

## Doctor Examples

### 1. Get All Doctors
```bash
curl -X GET http://localhost:4000/api/v1/doctors \
  -H "Authorization: Bearer <token>"
```

### 2. Create Doctor Profile
```bash
curl -X POST http://localhost:4000/api/v1/doctors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "user_id": 2,
    "department_id": 1,
    "license_number": "MD-67890",
    "specialization": "Cardiology",
    "phone": "+1-555-0123"
  }'
```

### 3. Get Doctor by ID
```bash
curl -X GET http://localhost:4000/api/v1/doctors/1 \
  -H "Authorization: Bearer <token>"
```

## Patient Examples

### 1. Create Patient
```bash
curl -X POST http://localhost:4000/api/v1/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "first_name": "Michael",
    "last_name": "Johnson",
    "dob": "1975-08-20",
    "gender": "male",
    "national_id": "NAT987654321",
    "phone": "+1-555-0200",
    "email": "michael.j@email.com",
    "address": "456 Oak Avenue, Springfield, IL 62702",
    "emergency_contact_name": "Sarah Johnson",
    "emergency_contact_phone": "+1-555-0201",
    "allergies": "Sulfa drugs, Latex",
    "known_conditions": "Type 2 Diabetes, Asthma"
  }'
```

### 2. Get All Patients with Pagination
```bash
curl -X GET "http://localhost:4000/api/v1/patients?page=1&limit=10&sort=last_name&order=asc" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page, max 100 (default: 10)
- `search` (optional): Search by first name, last name, phone, or email
- `sort` (optional): Sort field - one of `first_name`, `last_name`, `dob`, `gender`, `email`, `phone`, `created_at`, `updated_at` (default: `created_at`)
- `order` (optional): Sort order - `asc` or `desc` (default: `desc`)

**Examples:**
```bash
# Sort by date of birth (oldest first)
curl -X GET "http://localhost:4000/api/v1/patients?sort=dob&order=asc" \
  -H "Authorization: Bearer <token>"

# Sort by gender
curl -X GET "http://localhost:4000/api/v1/patients?sort=gender&order=asc" \
  -H "Authorization: Bearer <token>"

# Sort by email
curl -X GET "http://localhost:4000/api/v1/patients?sort=email&order=asc" \
  -H "Authorization: Bearer <token>"
```

### 3. Search Patients
```bash
curl -X GET "http://localhost:4000/api/v1/patients?search=Johnson" \
  -H "Authorization: Bearer <token>"
```

### 4. Get Patient by ID
```bash
curl -X GET http://localhost:4000/api/v1/patients/1 \
  -H "Authorization: Bearer <token>"
```

### 5. Update Patient
```bash
curl -X PUT http://localhost:4000/api/v1/patients/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "phone": "+1-555-9999",
    "address": "789 New Street, Springfield, IL 62703",
    "known_conditions": "Type 2 Diabetes, Asthma, Hypertension"
  }'
```

### 6. Get Patient Medical Records
```bash
curl -X GET http://localhost:4000/api/v1/patients/1/records \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "patient": {
      "id": 1,
      "first_name": "Jane",
      "last_name": "Doe",
      "dob": "1985-03-15",
      "allergies": "Penicillin, Peanuts",
      "known_conditions": "Hypertension, Type 2 Diabetes"
    },
    "prescriptions": [
      {
        "id": 1,
        "issue_date": "2024-01-15T10:30:00.000Z",
        "notes": "Patient presenting with chest pain",
        "status": "active",
        "doctor_name": "Dr. John Smith",
        "specialization": "Cardiology",
        "items": [
          {
            "med_name": "Amoxicillin 500mg",
            "dose": "500mg",
            "frequency": "TID",
            "route": "oral",
            "quantity": 21,
            "instructions": "Take with food"
          }
        ]
      }
    ]
  }
}
```

### 7. Delete Patient (Soft Delete)
```bash
curl -X DELETE http://localhost:4000/api/v1/patients/1 \
  -H "Authorization: Bearer <admin-token>"
```

## Inventory Examples

### 1. Get All Inventory
```bash
curl -X GET "http://localhost:4000/api/v1/inventory?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 2. Search Inventory
```bash
curl -X GET "http://localhost:4000/api/v1/inventory?search=Amoxicillin" \
  -H "Authorization: Bearer <token>"
```

### 3. Filter Expiring Soon
```bash
curl -X GET "http://localhost:4000/api/v1/inventory?expiring_soon=true&page=1" \
  -H "Authorization: Bearer <token>"
```

### 4. Filter Low Stock
```bash
curl -X GET "http://localhost:4000/api/v1/inventory?low_stock=true" \
  -H "Authorization: Bearer <token>"
```

### 5. Create Inventory Item
```bash
curl -X POST http://localhost:4000/api/v1/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <pharmacist-token>" \
  -d '{
    "sku": "MED-LISIN-10",
    "name": "Lisinopril 10mg",
    "description": "ACE inhibitor for hypertension",
    "batch_number": "BATCH-2024-004",
    "expiry_date": "2025-12-31",
    "unit": "tablets",
    "quantity": 500,
    "location": "Pharmacy B, Shelf 5"
  }'
```

### 6. Update Inventory
```bash
curl -X PUT http://localhost:4000/api/v1/inventory/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <pharmacist-token>" \
  -d '{
    "quantity": 450,
    "location": "Pharmacy A, Shelf 3"
  }'
```

### 7. Get Inventory by ID
```bash
curl -X GET http://localhost:4000/api/v1/inventory/1 \
  -H "Authorization: Bearer <token>"
```

## Prescription Examples

### 1. Create Prescription (with Inventory Deduction)
```bash
curl -X POST http://localhost:4000/api/v1/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <doctor-token>" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "notes": "Patient presenting with acute bronchitis. Prescribed antibiotics and pain management.",
    "status": "active",
    "items": [
      {
        "inventory_id": 1,
        "med_name": "Amoxicillin 500mg",
        "dose": "500mg",
        "frequency": "TID (three times daily)",
        "route": "oral",
        "quantity": 21,
        "instructions": "Take one tablet three times daily with food for 7 days. Complete full course even if symptoms improve."
      },
      {
        "inventory_id": 2,
        "med_name": "Paracetamol 500mg",
        "dose": "500mg",
        "frequency": "Q6H PRN (every 6 hours as needed)",
        "route": "oral",
        "quantity": 20,
        "instructions": "Take for pain or fever. Do not exceed 4000mg per day."
      }
    ]
  }'
```

### 2. Create Prescription (without Inventory Item)
```bash
curl -X POST http://localhost:4000/api/v1/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <doctor-token>" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "notes": "Lifestyle modification and monitoring",
    "items": [
      {
        "med_name": "Vitamin D3 1000 IU",
        "dose": "1000 IU",
        "frequency": "QD (once daily)",
        "route": "oral",
        "instructions": "Take with breakfast daily"
      }
    ]
  }'
```

### 3. Get All Prescriptions
```bash
curl -X GET "http://localhost:4000/api/v1/prescriptions?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 4. Filter Prescriptions by Status
```bash
curl -X GET "http://localhost:4000/api/v1/prescriptions?status=active" \
  -H "Authorization: Bearer <token>"
```

### 5. Filter Prescriptions by Patient
```bash
curl -X GET "http://localhost:4000/api/v1/prescriptions?patient_id=1" \
  -H "Authorization: Bearer <token>"
```

### 6. Get Prescription by ID
```bash
curl -X GET http://localhost:4000/api/v1/prescriptions/1 \
  -H "Authorization: Bearer <token>"
```

### 7. Update Prescription Status
```bash
curl -X PUT http://localhost:4000/api/v1/prescriptions/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <doctor-token>" \
  -d '{
    "status": "completed",
    "notes": "Patient completed treatment successfully"
  }'
```

## Audit Log Examples

### 1. Get All Audit Logs (Admin Only)
```bash
curl -X GET "http://localhost:4000/api/v1/audit/logs?page=1&limit=50" \
  -H "Authorization: Bearer <admin-token>"
```

### 2. Filter by User
```bash
curl -X GET "http://localhost:4000/api/v1/audit/logs?user_id=1" \
  -H "Authorization: Bearer <admin-token>"
```

### 3. Filter by Action
```bash
curl -X GET "http://localhost:4000/api/v1/audit/logs?action=CREATE" \
  -H "Authorization: Bearer <admin-token>"
```

### 4. Filter by Object Type
```bash
curl -X GET "http://localhost:4000/api/v1/audit/logs?object_type=patient" \
  -H "Authorization: Bearer <admin-token>"
```

### 5. Filter by Date Range
```bash
curl -X GET "http://localhost:4000/api/v1/audit/logs?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer <admin-token>"
```

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "status": "fail",
  "message": "\"first_name\" is required, \"email\" must be a valid email"
}
```

### 401 Unauthorized - No Token
```json
{
  "status": "fail",
  "message": "No token provided. Please authenticate."
}
```

### 401 Unauthorized - Invalid Token
```json
{
  "status": "fail",
  "message": "Invalid token. Please authenticate."
}
```

### 403 Forbidden - Insufficient Permissions
```json
{
  "status": "fail",
  "message": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "status": "fail",
  "message": "Patient not found"
}
```

### 409 Conflict
```json
{
  "status": "fail",
  "message": "Email already registered"
}
```

### 429 Too Many Requests
```json
{
  "status": "fail",
  "message": "Too many requests from this IP. Please try again later."
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Something went wrong. Please try again later."
}
```

## Postman Collection

Save this as `hospital-api.postman_collection.json`:

```json
{
  "info": {
    "name": "Hospital Records Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:4000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.collectionVariables.set('token', pm.response.json().data.token);"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"alice@hospital.com\",\n  \"password\": \"Admin@123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{base_url}}/auth/login"
          }
        }
      ]
    }
  ]
}
```

## Testing with cURL Variables

Set token as environment variable:
```bash
export TOKEN="your_jwt_token_here"
```

Then use in requests:
```bash
curl -X GET http://localhost:4000/api/v1/patients \
  -H "Authorization: Bearer $TOKEN"
```
