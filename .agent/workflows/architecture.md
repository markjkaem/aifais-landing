---
description: AIFAIS project architecture overview for AI assistants
---

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **i18n:** next-intl (nl, en)
- **AI:** Anthropic Claude API
- **Payments:** Solana (X-402 protocol) + Stripe
- **Database:** Redis (for rate limiting, payment replay protection)
- **CRM:** Notion API

## Directory Structure

```
app/
├── Components/           # Reusable UI components
│   ├── tools/list/       # Tool listing components (ToolCard, etc.)
│   ├── home/             # Homepage sections
│   └── layout/           # Header, Footer, MegaMenus
├── [locale]/             # i18n routes (nl, en)
│   ├── tools/            # Tool pages
│   ├── developers/       # API documentation pages
│   └── ...
└── api/                  # API routes
    ├── v1/               # Versioned paid tool APIs
    │   ├── finance/      # Invoice scanner, quote, etc.
    │   └── legal/        # Contract checker, terms, etc.
    └── internal/         # Free/internal APIs (benchmark, contact)

lib/
├── tools/                # createToolHandler factory
├── pdf/                  # PDFGenerator utility
├── security/             # api-guard, rate-limiter, schemas
└── crm/                  # Notion integration

hooks/
├── usePaywallTool.ts     # Paid tool client hook
└── useAsyncForm.ts       # Form state management

config/
├── tools.ts              # Tool registry (TOOL_REGISTRY)
└── sectors.ts            # Sector definitions

types/
└── common.ts             # Shared TypeScript types
```

## Key Patterns

### API Routes
All tool APIs should use `createToolHandler` from `lib/tools/createToolHandler.ts`. This provides:
- Zod validation
- Payment gatekeeping (Solana/Stripe)
- Rate limiting
- Standardized responses

### Client Components
Use `usePaywallTool` hook for tool pages that require payment.

### PDF Generation
Use `PDFGenerator` class from `lib/pdf/generator.ts`.

## Environment Variables (check .env.example)
- `ANTHROPIC_API_KEY` / `CLAUDE_API_KEY`
- `NEXT_PUBLIC_SOLANA_WALLET`
- `STRIPE_PRIVATE_KEY`
- `SMTP_USER`, `SMTP_PASS`
- `REDIS_URL`
- `NOTION_API_KEY`, `NOTION_DATABASE_ID`
