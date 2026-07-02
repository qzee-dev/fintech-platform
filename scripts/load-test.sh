#!/bin/bash

##############################################################################
# Fintech Platform - Load Testing Script
# 
# This script performs load testing against the fintech platform services
# using Apache Bench (ab) or similar tools. It tests API endpoints with
# configurable concurrency and request counts.
#
# Requirements: apache2-utils (for 'ab' command)
# Usage: ./scripts/load-test.sh [--concurrent N] [--requests N] [--help]
##############################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default configuration
API_BASE_URL="${API_BASE_URL:-http://localhost:3000}"
CONCURRENT_USERS="${CONCURRENT_USERS:-10}"
TOTAL_REQUESTS="${TOTAL_REQUESTS:-1000}"
RESULTS_DIR="./load-test-results"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_FILE="$RESULTS_DIR/load-test-${TIMESTAMP}.txt"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --concurrent)
      CONCURRENT_USERS="$2"
      shift 2
      ;;
    --requests)
      TOTAL_REQUESTS="$2"
      shift 2
      ;;
    --url)
      API_BASE_URL="$2"
      shift 2
      ;;
    --help)
      echo "Load Testing Script"
      echo ""
      echo "Usage: ./scripts/load-test.sh [options]"
      echo ""
      echo "Options:"
      echo "  --concurrent N      Number of concurrent users (default: 10)"
      echo "  --requests N        Total number of requests (default: 1000)"
      echo "  --url URL           API base URL (default: http://localhost:3000)"
      echo "  --help              Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Fintech Platform - Load Testing${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}Configuration:${NC}"
echo -e "  API URL: $API_BASE_URL"
echo -e "  Concurrent Users: $CONCURRENT_USERS"
echo -e "  Total Requests: $TOTAL_REQUESTS"
echo ""

# Create results directory
mkdir -p "$RESULTS_DIR"

# Check if apache bench is available
if ! command -v ab &> /dev/null; then
  echo -e "${RED}✗ Apache Bench (ab) is not installed${NC}"
  echo -e "${YELLOW}Install it using: sudo apt-get install apache2-utils${NC}"
  exit 1
fi

# Test endpoints
ENDPOINTS=(
  "/api/health"
  "/api/users/profile"
  "/api/wallets"
  "/api/transactions"
)

echo -e "${YELLOW}Starting load tests...${NC}"
echo ""

for endpoint in "${ENDPOINTS[@]}"; do
  url="${API_BASE_URL}${endpoint}"
  echo -e "${BLUE}Testing: $endpoint${NC}"
  
  # Run Apache Bench
  ab -n "$TOTAL_REQUESTS" -c "$CONCURRENT_USERS" -g "$RESULTS_DIR/data-${endpoint//\//-}-${TIMESTAMP}.tsv" "$url" 2>&1 | tee -a "$REPORT_FILE"
  
  echo -e "${GREEN}✓ $endpoint completed${NC}"
  echo ""
done

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Load testing completed!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}Report saved to: $REPORT_FILE${NC}"
echo -e "${BLUE}Results directory: $RESULTS_DIR${NC}"
echo ""
echo -e "${YELLOW}To view results, use:${NC}"
echo -e "  cat $REPORT_FILE"
