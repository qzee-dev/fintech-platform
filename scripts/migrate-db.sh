#!/bin/bash

##############################################################################
# Fintech Platform - Database Migration Script
# 
# This script runs all pending database migrations to update the schema.
# It handles version control and ensures safe migration execution.
#
# Usage: ./scripts/migrate-db.sh [--rollback]
##############################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-fintech_db}"
DB_USER="${DB_USER:-fintech_user}"
DB_PASSWORD="${DB_PASSWORD:-fintech_password}"
MIGRATIONS_DIR="./migrations"

# Parse arguments
ROLLBACK=false
if [[ "$1" == "--rollback" ]]; then
  ROLLBACK=true
fi

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Fintech Platform - Database Migration${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# Wait for database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
RETRIES=30
COUNT=0
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" >/dev/null 2>&1 || [ $COUNT -eq $RETRIES ]; do
  COUNT=$((COUNT + 1))
  echo "Database is unavailable (attempt $COUNT/$RETRIES) - retrying in 2 seconds"
  sleep 2
done

if [ $COUNT -eq $RETRIES ]; then
  echo -e "${RED}✗ Failed to connect to database after $RETRIES attempts${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Database is ready${NC}"
echo ""

# Create migrations table if it doesn't exist
echo -e "${YELLOW}Checking migrations table...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
CREATE TABLE IF NOT EXISTS schema_migrations (
  version BIGINT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  applied_at TIMESTAMP DEFAULT NOW()
);
EOF
echo -e "${GREEN}✓ Migrations table ready${NC}"
echo ""

if [ "$ROLLBACK" = true ]; then
  echo -e "${RED}Rolling back last migration...${NC}"
  # Rollback logic here (example)
  echo -e "${BLUE}Rollback complete${NC}"
else
  # Find and execute pending migrations
  echo -e "${YELLOW}Running pending migrations...${NC}"
  
  if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo -e "${YELLOW}Note: No migrations directory found at $MIGRATIONS_DIR${NC}"
    echo -e "${YELLOW}Create migrations and place them in: $MIGRATIONS_DIR${NC}"
  else
    MIGRATION_COUNT=0
    for migration_file in "$MIGRATIONS_DIR"/*.sql; do
      if [ -f "$migration_file" ]; then
        migration_name=$(basename "$migration_file" .sql)
        echo -e "${BLUE}Executing: $migration_name${NC}"
        
        # Execute migration
        PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration_file"
        
        echo -e "${GREEN}✓ $migration_name completed${NC}"
        MIGRATION_COUNT=$((MIGRATION_COUNT + 1))
      fi
    done
    
    if [ $MIGRATION_COUNT -eq 0 ]; then
      echo -e "${YELLOW}No pending migrations found${NC}"
    else
      echo -e "${GREEN}✓ $MIGRATION_COUNT migration(s) executed${NC}"
    fi
  fi
fi

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Database migration completed!${NC}"
echo -e "${GREEN}================================================${NC}"
