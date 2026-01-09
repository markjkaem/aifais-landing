# /verify - Verification Suite (Boris Principle)

Run comprehensive verification after making changes. Based on Boris's key insight: "Claude performs much better when it can verify its own work."

## Usage

```
/verify              # Run all verifications
/verify build        # Only build verification
/verify types        # Only TypeScript check
/verify tests        # Only run tests
/verify api          # Test API endpoints
```

## Instructions

When this skill is invoked, run verifications in this order:

### 1. TypeScript Check (Always First)
```bash
bunx tsc --noEmit
```
- Must pass with 0 errors
- If errors found, list them and stop

### 2. Lint Check
```bash
bun run lint
```
- Should pass or show warnings only
- Fix any errors before proceeding

### 3. Unit Tests
```bash
bun test
```
- All tests must pass
- Report failed tests with file:line references

### 4. Build Verification
```bash
bun run build
```
- Must complete without errors
- Check for any build warnings

### 5. API Smoke Test (if local server running)
Test critical endpoints with DEV_BYPASS:
- GET /api/mcp (should return MCP definition)
- POST /api/v1/finance/create-invoice with minimal data

## Verification Report Format

Output a summary like:
```
## Verification Report

| Check | Status | Details |
|-------|--------|---------|
| TypeScript | ✅ PASS | 0 errors |
| Lint | ✅ PASS | 2 warnings |
| Tests | ✅ PASS | 15/15 passed |
| Build | ✅ PASS | Completed in 45s |

All verifications passed!
```

Or if failures:
```
## Verification Report

| Check | Status | Details |
|-------|--------|---------|
| TypeScript | ❌ FAIL | 3 errors |
| Lint | ⏸️ SKIP | Blocked by TS errors |
| Tests | ⏸️ SKIP | Blocked by TS errors |
| Build | ⏸️ SKIP | Blocked by TS errors |

### TypeScript Errors:
1. lib/tools/types.ts:45 - Type 'string' is not assignable...
2. ...

Fix these errors before proceeding.
```

## When to Use

- After implementing a new feature
- After refactoring code
- Before committing changes
- Before creating a PR
- After fixing bugs

## Boris's Verification Wisdom

> "Different domains need different verification methods."

For AIFAISS:
- **Code changes** → TypeScript + Tests + Build
- **API changes** → Integration tests + Manual curl test
- **UI changes** → Build + Browser screenshot
- **Payment changes** → Test mode verification + Sentry check
