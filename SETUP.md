# FinTech Platform - Development Setup

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/qzee-dev/fintech-platform.git
cd fintech-platform
```

### Step 2: Configure Environment
Create `.env` file in the root directory:
```env
# Database
POSTGRES_USER=fintech_user
POSTGRES_PASSWORD=fintech_secure_password
POSTGRES_DB=fintech_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Email (Gmail)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE=+1234567890

# Fraud Detection
FRAUD_THRESHOLD=500000
```

### Step 3: Start Services
```bash
docker-compose up --build
```

### Step 4: Access Applications
- **Web Frontend**: http://localhost:3001
- **API Gateway**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs

## Development Commands

### Start Services
```bash
docker-compose up
```

### Stop Services
```bash
docker-compose down
```

### Rebuild Services
```bash
docker-compose up --build
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f user-service
```

### Access Database
```bash
docker exec -it fintech-platform_postgres_1 psql -U fintech_user -d fintech_db
```

## Testing

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@fintech.com",
    "password": "Test@123"
  }'
```

### Test Wallet Creation
```bash
curl -X POST http://localhost:3000/api/wallet/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "accountType": "SAVINGS"
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port
kill -9 $(lsof -t -i :3000)
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Kafka Connection Issues
```bash
# Check Kafka is running
docker-compose logs kafka

# Restart Kafka
docker-compose restart kafka zookeeper
```

## Architecture Diagram

```
┌──────────────────┐
│   Browser        │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│   React Frontend    │ (Port 3001)
│   (Tailwind CSS)    │
└──────────┬──────────────────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│   API Gateway        │ (Port 3000)
│ (Auth & Validation)  │
└──────────┬───────────────────────────────┬──────┐
           │                 │             │      │
       ┌───┘              ┌──┘        ┌────┘  ┌───┘
       ▼                  ▼           ▼        ▼
  ┌─────────────┐   ┌──────────────┐ ┌──────────────┐
  │ User        │   │ Wallet       │ │Transaction   │
  │Service      │   │Service       │ │Service       │
  │(3001)       │   │(3002)        │ │(3003)        │
  └────┬────────┘   └────┬─────────┘ └────┬────────┘
       │                 │                 │
       └─────────────────┴─────────────────┘
       │
       ├─────────────────┬──────────────┐
       │                 │              │
       ▼                 ▼              ▼
  ┌──────────────┐  ┌──────────┐   ┌─────────────┐
  │PostgreSQL    │  │ Redis    │   │ Kafka       │
  │Database      │  │ Cache    │   │ Message Bus │
  └──────────────┘  └──────────┘   └─────────────┘
       │                 │              │
       └─────────────────┴──────────────┘
       │
       ├───────────────┬──────────────┬──────────────┐
       │               │              │              │
       ▼               ▼              ▼              ▼
  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
  │ Fraud       │ │Notification │ │NIBSS Mock   │ │Payment       │
  │Service      │ │Service      │ │Service      │ │Service       │
  │(3005)       │ │(3006)       │ │(3007)       │ │(3004)        │
  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Wallets Table
```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  account_number VARCHAR(20) UNIQUE NOT NULL,
  account_type VARCHAR(20) NOT NULL,
  balance DECIMAL(20,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'NGN',
  is_frozen BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  source_wallet_id UUID REFERENCES wallets(id),
  destination_wallet_id UUID REFERENCES wallets(id),
  amount DECIMAL(20,2) NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  reference VARCHAR(100) UNIQUE,
  idempotency_key VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  settled_at TIMESTAMP
);
```

## Performance Tips

1. **Database Indexing**
   - Index frequently queried columns (user_id, wallet_id)
   - Use composite indexes for common filters

2. **Caching Strategy**
   - Cache user sessions in Redis
   - Cache wallet balances for 5 minutes
   - Invalidate cache on updates

3. **Kafka Optimization**
   - Batch messages for efficiency
   - Use consumer groups for scalability
   - Monitor lag and throughput

4. **Frontend Optimization**
   - Implement code splitting
   - Use React lazy loading
   - Optimize bundle size

## API Response Examples

### Login Response
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Transaction Response
```json
{
  "id": "uuid",
  "reference": "TXN-12345678",
  "amount": 50000,
  "status": "COMPLETED",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

## Next Steps

1. Read the [README.md](README.md) for detailed documentation
2. Explore the [API documentation](docs/API.md)
3. Check [service documentation](docs/SERVICES.md)
4. Review [deployment guide](docs/DEPLOYMENT.md)
