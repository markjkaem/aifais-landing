# Check API Health - Endpoint Validator

Verify all AIFAIS API endpoints are responding correctly.

## Usage

```
/check-api-health
/check-api-health --production
/check-api-health --local
```

## Workflow

### Step 1: Determine Environment

| Flag | Base URL |
|------|----------|
| `--production` | `https://aifais.com` |
| `--local` | `http://localhost:3000` |
| (default) | Production |

### Step 2: Test Core Endpoints

Test these critical endpoints:

```
## Public Endpoints (GET)
- /api/mcp                    → MCP server definition
- /api/blinks/actions.json    → Solana Actions manifest

## Payment Verification (GET)
- /api/payments/verify-solana?signature=test → Should return error (invalid sig)
- /api/payments/verify-stripe?session_id=test → Should return error (invalid session)

## Tool Endpoints (POST - expect 400/402 without proper input)
- /api/v1/finance/scan
- /api/v1/finance/create-invoice
- /api/v1/finance/generate-quote
- /api/v1/legal/check-contract
- /api/v1/legal/generate-terms
- /api/v1/hr/cv-screener
- /api/v1/hr/interview-questions
- /api/v1/marketing/social-planner
- /api/v1/sales/lead-scorer
- /api/v1/sales/pitch-deck
- /api/v1/business/kvk-search
```

### Step 3: Expected Responses

| Endpoint Type | Expected Status | Pass If |
|--------------|-----------------|---------|
| GET public | 200 | Returns valid JSON |
| GET verify | 400 | Returns error (expected) |
| POST tools (no body) | 400 | Schema validation error |
| POST paid tools (valid body) | 402 | Payment required |

**A 500 error always indicates a problem!**

### Step 4: Health Check Commands

Using `curl` via Bash:

```bash
# Test MCP endpoint
curl -s -o /dev/null -w "%{http_code}" https://aifais.com/api/mcp

# Test tool endpoint (expect 400)
curl -s -o /dev/null -w "%{http_code}" -X POST https://aifais.com/api/v1/finance/scan

# Full response check
curl -s https://aifais.com/api/mcp | head -20
```

### Step 5: Generate Report

```
## 🏥 API Health Report

**Environment:** Production (https://aifais.com)
**Timestamp:** 2024-01-15 14:30:00

### Summary
- ✅ Healthy: 12/15 endpoints
- ⚠️ Degraded: 2/15 endpoints
- ❌ Down: 1/15 endpoints

### Endpoint Status

| Endpoint | Status | Response Time | Notes |
|----------|--------|---------------|-------|
| /api/mcp | ✅ 200 | 45ms | OK |
| /api/v1/finance/scan | ✅ 400 | 120ms | Schema error (expected) |
| /api/v1/hr/cv-screener | ❌ 500 | 2500ms | Internal server error |

### Issues Found
1. **CV Screener returning 500**
   - Endpoint: /api/v1/hr/cv-screener
   - Error: Internal server error
   - Action: Check Sentry for details

### Recommendations
- [ ] Investigate CV Screener 500 error
- [ ] All other endpoints healthy
```

## Quick Health Check

For a fast check, test only critical endpoints:

```bash
# One-liner health check
curl -sf https://aifais.com/api/mcp > /dev/null && echo "✅ API OK" || echo "❌ API DOWN"
```

## Integration

This check should run:
- Before production deployments
- After deployments (smoke test)
- On-demand when issues are reported
- In CI/CD pipeline

## Troubleshooting

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | Success | All good |
| 400 | Bad request | Expected for empty POST |
| 402 | Payment required | Expected for paid tools |
| 404 | Not found | Route missing - check deployment |
| 500 | Server error | Check logs, Sentry |
| 502/503 | Gateway error | Vercel/infra issue |
| Timeout | Slow response | Check performance |
