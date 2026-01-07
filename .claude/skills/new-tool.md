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

### Step 6: Create Client Component

Create `app/[locale]/tools/[tool-slug]/page.tsx`:

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

### Step 11: Verify

Run these checks:
```bash
# Build check
bun run build

# Type check
npx tsc --noEmit

# Test the tool locally
bun run dev
```

## File Checklist

After completion, verify these files were created/updated:

- [ ] `app/api/v1/[category]/[tool-name]/route.ts`
- [ ] `config/tools.ts`
- [ ] `app/[locale]/tools/[tool-slug]/page.tsx`
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

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tool not showing | Check `config/tools.ts` slug matches folder name |
| Payment not working | Verify `stripeLink` env var is set |
| API 500 error | Check API route schema matches request |
| Translation missing | Restart dev server after adding translations |
