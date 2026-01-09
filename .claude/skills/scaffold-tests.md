# /scaffold-tests - Generate Test Files for API Routes

Generate unit tests for API routes based on the template in `templates/api-route.test.template.ts`.

## Usage

```
/scaffold-tests <route-path>           # Generate test for specific route
/scaffold-tests all                    # Generate tests for all untested routes
/scaffold-tests --check                # List routes missing tests
```

## Examples

```bash
/scaffold-tests finance/create-invoice
/scaffold-tests hr/cv-screener
/scaffold-tests all
```

## Instructions

When this skill is invoked:

### 1. For specific route (`/scaffold-tests <route-path>`)

1. **Read the API route file:**
   ```
   app/api/v1/{route-path}/route.ts
   ```

2. **Extract from the route:**
   - Schema definition (Zod schema fields)
   - Whether it's paid (`pricing` property in `createToolHandler`)
   - Required fields vs optional fields

3. **Generate test file** at:
   ```
   app/api/v1/{route-path}/route.test.ts
   ```

4. **Fill in template placeholders:**
   - `{{ROUTE_PATH}}` → The route path (e.g., `finance/create-invoice`)
   - `{{VALID_INPUT}}` → Object with all required fields and valid values
   - `{{INVALID_INPUT}}` → Object missing required fields or with invalid types
   - `{{IS_PAID}}` → `true` if route has `pricing` config, `false` otherwise

5. **Verify the test:**
   ```bash
   bun test app/api/v1/{route-path}/route.test.ts
   ```

### 2. For all untested routes (`/scaffold-tests all`)

1. **Find all API routes:**
   ```bash
   find app/api/v1 -name "route.ts" -type f
   ```

2. **Check which have tests:**
   ```bash
   find app/api/v1 -name "route.test.ts" -type f
   ```

3. **For each untested route:**
   - Generate test file using steps above
   - Run test to verify it works
   - Report success/failure

### 3. For check mode (`/scaffold-tests --check`)

Output a table:

```
| Route | Has Test | Paid |
|-------|----------|------|
| finance/scan | ❌ | Yes |
| finance/create-invoice | ❌ | No |
| legal/check-contract | ❌ | Yes |
...
```

## API Routes Reference

| Category | Route | Paid | Key Fields |
|----------|-------|------|------------|
| finance | scan | Yes | base64 (PDF) |
| finance | create-invoice | No | clientName, items[] |
| finance | generate-quote | No | clientName, items[] |
| legal | check-contract | Yes | contractText |
| legal | generate-terms | Yes | companyName, companyType |
| hr | cv-screener | Yes | cvText, jobDescription |
| hr | interview-questions | Yes | jobTitle, level |
| marketing | social-planner | Yes | business, goals[] |
| sales | lead-scorer | Yes | leadInfo |
| sales | pitch-deck | Yes | companyName, problem |
| business | kvk-search | Yes | query, type |

## Valid Input Examples

```typescript
// finance/create-invoice
{
    clientName: "Test Client",
    clientEmail: "test@example.com",
    items: [{ description: "Service", quantity: 1, unitPrice: 100 }]
}

// hr/cv-screener
{
    cvText: "5 years experience as software engineer...",
    jobDescription: "Looking for senior developer..."
}

// legal/generate-terms
{
    companyName: "Test BV",
    companyType: "webshop",
    includeGDPR: true
}
```

## Verification (Boris Principle)

After generating tests:

1. Run the new test file:
   ```bash
   bun test {test-file-path}
   ```

2. Check coverage improved:
   ```bash
   bun run test:coverage
   ```

3. Report results to user with pass/fail status
