# Patient API Query Parameters Reference

## GET /api/v1/patients

### Available Query Parameters

| Parameter | Type | Required | Default | Valid Values | Description |
|-----------|------|----------|---------|--------------|-------------|
| `page` | integer | No | 1 | >= 1 | Page number for pagination |
| `limit` | integer | No | 10 | 1-100 | Number of items per page (max 100) |
| `search` | string | No | - | Any string (max 255 chars) | Search by first name, last name, phone, or email |
| `sort` | string | No | `created_at` | See below | Field to sort by |
| `order` | string | No | `desc` | `asc`, `desc` | Sort order (ascending or descending) |

### Valid Sort Fields

The `sort` parameter accepts the following values:

- `first_name` - Sort by patient's first name
- `last_name` - Sort by patient's last name
- `dob` - Sort by date of birth
- `gender` - Sort by gender
- `email` - Sort by email address
- `phone` - Sort by phone number
- `created_at` - Sort by record creation date
- `updated_at` - Sort by last update date

### Example Usage (Dart/Flutter)

```dart
// Basic pagination
final queryParams = <String, dynamic>{
  'page': 1,
  'limit': 20,
  'sort': 'last_name',
  'order': 'asc',
};

// Sort by first name (A-Z)
final queryParams = <String, dynamic>{
  'page': 1,
  'limit': 10,
  'sort': 'first_name',
  'order': 'asc',
};

// Sort by date of birth (oldest first)
final queryParams = <String, dynamic>{
  'page': 1,
  'limit': 10,
  'sort': 'dob',
  'order': 'asc',
};

// Sort by most recently created
final queryParams = <String, dynamic>{
  'page': 1,
  'limit': 10,
  'sort': 'created_at',
  'order': 'desc',
};

// Search with sorting
final queryParams = <String, dynamic>{
  'page': 1,
  'limit': 10,
  'search': 'John',
  'sort': 'last_name',
  'order': 'asc',
};
```

### Response Format

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "first_name": "Jane",
      "last_name": "Doe",
      "dob": "1985-03-15T00:00:00.000Z",
      "gender": "female",
      "phone": "+1-555-0200",
      "email": "jane.doe@email.com",
      "allergies": "Penicillin, Peanuts",
      "known_conditions": "Hypertension, Type 2 Diabetes",
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Error Response (Invalid Sort Field)

If an invalid sort field is provided, the API will return:

```json
{
  "status": "fail",
  "message": "\"sort\" must be one of [first_name, last_name, dob, gender, email, phone, created_at, updated_at]"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)

## Notes

- All date fields are returned in ISO 8601 format
- The `search` parameter performs a case-insensitive partial match across first name, last name, phone, and email fields
- Pagination starts at page 1
- Maximum items per page is capped at 100
