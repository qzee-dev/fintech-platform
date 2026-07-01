# API Documentation

## Authentication Endpoints

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "name": "Jane Doe",
  "phone": "08012345678"
}
```

## Wallet Endpoints

### Get User Wallets
```http
GET /api/wallet/user/:userId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "wallets": [
    {
      "id": "uuid",
      "accountNumber": "0001234567",
      "accountType": "SAVINGS",
      "balance": "100000.00",
      "currency": "NGN",
      "isFrozen": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Create Wallet
```http
POST /api/wallet/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountType": "SAVINGS"
}
```

## Transaction Endpoints

### Create Transaction
```http
POST /api/transaction/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "sourceWalletId": "uuid",
  "destinationWalletId": "uuid",
  "amount": 50000,
  "type": "TRANSFER",
  "description": "Payment for services",
  "idempotencyKey": "unique-key-12345"
}
```

### Get Transaction
```http
GET /api/transaction/:transactionId
Authorization: Bearer <token>
```

## Payment Endpoints

### Bank Transfer
```http
POST /api/payment/bank-transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "sourceAccountNumber": "0001234567",
  "destinationAccountNumber": "0009876543",
  "destinationBankCode": "009",
  "amount": 50000,
  "description": "Payment",
  "idempotencyKey": "unique-key"
}
```

### Validate Account
```http
POST /api/payment/validate-account
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountNumber": "0001234567",
  "bankCode": "001"
}
```

## Fraud Endpoints

### Check Transaction for Fraud
```http
POST /api/fraud/check
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "uuid",
  "transactionId": "uuid",
  "amount": 500000,
  "transactionType": "TRANSFER"
}
```

**Response:**
```json
{
  "isRiskyTransaction": true,
  "riskScore": 65,
  "alerts": ["HIGH_AMOUNT", "UNUSUAL_TIME"]
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Headers**: Rate limit info returned in response headers
- **Status**: 429 when limit exceeded

## Pagination

All list endpoints support pagination:

```http
GET /api/transaction/wallet/:walletId?page=1&limit=20
```

## Response Status Codes

| Code | Meaning |
|------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
