# Integration Tests

Integration tests validate the interaction between services, API endpoints, and database operations.

## Purpose

- Test service-to-service communication
- Validate API endpoints and responses
- Test database operations and transactions
- Verify error handling and edge cases

## Structure

```
integration/
├── api/              # API endpoint tests
├── services/         # Service interaction tests
├── database/         # Database operation tests
└── workflows/        # Complete workflow tests
```

## Running Tests

### All Integration Tests
```bash
make test
```

### Specific Service Tests
```bash
make test-service SERVICE=user-service
```

### With Coverage
```bash
npm run test:integration:coverage
```

## Test Framework

- **Framework**: Jest
- **HTTP Client**: Supertest
- **Database**: Test PostgreSQL instance
- **Assertions**: Jest matchers

## Example Test

```javascript
describe('User Service', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'SecurePass123'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });
});
```

## Best Practices

1. **Use Test Database**: Always use a separate test database
2. **Clean Up**: Reset database state between tests
3. **Mock External Services**: Mock external API calls
4. **Test Edge Cases**: Include error scenarios
5. **Clear Assertions**: Use descriptive test names
6. **Parallel Execution**: Mark slow tests as serial if needed

## Troubleshooting

- **Tests failing**: Check database is running and migrations applied
- **Timeout errors**: Increase Jest timeout or check service health
- **Flaky tests**: Review async operations and timing
