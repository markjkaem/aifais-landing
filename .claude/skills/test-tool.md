# /test-tool - Quick API Endpoint Tester

Test any AIFAISS API endpoint with DEV_BYPASS during development.

## Usage

```
/test-tool <endpoint> [json-data]
```

## Examples

```bash
# Test KVK search
/test-tool kvk-search {"query": "Coolblue", "type": "naam"}

# Test CV screener with file
/test-tool cv-screener {"cvText": "Senior developer with 5 years experience..."}

# Test invoice scanner
/test-tool scan {"base64": "..."}
```

## Instructions

When this skill is invoked:

1. **Parse the endpoint** from the first argument
2. **Map to full API path**:
   - `kvk-search` → `/api/v1/business/kvk-search`
   - `scan` → `/api/v1/finance/scan`
   - `create-invoice` → `/api/v1/finance/create-invoice`
   - `generate-quote` → `/api/v1/finance/generate-quote`
   - `check-contract` → `/api/v1/legal/check-contract`
   - `generate-terms` → `/api/v1/legal/generate-terms`
   - `cv-screener` → `/api/v1/hr/cv-screener`
   - `interview-questions` → `/api/v1/hr/interview-questions`
   - `social-planner` → `/api/v1/marketing/social-planner`
   - `lead-scorer` → `/api/v1/sales/lead-scorer`
   - `pitch-deck` → `/api/v1/sales/pitch-deck`

3. **Add DEV_BYPASS** automatically to paid endpoints:
   ```json
   {"signature": "DEV_BYPASS", ...userData}
   ```

4. **Execute with curl**:
   ```bash
   curl -X POST http://localhost:3000/api/v1/[category]/[endpoint] \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:3000" \
     -d '{"signature": "DEV_BYPASS", ...}'
   ```

5. **Verify the response**:
   - Check for `success: true`
   - Display relevant data fields
   - Report any errors clearly

6. **If no data provided**, show example payload for that endpoint

## Verification (Boris Principle)

After testing, ALWAYS verify:
- Response status code is 200
- Response contains expected fields
- No error messages in response
- If testing file upload, check file was processed

## Quick Reference

| Endpoint | Category | Paid | Required Fields |
|----------|----------|------|-----------------|
| kvk-search | business | Yes | query, type |
| scan | finance | Yes | base64 (PDF) |
| create-invoice | finance | No | clientName, items[] |
| generate-quote | finance | No | clientName, items[] |
| check-contract | legal | Yes | contractText |
| generate-terms | legal | Yes | companyName, companyType |
| cv-screener | hr | Yes | cvText, jobDescription |
| interview-questions | hr | Yes | jobTitle, level |
| social-planner | marketing | Yes | business, goals[] |
| lead-scorer | sales | Yes | leadInfo |
| pitch-deck | sales | Yes | companyName, problem |
