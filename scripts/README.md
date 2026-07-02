# Scripts Directory

This directory contains utility scripts for database management, testing, and deployment operations.

## Overview

All scripts include error handling, colored output for better readability, and comprehensive logging.

## Available Scripts

### 1. `seed-data.sh` - Database Seeding
**Purpose**: Seeds the database with initial demo data for development and testing.

**Usage**:
```bash
./scripts/seed-data.sh
```

**Environment Variables**:
```bash
DB_HOST=postgres
DB_PORT=5432
DB_NAME=fintech_db
DB_USER=fintech_user
DB_PASSWORD=fintech_password
```

**What it does**:
- Waits for database to be ready
- Creates sample users with different KYC statuses
- Seeds wallet accounts with various currencies
- Populates transaction history
- Uses INSERT...ON CONFLICT for idempotent operations

**Example**:
```bash
# Seed with default settings
./scripts/seed-data.sh

# Seed with custom database
DB_HOST=prod-db DB_NAME=fintech_prod ./scripts/seed-data.sh
```

---

### 2. `migrate-db.sh` - Database Migrations
**Purpose**: Runs database schema migrations and version control.

**Usage**:
```bash
./scripts/migrate-db.sh [--rollback]
```

**Options**:
- `--rollback`: Rollback the last applied migration

**Environment Variables**:
```bash
DB_HOST=postgres
DB_PORT=5432
DB_NAME=fintech_db
DB_USER=fintech_user
DB_PASSWORD=fintech_password
```

**What it does**:
- Waits for database availability with retry logic
- Creates/validates migrations tracking table
- Executes all pending SQL migration files
- Supports rollback operations
- Provides detailed migration logs

**Migration Files**:
Place migration files in `./migrations/` directory with names like:
```
migrations/
├── 001_initial_schema.sql
├── 002_add_transactions_table.sql
├── 003_add_indexes.sql
└── ...
```

**Example**:
```bash
# Run pending migrations
./scripts/migrate-db.sh

# Rollback last migration
./scripts/migrate-db.sh --rollback

# Migrate production database
DB_HOST=prod-db DB_NAME=fintech_prod ./scripts/migrate-db.sh
```

---

### 3. `load-test.sh` - Load Testing
**Purpose**: Performs load and performance testing against API endpoints.

**Usage**:
```bash
./scripts/load-test.sh [--concurrent N] [--requests N] [--url URL] [--help]
```

**Options**:
- `--concurrent N`: Number of concurrent users (default: 10)
- `--requests N`: Total number of requests (default: 1000)
- `--url URL`: API base URL (default: http://localhost:3000)
- `--help`: Display help message

**Environment Variables**:
```bash
API_BASE_URL=http://localhost:3000
CONCURRENT_USERS=10
TOTAL_REQUESTS=1000
```

**What it does**:
- Checks for Apache Bench (ab) availability
- Runs load tests against multiple API endpoints
- Generates test reports with timestamps
- Saves results to `load-test-results/` directory
- Provides performance metrics and statistics

**Endpoints tested**:
- `/api/health` - Health check
- `/api/users/profile` - User profile
- `/api/wallets` - Wallet operations
- `/api/transactions` - Transaction history

**Requirements**:
```bash
# Install Apache Bench (Debian/Ubuntu)
sudo apt-get install apache2-utils

# Install Apache Bench (macOS)
brew install httpd
```

**Example**:
```bash
# Basic load test
./scripts/load-test.sh

# Custom concurrency and request count
./scripts/load-test.sh --concurrent 50 --requests 5000

# Test against production
./scripts/load-test.sh --url https://api.fintech.production --concurrent 100

# Test with multiple configurations
for users in 10 50 100 500; do
  ./scripts/load-test.sh --concurrent $users
done
```

**Report Output**:
Results are saved to: `load-test-results/load-test-YYYYMMDD_HHMMSS.txt`

---

## Running via Make

All scripts can be triggered through the Makefile:

```bash
# Migrate database
make migrate

# Seed demo data
make seed

# Run load tests
make load-test

# Combined operations
make clean migrate seed start
```

## Script Features

### Common Features
- ✅ **Error handling**: `set -e` to exit on errors
- ✅ **Colored output**: Green (success), Yellow (info), Red (errors)
- ✅ **Retry logic**: Automatic retries for database connectivity
- ✅ **Logging**: Comprehensive operation logs
- ✅ **Idempotent**: Safe to run multiple times

### Security
- Variables with defaults for sensitive data
- Uses environment variables for credentials
- No hardcoded passwords or secrets
- Supports secure credential management

## Troubleshooting

### Database Connection Issues
```bash
# Check database is running
docker ps | grep postgres

# Test connection manually
PGPASSWORD=password psql -h localhost -d fintech_db -U fintech_user
```

### Migration Failures
```bash
# Check migration files exist
ls -la migrations/

# Verify database permissions
./scripts/migrate-db.sh

# Check schema version
PGPASSWORD=password psql -h localhost -d fintech_db -U fintech_user -c "SELECT * FROM schema_migrations;"
```

### Load Test Issues
```bash
# Verify Apache Bench is installed
which ab

# Test API connectivity
curl http://localhost:3000/api/health

# Run with verbose output
./scripts/load-test.sh --url http://localhost:3000 --concurrent 5 --requests 100
```

## Best Practices

1. **Always test in development first**: Run scripts in dev environment before production
2. **Backup before migrations**: Create database backups before running migrations
3. **Review migration files**: Understand what each migration does
4. **Monitor during load tests**: Watch system resources during performance testing
5. **Version control**: Keep scripts in version control with other code
6. **Documentation**: Update this README when adding new scripts

## Contributing

When adding new scripts:
1. Follow the naming convention: `<action>-<target>.sh`
2. Include comprehensive comments and help text
3. Add error handling and validation
4. Use colored output for clarity
5. Update this README with usage examples
6. Make scripts executable: `chmod +x scripts/<script>.sh`

## Related Documentation

- See `Makefile` for command shortcuts
- See `SETUP.md` for initial setup instructions
- See `README.md` for project overview
