---
description: How to run API tests for AIFAIS tools
---

## Overview
The `scripts/tests/` folder contains integration tests for all API endpoints. Tests use DEV_BYPASS for paid tools.

## Running Tests

// turbo-all

### Run all tests:
```bash
node scripts/test-all.js
```

### Run individual tests:
```bash
node scripts/tests/test-invoice-scanner.js
node scripts/tests/test-contract-checker.js
node scripts/tests/test-quote-generator.js
node scripts/tests/test-terms-generator.js
```

## Adding a New Test

1. Create `scripts/tests/test-[tool-name].js` using existing test as template
2. Add mock files to `scripts/mocks/` if needed
3. Add the test to the `tests` array in `scripts/test-all.js`
4. Update `scripts/README.md`

## Key Points
- Tests require `bun dev` running on `localhost:3000`
- Use `signature: 'DEV_BYPASS'` for paid tools to skip Solana verification
- Output PDFs are saved to `scripts/output/`
- Mock files go in `scripts/mocks/`

## Vitest Unit Tests
For unit tests on lib/hooks code:
```bash
npm test
```
Tests are in files like `lib/payment-gatekeeper.test.ts` and `lib/tools/createToolHandler.test.ts`.
