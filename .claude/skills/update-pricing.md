# Update Pricing Skill

Update the price of a tool across all required locations in the codebase.

## Usage

```
/update-pricing invoice-extraction 0.002
/update-pricing cv-screener free
```

## Why This Skill Exists

Changing a tool's price requires updates in **4+ locations**:
1. `config/tools.ts` - Tool metadata
2. `aifais-mcp-server/src/index.ts` - MCP server
3. `aifais-mcp-server/README.md` - MCP documentation
4. `app/[locale]/developers/page.tsx` - Developer docs
5. `CLAUDE.md` - Project documentation (optional)

Missing any location causes inconsistencies and user confusion.

## Workflow

### Step 1: Identify the Tool

Get the tool slug from the user. Valid slugs:
- `invoice-extraction` (Factuur Scanner)
- `contract-checker` (Contract Checker)
- `terms-generator` (Algemene Voorwaarden)
- `cv-screener` (CV Screener)
- `interview-questions` (Sollicitatievragen)
- `social-planner` (Social Media Planner)
- `pitch-deck` (Pitch Deck Generator)
- `lead-scorer` (Lead Scorer)

### Step 2: Get New Price

Ask for the new price:
- **Paid**: SOL amount (e.g., `0.001`, `0.002`)
- **Free**: Use `free` or `0`

If changing to paid, also need:
- EUR equivalent (default: SOL × 500, so 0.001 SOL = €0.50)
- Stripe Payment Link (create if doesn't exist)

### Step 3: Update config/tools.ts

```typescript
// Find the tool in TOOL_REGISTRY and update:
pricing: {
    type: "paid",      // or "free"
    price: 0.002,      // SOL amount
    currency: "SOL",
    priceEur: 1.00,    // EUR amount
    stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_TOOLNAME,
}
```

### Step 4: Update MCP Server

**File:** `aifais-mcp-server/src/index.ts`

Find the tool definition and update the price in the description:

```typescript
{
    name: "tool-name",
    description: "Tool description. Kosten: 0.002 SOL (€1.00)",
    // ...
}
```

### Step 5: Update MCP README

**File:** `aifais-mcp-server/README.md`

Update the pricing table:

```markdown
| Tool | Prijs |
|------|-------|
| Tool Name | 0.002 SOL |
```

### Step 6: Update Developer Docs

**File:** `app/[locale]/developers/page.tsx`

Find the API documentation section and update the price.

### Step 7: Update CLAUDE.md (Optional)

**File:** `CLAUDE.md`

Update the Tool Pricing table if it exists:

```markdown
| Tool | Prijs | Status |
|------|-------|--------|
| Tool Name | 0.002 SOL | Live |
```

### Step 8: Create/Update Stripe Link (if needed)

If price changed or tool became paid:

```bash
npx tsx scripts/create-stripe-links.ts
```

Or create manually in Stripe Dashboard with new price.

### Step 9: Verify Changes

```bash
# Search for old price to ensure no remnants
grep -r "0.001" --include="*.ts" --include="*.tsx" --include="*.md" | grep tool-name

# Build to check for errors
bun run build
```

## Files to Update Checklist

When changing price for `[tool-name]`:

- [ ] `config/tools.ts` - pricing object
- [ ] `aifais-mcp-server/src/index.ts` - tool description
- [ ] `aifais-mcp-server/README.md` - pricing table
- [ ] `app/[locale]/developers/page.tsx` - API docs
- [ ] `CLAUDE.md` - Tool Pricing table (if exists)
- [ ] Stripe Payment Link (if price changed)
- [ ] Vercel env vars (if new Stripe link)

## Price Conversion Reference

| SOL | EUR (approx) |
|-----|--------------|
| 0.001 | €0.50 |
| 0.002 | €1.00 |
| 0.005 | €2.50 |
| 0.01 | €5.00 |

## Changing from Paid to Free

1. Update `config/tools.ts`:
   ```typescript
   pricing: {
       type: "free",
   }
   ```

2. Remove `requiresPayment: true` from API route (if set)

3. Update all documentation to show "GRATIS" / "Free"

4. Stripe link can remain (won't be shown)

## Changing from Free to Paid

1. Update `config/tools.ts` with full pricing object

2. Add `requiresPayment: true` to API route

3. Create Stripe Payment Link

4. Add env var to `.env` and Vercel

5. Update all documentation

## Common Mistakes

| Mistake | Impact |
|---------|--------|
| Forgot MCP server | MCP users see wrong price |
| Forgot developer docs | API docs show wrong price |
| Wrong EUR conversion | Stripe charges wrong amount |
| Test Stripe link in prod | Payments fail silently |
