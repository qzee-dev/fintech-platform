# FinTech Platform

A comprehensive microservices-based fintech platform built with Node.js, React, and PostgreSQL. The platform provides core banking functionality including user management, wallet management, transactions, payments, fraud detection, and notifications.

## Architecture Overview

### Services

1. **API Gateway** (Port 3000)
   - Central entry point for all client requests
   - Authentication and authorization
   - Rate limiting and request validation
   - Routes requests to appropriate microservices

2. **User Service** (Port 3001)
   - User registration and authentication
   - Profile management
   - JWT token generation
   - Redis caching for performance

3. **Wallet Service** (Port 3002)
   - Multi-currency wallet support
   - Account balance management
   - Wallet creation and management
   - Kafka event publishing

4. **Transaction Service** (Port 3003)
   - Transaction processing and ledger
   - Idempotency for safe retries
   - Event-driven transaction updates
   - Integration with ledger service

5. **Payment Service** (Port 3004)
   - External bank transfers
   - NIBSS integration for Nigerian banks
   - Account validation
   - Transfer status tracking

6. **Fraud Service** (Port 3005)
   - Real-time fraud detection
   - Risk scoring
   - Suspicious transaction alerts
   - Configurable fraud rules

7. **Notification Service** (Port 3006)
   - Email notifications via Nodemailer
   - SMS notifications via Twilio
   - Event-driven notifications
   - Transaction confirmations

8. **NIBSS Mock Service** (Port 3007)
   - Mock bank transfer API
   - Account validation simulation
   - Testing and development

### Frontend

- **React Web Application** (Port 3001)
  - Modern UI with Tailwind CSS
  - Dashboard with wallet overview
  - Transfer interface
  - Transaction history
  - User profile management
  - Responsive design

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **Message Queue**: Kafka
- **Authentication**: JWT
- **Logging**: Winston
- **Validation**: Joi

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Notifications**: React Hot Toast

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## Getting Started

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/qzee-dev/fintech-platform.git
   cd fintech-platform
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Wait for services to be ready**
   ```
   Services will be available at:
   - API Gateway: http://localhost:3000
   - Web Frontend: http://localhost:3001
   - User Service: http://localhost:3001
   - Wallet Service: http://localhost:3002
   - Transaction Service: http://localhost:3003
   - Payment Service: http://localhost:3004
   - Fraud Service: http://localhost:3005
   - Notification Service: http://localhost:3006
   - NIBSS Mock: http://localhost:3007
   ```

### Local Development

1. **Install dependencies for each service**
   ```bash
   cd services/user-service && npm install
   cd services/wallet-service && npm install
   # ... repeat for other services
   ```

2. **Set up PostgreSQL**
   ```bash
   # Using Docker
   docker run -d \
     -e POSTGRES_USER=fintech_user \
     -e POSTGRES_PASSWORD=fintech_secure_password \
     -e POSTGRES_DB=fintech_db \
     -p 5432:5432 \
     postgres:15-alpine
   ```

3. **Set up Redis**
   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```

4. **Set up Kafka**
   ```bash
   docker run -d \
     -e KAFKA_BROKER_ID=1 \
     -e KAFKA_ZOOKEEPER_CONNECT=localhost:2181 \
     -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
     -p 9092:9092 \
     confluentinc/cp-kafka:7.5.0
   ```

5. **Start services individually**
   ```bash
   cd services/user-service
   npm start
   
   # In another terminal
   cd services/wallet-service
   npm start
   
   # ... repeat for other services
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Wallet Management
- `GET /api/wallet/user/:userId` - Get user wallets
- `POST /api/wallet/create` - Create new wallet
- `GET /api/wallet/:walletId` - Get wallet details

### Transactions
- `POST /api/transaction/create` - Create transaction
- `GET /api/transaction/:transactionId` - Get transaction details
- `GET /api/transaction/wallet/:walletId` - Get wallet transactions

### Payments
- `POST /api/payment/bank-transfer` - Initiate bank transfer
- `GET /api/payment/status/:reference` - Check transfer status
- `POST /api/payment/validate-account` - Validate account number

### Fraud Detection
- `POST /api/fraud/check` - Check transaction for fraud
- `GET /api/fraud/alerts/:userId` - Get fraud alerts for user

### Notifications
- `POST /api/notification/email` - Send email
- `POST /api/notification/sms` - Send SMS

## Environment Variables

### API Gateway
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
USER_SERVICE_URL=http://localhost:3001
WALLET_SERVICE_URL=http://localhost:3002
TRANSACTION_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004
FRAUD_SERVICE_URL=http://localhost:3005
NOTIFICATION_SERVICE_URL=http://localhost:3006
```

### Services
```env
DATABASE_URL=postgresql://fintech_user:fintech_secure_password@localhost:5432/fintech_db
REDIS_URL=redis://localhost:6379
KAFKA_BROKERS=localhost:9092
JWT_SECRET=your-super-secret-jwt-key
```

### Payment Service
```env
NIBSS_API_URL=http://localhost:3007
FRAUD_THRESHOLD=500000
```

### Notification Service
```env
EMAIL_USER=noreply@fintech.com
EMAIL_PASSWORD=your-app-password
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE=your-twilio-phone
```

## Testing

### Test User Credentials
```
Email: test@fintech.com
Password: Test@123
```

### Sample Bank Accounts (NIBSS Mock)
```
Account: 0001234567, Bank: 001, Name: John Doe
Account: 0009876543, Bank: 009, Name: Jane Smith
Account: 0050123456, Bank: 005, Name: ABC Company
```

## Project Structure

```
fintech-platform/
├── services/
│   ├── api-gateway/
│   ├── user-service/
│   ├── wallet-service/
│   ├── transaction-service/
│   ├── payment-service/
│   ├── fraud-service/
│   └── notification-service/
├── mock-services/
│   └── nibss-mock/
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.jsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Key Features

✅ **User Management**
- Secure authentication with JWT
- Password hashing with bcrypt
- Redis session caching

✅ **Wallet Management**
- Multiple wallets per user
- Real-time balance updates
- Account freeze functionality

✅ **Transaction Processing**
- Idempotent transaction creation
- Event-driven processing
- Ledger integration
- Transaction status tracking

✅ **Payment Processing**
- Bank transfer support
- NIBSS integration
- Account validation
- Payment status monitoring

✅ **Fraud Detection**
- Real-time fraud scoring
- Configurable detection rules
- Alert system
- Suspicious transaction logging

✅ **Notifications**
- Email notifications
- SMS alerts via Twilio
- Event-driven delivery
- Transaction confirmations

✅ **Modern Frontend**
- Responsive design
- Real-time dashboard
- Secure token management
- Intuitive user interface

## Performance Considerations

- **Caching**: Redis for session and user data caching
- **Async Processing**: Kafka for asynchronous event handling
- **Database Optimization**: Indexed queries and proper schema design
- **Rate Limiting**: API gateway rate limiting
- **Idempotency**: Safe retry mechanisms for transactions

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Joi
- Rate limiting
- Transaction idempotency for replay attack prevention
- Fraud detection

## Monitoring & Logging

- Winston logging across all services
- Structured logging with timestamps
- Error tracking and reporting
- Service health checks

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Machine learning fraud detection
- [ ] Cryptocurrency integration
- [ ] API rate limiting per user
- [ ] Transaction scheduling
- [ ] Multi-signature authorization
- [ ] Compliance reporting
- [ ] Audit logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@fintech.com or open an issue on GitHub.

## Authors

- **Qoseem Oluwaphemy** - Initial development

## Acknowledgments

- Express.js community
- React community
- PostgreSQL documentation
- Kafka documentation
