# New Tool Skill

Add a new AI-powered tool to the AIFAISS platform. This skill guides you through all required steps.

## Usage

```
/new-tool [tool-name]
```

## Workflow

### Step 1: Gather Tool Information

First, ask the user for the following details (if not provided):

| Field | Required | Example |
|-------|----------|---------|
| Tool name (slug) | Yes | `email-generator` |
| Display name (NL) | Yes | `Email Generator` |
| Category | Yes | `finance`, `legal`, `hr`, `marketing`, `sales`, `consulting` |
| Paid or Free | Yes | `paid` (0.001 SOL / €0.50) or `free` |
| Short description (NL) | Yes | `Genereer professionele emails met AI` |
| What it does | Yes | Detailed explanation of functionality |

### Step 2: Create API Route

Create the API endpoint at `app/api/v1/[category]/[tool-name]/route.ts`:

```typescript
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";

const schema = z.object({
    // Add tool-specific fields here
    input: z.string().min(1),
});

export const POST = createToolHandler({
    schema,
    requiresPayment: true, // false for free tools
    handler: async (data, context) => {
        // Tool logic here
        // Use context.ai for Claude API calls

        return {
            success: true,
            data: {
                // Result fields
            }
        };
    }
});
```

### Step 3: Add Zod Schema

If the tool needs a reusable schema, add it to `lib/security/schemas.ts`:

```typescript
export const toolNameSchema = z.object({
    // Fields
}).merge(paymentSchema);
```

### Step 4: Add AI Prompt (if needed)

For AI-powered tools, add the prompt to `lib/ai/prompts.ts`:

```typescript
export const TOOL_NAME_PROMPT = `
Je bent een AI assistent die [beschrijving].

Instructies:
- [Instructie 1]
- [Instructie 2]

Output format:
{
  "field": "value"
}
`;
```

### Step 5: Add Tool Metadata

Add to `config/tools.ts` in the `TOOL_REGISTRY`:

```typescript
"tool-slug": {
    id: "tool-slug",
    slug: "tool-slug",
    title: "Tool Naam",
    shortDescription: "Korte beschrijving van de tool.",
    longDescription: "Uitgebreide beschrijving met details over wat de tool doet.",
    icon: IconName, // Import from lucide-react
    status: "live",
    category: "category",
    new: true,
    metaTitle: "Tool Naam | AIFAIS",
    metaDescription: "SEO beschrijving voor de tool pagina.",
    keywords: ["keyword1", "keyword2"],
    features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    useCases: ["Use case 1", "Use case 2", "Use case 3"],
    pricing: {
        type: "paid", // or "free"
        price: 0.001,
        currency: "SOL",
        priceEur: 0.50,
        stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_TOOLNAME,
    },
    componentPath: "tool-slug/ToolNameClient",
},
```

### Step 6: Create Client Component & Register in componentMap

**⚠️ CRITICAL: Add to componentMap FIRST!**

You MUST add the component to the static componentMap in `app/[locale]/tools/[toolId]/page.tsx`:

```typescript
const componentMap: Record<string, React.ComponentType<any>> = {
    // ... existing tools ...
    "tool-slug/ToolNameClient": require("@/app/[locale]/tools/tool-slug/ToolNameClient").default,
};
```

**If you skip this step, the tool page will return 404!** The error in console will be:
```
Component not found for path: tool-slug/ToolNameClient
```

This is the #1 cause of "tool page not loading" issues!

Then create `app/[locale]/tools/[tool-slug]/page.tsx`:

```typescript
import ToolNameClient from "./ToolNameClient";

export default function ToolPage() {
    return <ToolNameClient />;
}
```

Create `app/[locale]/tools/[tool-slug]/ToolNameClient.tsx` with:
- Form inputs for the tool
- Integration with `usePaywallTool` hook
- Result display
- Export options (PDF/CSV if applicable)

Use existing tools as reference:
- Simple: `interview-questions/InterviewQuestionsClient.tsx`
- Complex: `social-planner/SocialPlannerClient.tsx`
- With file upload: `cv-screener/CvScreenerClient.tsx`

### Step 7: Add Translations

Add to `messages/nl.json`:
```json
{
  "tools": {
    "toolSlug": {
      "title": "Tool Naam",
      "description": "Beschrijving"
    }
  }
}
```

Add to `messages/en.json`:
```json
{
  "tools": {
    "toolSlug": {
      "title": "Tool Name",
      "description": "Description"
    }
  }
}
```

### Step 8: Create Stripe Payment Link (Paid Tools Only)

For paid tools, create a Stripe Payment Link:

**Option A: Run the script**
```bash
npx tsx scripts/create-stripe-links.ts
```

**Option B: Add manually**
1. Add env var to `.env`: `NEXT_PUBLIC_STRIPE_LINK_TOOLNAME=`
2. Create link in Stripe Dashboard (€0.50, iDEAL + Card)
3. Add the URL to the env var

**Option C: Use admin endpoint (production)**
```bash
curl -X POST https://aifais.com/api/admin/create-stripe-links \
  -H "x-admin-key: $ADMIN_SECRET_KEY"
```

**Option D: Use Stripe MCP (recommended)**
Use Claude's Stripe MCP tools to create the payment link directly:

```typescript
// 1. First create a product
mcp__plugin_stripe_stripe__create_product({
    name: "AIFAISS - Tool Name",
    description: "One-time use of Tool Name"
})

// 2. Create a price (€0.50 = 50 cents)
mcp__plugin_stripe_stripe__create_price({
    product: "prod_xxx",  // from step 1
    unit_amount: 50,
    currency: "eur"
})

// 3. Create the payment link
mcp__plugin_stripe_stripe__create_payment_link({
    price: "price_xxx",  // from step 2
    quantity: 1
})
```

This returns the payment link URL directly - add it to `.env` and Vercel.

Don't forget to add the env var to Vercel!

### Step 9: Update MCP Server

Update `aifais-mcp-server/src/index.ts`:
```typescript
{
    name: "tool-name",
    description: "Tool description for MCP",
    inputSchema: {
        type: "object",
        properties: {
            // Input fields
        },
        required: ["field1"]
    }
}
```

Update `aifais-mcp-server/README.md` with tool documentation.

Run: `npm run generate:mcp-readme`

### Step 10: Update Developer Docs

Add the tool to `app/[locale]/developers/page.tsx` in the API documentation section.

### Step 11: Verify (Build & Type Check)

Run these checks:
```bash
# Type check
bunx tsc --noEmit

# Build check
bun run build
```

### Step 12: Local Browser Testing with Playwright (MANDATORY - BEFORE PUSH)

**CRITICAL:** Always verify the tool works in the browser using Playwright BEFORE committing and pushing. This catches runtime errors that type checking misses.

1. **Start dev server** (if not running):
   ```bash
   bun run dev
   ```

2. **Test with Playwright MCP tools** on localhost:

```typescript
// 1. Navigate to the tool (with ?dev=true for paid tools)
browser_navigate({ url: "http://localhost:3000/nl/tools/{tool-slug}?dev=true" });

// 2. Take a snapshot to see the form
browser_snapshot();

// 3. Fill in test data (refs will vary - check snapshot output)
browser_type({ element: "Product name input", ref: "eXX", text: "Test Product" });
browser_type({ element: "Price input", ref: "eXX", text: "100" });

// 4. Submit the form
browser_click({ element: "Submit button", ref: "eXX" });

// 5. Take snapshot to verify results display correctly
browser_snapshot();

// 6. Close browser when done
browser_close();
```

3. **Or use `/browser-test` skill:**
   ```
   /browser-test {tool-slug}
   ```

#### Verification Checklist (must pass before commit)

- [ ] Page loads without console errors
- [ ] Form is visible and fillable
- [ ] Submit works without payment modal (dev mode)
- [ ] **Result displays correctly** (check for "Cannot read properties of undefined" errors)
- [ ] Export buttons work (if applicable)
- [ ] No cookie consent or other modals blocking interaction

#### Create E2E Test (optional but recommended)
- Copy `templates/tool-e2e.test.template.ts` to `e2e/tools/{tool-slug}.test.ts`
- Fill in form selectors and test data
- Run: `bun run e2e e2e/tools/{tool-slug}.test.ts`

### Step 13: Final Checklist

Run `/verify` to confirm everything works:
```
/verify
```

### Step 14: Git Commit & Push

Commit all changes and push to master:
```bash
git add -A
git commit -m "feat: add {tool-name} tool

- API route: /api/v1/{category}/{tool-slug}
- Client component with form and result display
- Translations (NL/EN)
- MCP server updated

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

git push origin master
```

### Step 15: Verify Vercel Deployment (Auto-Fix Loop)

After pushing, verify the deployment succeeded. **If it fails, automatically fix and retry.**

1. **Wait 30-60 seconds** for Vercel to build

2. **Check deployment status:**
   ```bash
   curl -s https://aifais.com/api/health | jq .
   ```

3. **Test on production with Playwright** (FREE tools only):

   **For FREE tools** - Full test:
   ```typescript
   browser_navigate({ url: "https://www.aifais.com/tools/{tool-slug}" });
   browser_snapshot();
   browser_type({ element: "Input field", ref: "eXX", text: "Test Value" });
   browser_click({ element: "Submit button", ref: "eXX" });
   browser_snapshot();  // Verify results
   browser_close();
   ```

   **For PAID tools** - Only verify page loads (can't test without paying):
   ```typescript
   browser_navigate({ url: "https://www.aifais.com/tools/{tool-slug}" });
   browser_snapshot();  // Verify page and form render correctly
   browser_close();
   ```

4. **If deployment FAILED - Auto-Fix Loop:**
   ```
   attempt = 1
   while deployment_failed AND attempt <= 5:
       1. Get error logs: vercel logs --limit 50
       2. Identify the error (build error, type error, runtime error)
       3. Fix the code
       4. Commit and push:
          git add -A
          git commit -m "fix: [describe what was fixed]"
          git push origin master
       5. Wait 30-60 seconds
       6. Check deployment again
       7. attempt += 1
   ```

5. **Common deployment errors and fixes:**
   | Error | Fix |
   |-------|-----|
   | Type error | Fix type in indicated file |
   | Module not found | Check import path, add missing dependency |
   | Build error | Check syntax, missing exports |
   | Runtime error | Check API routes, env vars |

6. **Report to user:**
   ```
   ## Deployment Status

   | Check | Status |
   |-------|--------|
   | Git Push | ✅ |
   | Vercel Build | ✅ (after X attempts) |
   | Health Check | ✅ |
   | Tool Page | ✅ |

   🎉 Tool is live at: https://aifais.com/nl/tools/{tool-slug}
   ```

   Or if failed after 5 attempts:
   ```
   ❌ Deployment failed after 5 attempts
   Last error: [error message]
   Manual intervention required - check Vercel dashboard
   ```

## File Checklist

After completion, verify these files were created/updated:

- [ ] `app/api/v1/[category]/[tool-name]/route.ts`
- [ ] `config/tools.ts`
- [ ] **`app/[locale]/tools/[toolId]/page.tsx`** ← ADD TO componentMap! (causes 404 if missing)
- [ ] `app/[locale]/tools/[tool-slug]/ToolNameClient.tsx`
- [ ] `messages/nl.json`
- [ ] `messages/en.json`
- [ ] `.env` (if paid tool)
- [ ] `aifais-mcp-server/src/index.ts`
- [ ] `aifais-mcp-server/README.md`
- [ ] `app/[locale]/developers/page.tsx`

## Common Patterns

### File Upload Tool
```typescript
const [file, setFile] = useState<File | null>(null);

// In form
<input
    type="file"
    accept=".pdf,.doc,.docx"
    onChange={(e) => setFile(e.target.files?.[0] || null)}
/>

// In execute
const formData = new FormData();
formData.append("file", file);
// Convert to base64 for API
```

### Multi-Step Wizard
See `terms-generator/TermsGeneratorClient.tsx` for wizard pattern.

### Export to PDF/CSV
```typescript
import { exportToPDFReport, exportToCSV, downloadExport } from "@/lib/export";
```

## Common Gotchas

### API Response Handling (IMPORTANT!)

The `createToolHandler` wraps all responses in a standard structure:

```typescript
{
  success: true,
  data: { /* actual result here */ },
  meta: { method: "...", timestamp: "..." }
}
```

**In your client component, always extract `data.data`, NOT just `data`:**

```typescript
// ❌ WRONG - will cause "Cannot read properties of undefined" error
const data = await response.json();
setResult(data);  // Sets the wrapper object

// ✅ CORRECT - extracts the actual result
const data = await response.json();
setResult(data.data);  // Sets the actual result
```

This is a common source of runtime errors that type checking won't catch!

### Cookie Consent Banner

When testing with Playwright, cookie consent banners may block form interaction. Dismiss them first or click elsewhere to close them.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Tool page 404** | **Add component to componentMap in `[toolId]/page.tsx`** (most common!) |
| Tool not showing | Check `config/tools.ts` slug matches folder name |
| Payment not working | Verify `stripeLink` env var is set |
| API 500 error | Check API route schema matches request |
| Translation missing | Restart dev server after adding translations |
| "Cannot read properties of undefined" | Use `data.data` not `data` when setting result (see Common Gotchas) |
| Form submit not working | Check for cookie banners or modals blocking clicks |
