#!/bin/bash

##############################################################################
# Fintech Platform - Database Seed Script
# 
# This script seeds the database with initial demo data for testing and
# development purposes.
#
# Usage: ./scripts/seed-data.sh
##############################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-fintech_db}"
DB_USER="${DB_USER:-fintech_user}"
DB_PASSWORD="${DB_PASSWORD:-fintech_password}"

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Fintech Platform - Database Seed${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# Wait for database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" >/dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 1
done
echo -e "${GREEN}✓ Database is ready${NC}"
echo ""

# Seed sample users
echo -e "${YELLOW}Seeding users...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
INSERT INTO users (email, username, password_hash, kyc_status, created_at) VALUES
  ('john.doe@example.com', 'johndoe', 'hashed_password_1', 'verified', NOW()),
  ('jane.smith@example.com', 'janesmith', 'hashed_password_2', 'verified', NOW()),
  ('bob.wilson@example.com', 'bobwilson', 'hashed_password_3', 'pending', NOW())
ON CONFLICT (email) DO NOTHING;
EOF
echo -e "${GREEN}✓ Users seeded${NC}"

# Seed sample wallets
echo -e "${YELLOW}Seeding wallets...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
INSERT INTO wallets (user_id, currency, balance, status, created_at) VALUES
  (1, 'USD', 10000.00, 'active', NOW()),
  (1, 'EUR', 5000.00, 'active', NOW()),
  (2, 'USD', 25000.00, 'active', NOW()),
  (2, 'GBP', 15000.00, 'active', NOW()),
  (3, 'USD', 1000.00, 'active', NOW())
ON CONFLICT DO NOTHING;
EOF
echo -e "${GREEN}✓ Wallets seeded${NC}"

# Seed sample transactions
echo -e "${YELLOW}Seeding transactions...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
INSERT INTO transactions (from_wallet_id, to_wallet_id, amount, transaction_type, status, created_at) VALUES
  (1, 3, 500.00, 'transfer', 'completed', NOW() - INTERVAL '1 day'),
  (3, 4, 1000.00, 'transfer', 'completed', NOW() - INTERVAL '12 hours'),
  (2, 1, 250.00, 'transfer', 'pending', NOW())
ON CONFLICT DO NOTHING;
EOF
echo -e "${GREEN}✓ Transactions seeded${NC}"

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Database seed completed successfully!${NC}"
echo -e "${GREEN}================================================${NC}"
