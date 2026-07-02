# Testing Guide

This directory contains all test suites for the Fintech Platform.

## Directory Structure

```
tests/
├── integration/     # Integration tests for services and APIs
├── load/           # Load and performance testing scripts
├── e2e/            # End-to-end tests covering complete workflows
└── README.md       # This file
```

## Integration Tests

Integration tests validate the interaction between services and their integration with external systems.

- **Location**: `tests/integration/`
- **Purpose**: Test service-to-service communication and database interactions
- **Tools**: Jest, Supertest
- **Run**: `make test` or `npm run test:integration`

## Load Tests

Load tests evaluate system performance and scalability under stress conditions.

- **Location**: `tests/load/`
- **Purpose**: Performance testing, stress testing, and benchmarking
- **Tools**: Apache Bench, k6, or custom load testing scripts
- **Run**: `make load-test` or `./scripts/load-test.sh`

## E2E Tests

End-to-end tests validate complete user workflows from start to finish.

- **Location**: `tests/e2e/`
- **Purpose**: Test complete business flows and user scenarios
- **Tools**: Cypress, Playwright, or Selenium
- **Run**: `npm run test:e2e`

## Running Tests

### All Tests
```bash
make test
```

### Specific Test Suite
```bash
make test-service SERVICE=user-service
```

### Load Tests
```bash
make load-test
```

### With Coverage
```bash
npm run test:coverage
```

## Test Configuration

Configure test behavior through environment variables:

```bash
# Set database for tests
export DB_TEST_URL="postgresql://user:pass@localhost/test_db"

# Set API endpoint
export API_URL="http://localhost:3000"

# Set concurrency level for load tests
export CONCURRENT_USERS=50
```

## CI/CD Integration

Tests are automatically run on every commit through GitHub Actions. See `.github/workflows/` for configuration.

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass locally
3. Maintain or improve code coverage
4. Document test cases and scenarios

## Troubleshooting

- **Tests failing on CI but passing locally**: Check environment variables and database state
- **Flaky tests**: Review timing and external service dependencies
- **Performance degradation**: Run load tests to establish baseline metrics
