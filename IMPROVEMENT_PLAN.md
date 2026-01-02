# AIFAISS Improvement Plan

## Project Overview
**AIFAISS** is a Next.js 16 (React 19) web application for AI-powered invoice processing with multi-payment support (Solana/X-402, Stripe/fiat, MCP server integration).

---

## Priority 1: Critical Security & Architecture

### 1.1 Add User Authentication System
**Problem**: No user accounts - anyone can claim any payment by knowing a transaction signature.

**Implementation Steps**:
1. Create `/lib/auth/` directory with authentication logic
2. Add NextAuth.js or custom JWT authentication
3. Create user session management
4. Tie payments to authenticated users
5. Add protected route middleware

**Files to create**:
- `/lib/auth/auth.ts`
- `/lib/auth/session.ts`
- `/middleware.ts` (route protection)
- `/app/api/auth/[...nextauth]/route.ts`

### 1.2 Add Database Layer
**Problem**: No persistent storage for users, payments, invoices, or scan history.

**Implementation Steps**:
1. Add Prisma ORM with PostgreSQL/SQLite
2. Create schema for: Users, Payments, Scans, Invoices
3. Migrate Redis-only replay protection to database
4. Add database connection pooling

**Files to create**:
- `/prisma/schema.prisma`
- `/lib/db.ts`
- Database migration files

### 1.3 Fix Replay Attack Protection
**Problem**: Race condition in payment verification; signature checking and marking not atomic.

**Current code** (`lib/payment-gatekeeper.ts`):
```typescript
const isUsed = await redis.get(`tx:${signature}`);
if (isUsed) { return error; }
// Gap here where race condition can occur
await markPaymentUsed(signature);
```

**Fix**: Use Redis `SETNX` (set if not exists) for atomic check-and-set.

---

## Priority 2: Type Safety & Code Quality

### 2.1 Replace All `any` Types
**Problem**: 10+ uses of `any` type losing compile-time safety.

**Files affected**:
- `/lib/payment-gatekeeper.ts` - `gatekeepPayment(reqBody: any)`
- `/app/api/agent/create-invoice/route.ts` - `items.map((item: any))`
- `/app/api/(payment-verification)/stripe/verify-session/route.ts`
- `/utils/ai-scanner.ts`

**Implementation**:
1. Create `/types/` directory with shared interfaces
2. Define: `PaymentRequest`, `InvoiceItem`, `ScanResult`, `PaymentResult`
3. Replace all `any` with proper types

**Files to create**:
- `/types/payment.ts`
- `/types/invoice.ts`
- `/types/scan.ts`
- `/types/api.ts`

### 2.2 Remove Debug Console Logging
**Problem**: 20+ console.log statements in production code, some logging sensitive data.

**Files to clean**:
- `/lib/payment-gatekeeper.ts` (9 console statements)
- `/utils/ai-scanner.ts` (AI DEBUG statements)
- `/utils/x402-guard.ts` (logs wallet addresses)

**Solution**: Create environment-aware logger:
```typescript
// /lib/logger.ts
export const log = {
  debug: (msg: string) => process.env.NODE_ENV === 'development' && console.log(msg),
  error: (msg: string, err?: Error) => console.error(msg, err)
};
```

### 2.3 Consolidate Configuration
**Problem**: Prices and wallet addresses hardcoded in multiple files.

**Scattered in**:
- `/utils/x402-guard.ts` - `PRICE_PER_SCAN = 0.001`
- `/app/api/(solana-blinks)/actions/top-up/route.ts` - `PRICE_PER_SCAN = 0.001`
- `/app/[locale]/tools/invoice-extraction/ScannerClient.tsx` - `priceEur: 0.50`
- `/utils/solana-pricing.ts` - fallback price `216.5`

**Solution**: Create single config file:
```typescript
// /lib/config.ts
export const PRICING = {
  SCAN_PRICE_SOL: 0.001,
  SCAN_PRICE_EUR: 0.50,
  SOL_FALLBACK_EUR: 216.5,
};
```

---

## Priority 3: Input Validation & Error Handling

### 3.1 Add Input Validation
**Problem**: No validation on PDF generation or API inputs.

**Files affected**:
- `/app/api/agent/create-invoice/route.ts` - no field sanitization
- `/app/api/agent/scan/route.ts` - no base64 validation
- `/app/api/(landing)/contact/route.tsx` - minimal validation

**Solution**: Add Zod schemas:
```typescript
// /lib/validation/invoice.ts
import { z } from 'zod';

export const InvoiceItemSchema = z.object({
  description: z.string().min(1).max(500),
  quantity: z.number().positive().max(10000),
  unitPrice: z.number().positive().max(1000000),
});
```

### 3.2 Standardize Error Responses
**Problem**: Three different error formats across APIs.

**Current patterns**:
1. `{ success: false, error: string, status: number }`
2. `{ status: "error", code: number, message: string }`
3. `{ error: string }`

**Solution**: Create standard error handler:
```typescript
// /lib/api-response.ts
export interface ApiError {
  success: false;
  error: string;
  code: string;
  status: number;
}

export function apiError(message: string, code: string, status: number): ApiError {
  return { success: false, error: message, code, status };
}
```

### 3.3 Validate AI Scanner Output
**Problem**: Raw Claude output returned without field validation.

**Current code** (`utils/ai-scanner.ts`):
```typescript
const jsonMatch = text.match(/\{[\s\S]*\}/);
const data = JSON.parse(jsonMatch[0]);
return data; // No validation!
```

**Solution**: Add Zod validation for Claude response schema.

---

## Priority 4: Testing

### 4.1 Add Comprehensive Test Suite
**Problem**: Only 1 test file exists. <5% coverage.

**Tests to add**:

**Unit Tests**:
- `/lib/payment-gatekeeper.test.ts` - expand existing tests
- `/utils/ai-scanner.test.ts` - mock Claude responses
- `/utils/solana-pricing.test.ts` - price calculations
- `/lib/config.test.ts` - configuration loading

**API Integration Tests**:
- `/app/api/agent/scan/route.test.ts`
- `/app/api/agent/create-invoice/route.test.ts`
- `/app/api/(payment-verification)/**/*.test.ts`

**E2E Tests**:
- Full payment flow tests
- Invoice generation flow

### 4.2 Add Test Infrastructure
**Files to create**:
- `/vitest.config.ts` - test configuration
- `/tests/setup.ts` - test setup/teardown
- `/tests/mocks/` - shared mocks for Claude, Stripe, Solana
- `/.github/workflows/test.yml` - CI test pipeline

---

## Priority 5: Documentation

### 5.1 Create API Documentation
**Files to create**:
- `/docs/api/README.md` - API overview
- `/docs/api/endpoints.md` - endpoint reference
- OpenAPI spec generation

### 5.2 Add Setup Guide
**Update**:
- `/README.md` - proper setup instructions
- Add `.env.example` with all required variables

**Required env vars to document**:
```
REDIS_URL=
STRIPE_PRIVATE_KEY=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
CLAUDE_API_KEY=
NEXT_PUBLIC_SOLANA_WALLET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### 5.3 Create Architecture Diagram
**Document**:
- Payment flow (Solana vs Stripe)
- Invoice scanning flow
- MCP server integration

---

## Priority 6: Code Organization

### 6.1 Extract Email Service
**Problem**: SMTP config duplicated in multiple files.

**Files affected**:
- `/app/api/(landing)/contact/route.tsx`
- `/app/api/(landing)/quickscan/route.ts`

**Solution**: Create `/lib/email.ts`:
```typescript
export function createMailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}
```

### 6.2 Consolidate Payment Verification
**Problem**: Three different payment verification patterns.

**Current files**:
- `/lib/payment-gatekeeper.ts`
- `/utils/x402-guard.ts`
- `/app/api/(payment-verification)/stripe/verify-session/route.ts`

**Solution**: Unify into single payment service with strategy pattern.

### 6.3 Refactor Scanner Client State
**Problem**: Too many `useState` calls in `ScannerClient.tsx`.

**Current**: 8+ independent useState calls.

**Solution**: Use `useReducer` or create custom hook `useScannerState()`.

---

## Priority 7: Performance & Operations

### 7.1 Add Environment Validation at Startup
**Create**: `/lib/env-validation.ts`
```typescript
export function validateEnv() {
  const required = [
    'REDIS_URL',
    'STRIPE_PRIVATE_KEY',
    'CLAUDE_API_KEY',
    'NEXT_PUBLIC_SOLANA_WALLET',
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
}
```

### 7.2 Add Health Checks
**Create**: `/app/api/health/route.ts`
- Check Redis connection
- Check Stripe API
- Check Solana RPC

### 7.3 Add Error Monitoring
**Integrate**: Sentry or similar
- Track API errors
- Track payment failures
- Track AI extraction failures

### 7.4 Use Multipart Upload Instead of Base64
**Problem**: Base64 is 33% larger than binary.

**Current**: `{ invoiceBase64: string }`

**Solution**: Accept `multipart/form-data` with actual file upload.

---

## Implementation Order

| Phase | Items | Effort |
|-------|-------|--------|
| **Phase 1** | 1.1, 1.2, 1.3 (Auth, DB, Security) | High |
| **Phase 2** | 2.1, 2.2, 2.3 (Types, Logging, Config) | Medium |
| **Phase 3** | 3.1, 3.2, 3.3 (Validation, Errors) | Medium |
| **Phase 4** | 4.1, 4.2 (Testing) | High |
| **Phase 5** | 5.1, 5.2, 5.3 (Documentation) | Low |
| **Phase 6** | 6.1, 6.2, 6.3 (Refactoring) | Medium |
| **Phase 7** | 7.1, 7.2, 7.3, 7.4 (Operations) | Medium |

---

## Quick Wins (Can Do Immediately)

1. Remove debug console.log statements
2. Create `.env.example` file
3. Add type interfaces for existing `any` types
4. Create centralized config file for prices
5. Add environment validation at startup
6. Extract email service to shared module
7. Add health check endpoint

---

## Files to Create Summary

```
/lib/
  auth/
    auth.ts
    session.ts
  config.ts
  logger.ts
  email.ts
  env-validation.ts
  api-response.ts

/types/
  payment.ts
  invoice.ts
  scan.ts
  api.ts

/lib/validation/
  invoice.ts
  payment.ts
  contact.ts

/prisma/
  schema.prisma

/tests/
  setup.ts
  mocks/
    claude.ts
    stripe.ts
    solana.ts

/docs/
  api/
    README.md
    endpoints.md
  architecture.md

/.env.example
/.github/workflows/test.yml
```
