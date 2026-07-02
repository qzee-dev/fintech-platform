# End-to-End Tests

End-to-end tests validate complete user workflows and business scenarios.

## Purpose

- Test complete user journeys
- Validate business workflows
- Test UI/API interactions
- Verify data consistency across services
- Test real-world scenarios

## Tools

### Cypress (Recommended)
- Interactive test runner
- Good debugging experience
- Fast execution

### Playwright (Alternative)
- Cross-browser support
- Excellent for CI/CD
- Better performance

## Scenarios

### User Registration & KYC
```
1. User registers account
2. Completes KYC verification
3. Account activated
4. Can access platform
```

### Money Transfer
```
1. User logs in
2. Views wallet balance
3. Initiates transfer
4. Confirms transaction
5. Receives confirmation
6. Balance updated
```

### Payment Processing
```
1. User initiates payment
2. Selects payment method
3. Completes payment
4. Transaction recorded
5. Confirmation sent
```

## Running Tests

### All E2E Tests
```bash
npm run test:e2e
```

### Specific Test Suite
```bash
npm run test:e2e -- --spec tests/e2e/auth.spec.js
```

### Interactive Mode
```bash
npm run test:e2e:open
```

### Headless Mode (CI)
```bash
npm run test:e2e:headless
```

## Best Practices

1. **User-Centric**: Write tests from user perspective
2. **Clear Naming**: Use descriptive test names
3. **Independent Tests**: Each test should be standalone
4. **Wait for Elements**: Use proper waits, not hard sleeps
5. **Data Cleanup**: Reset test data between runs
6. **Error Handling**: Test error scenarios
7. **Visual Testing**: Capture screenshots on failures

## Example Test

```javascript
describe('User Registration Flow', () => {
  it('should complete registration and verify email', () => {
    cy.visit('/')
    cy.contains('Sign Up').click()
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('SecurePass123')
    cy.get('button[type="submit"]').click()
    cy.contains('Please verify your email').should('be.visible')
  })
})
```

## Troubleshooting

- **Element Not Found**: Check selectors and wait conditions
- **Timeout**: Increase wait times or check app responsiveness
- **Flaky Tests**: Review timing and async operations
- **Screenshot Failures**: Run in headless mode for consistency
