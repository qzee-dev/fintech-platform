# 🏦 Fintech Payment Platform

A production-grade, scalable fintech payment platform built with event-driven architecture, featuring double-entry ledger integrity, idempotent payments, and NIBSS simulation.

## Architecture Overview

```
Client App (React)
    ↓
API Gateway (Kong/Nginx)
    ↓
Transaction Service
    ↓
Kafka Topics
    ↓
Ledger Service (Medici)
    ↓
NIBSS Mock API
    ↓
Notification Service
    ↓
User (SMS/Email)
```

## Key Features

✅ **Microservices Architecture** - 7 independent services
✅ **Event-Driven Processing** - Kafka for async communication
✅ **Financial Ledger** - Double-entry bookkeeping with Medici
✅ **Idempotent Payments** - Guaranteed exactly-once delivery
✅ **Fraud Detection** - Rule-based fraud engine
✅ **High Availability** - Kubernetes deployment ready
✅ **Observability** - Prometheus, Grafana, ELK stack
✅ **Bank Integration** - NIBSS mock simulator
✅ **Modern UI** - React frontend with real-time updates

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Kubernetes (optional)
- Terraform (optional)

### Local Development

```bash
# Clone and navigate
git clone https://github.com/qzee-dev/fintech-platform.git
cd fintech-platform

# Start all services
docker-compose up -d

# Initialize database
./scripts/migrate-db.sh

# Seed demo data
./scripts/seed-data.sh

# Access UI
open http://localhost:3000
```

### Default Credentials
- Email: `demo@fintech.com`
- Password: `Demo@123456`
- Test Account: `1234567890`

## Services

| Service | Port | Purpose |
|---------|------|----------|
| User Service | 3001 | Authentication & profiles |
| Wallet Service | 3002 | Account management |
| Transaction Service | 3003 | Transaction processing |
| Payment Service | 3004 | External payments |
| Fraud Service | 3005 | Fraud detection |
| Notification Service | 3006 | SMS/Email alerts |
| API Gateway | 3000 | Request routing |

## API Documentation

See `/docs/api-specs` for detailed endpoint documentation.

## Deployment

### Docker
```bash
make build-all
make deploy-docker
```

### Kubernetes
```bash
make deploy-k8s
```

### Terraform (AWS)
```bash
cd infra/environments/prod
terraform plan
terraform apply
```

## Documentation

- [Architecture Design](docs/architecture.md)
- [System Design Diagram](docs/system-design.png)
- [API Specifications](docs/api-specs/)
- [Deployment Guide](docs/deployment.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT
