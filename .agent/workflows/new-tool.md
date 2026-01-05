---
description: How to create a new AI tool for AIFAIS
---

## Prerequisites
Ensure you understand the standardized tool architecture. Key files:
- `lib/tools/createToolHandler.ts` - API route factory
- `lib/pdf/generator.ts` - PDF generation utility
- `hooks/usePaywallTool.ts` - Client-side paid tool hook
- `config/tools.ts` - Tool registry

## Steps to Create a New Tool

// turbo-all

1. Run the scaffolding script to generate all boilerplate:
   ```bash
   npm run tools:create
   ```
   Follow the interactive prompts to enter the tool ID, title, category, pricing, etc.

2. The script will generate:
   - `app/api/v1/[category]/[tool-id]/route.ts` - API endpoint using `createToolHandler`
   - `app/[locale]/tools/[tool-id]/ClientComponent.tsx` - Frontend using `usePaywallTool`
   - `app/[locale]/tools/[tool-id]/page.tsx` - Next.js page wrapper

3. **Add to Tool Registry**: Copy the generated metadata snippet into `config/tools.ts` in the `TOOL_REGISTRY` object. See existing entries for reference.

4. **Implement Business Logic**: Edit the generated `route.ts` file. Replace the placeholder `// TODO: Implement your tool logic here` with your actual logic. If generating PDFs, use the `PDFGenerator` class from `lib/pdf/generator.ts`.

5. **Customize UI (Optional)**: Edit the generated `ClientComponent.tsx` for custom input fields or result displays.

6. **Test**: Run `bun dev` and navigate to your new tool page.

## Example Command
```bash
npm run tools:create
# Enter: invoice-reminder
# Enter: Aanmaning Generator
# Select: finance
# Enter: 0.001
# Select: file
# Select: yes (requires AI)
```

## Post-Creation Checklist (Important!)

After creating or updating any tool, you MUST also update the following:

### 1. Developer Documentation
Update the developer-facing pages in `app/[locale]/developers/` when:
- A new tool API is created
- Tool pricing or functionality changes
- New API routes or endpoints are added

Key files to update:
- `app/[locale]/developers/x402/page.tsx` - API usage examples
- `app/[locale]/developers/page.tsx` - Developer portal overview

### 2. MCP Server Sync
If the tool is exposed via the MCP server, regenerate the MCP README:
```bash
npm run generate:mcp-readme
```
This updates `aifais-mcp-server/README.md` with accurate tool/API information.

### 3. Tool Registry
Always ensure `config/tools.ts` has the correct:
- `pricing` (price and currency)
- `status` (live, beta, soon)
- `category` (must match a SectorId from `types/common.ts`)

## Notes
- All API routes using `createToolHandler` automatically get: Zod validation, payment gatekeeping, rate limiting, and standardized error handling.
- Free tools can set `pricing: { price: 0, currency: "SOL" }`.
- Use `useAsyncForm` hook from `hooks/useAsyncForm.ts` for form state management in client components.
