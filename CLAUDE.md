# CLAUDE.md - AIFAIS Project Memory

## Project Overzicht

AIFAIS is een **AI-powered business tools platform** voor de Nederlandse MKB markt. Het biedt betaalde en gratis AI-tools via een Next.js 16 web applicatie en een standalone MCP server voor integratie met Claude Desktop en Cursor IDE.

**Belangrijke URLs:**
- Website: `https://aifais.com`
- MCP Discovery: `https://aifais.com/api/mcp`
- Solana Wallet: `Bqpo3emFG46VGLX4korYoeta3a317pWbR2DMbWnFpZ8c`

---

## Betalingen & Pricing Model

### Payment Methods
1. **Solana (X402 Protocol)** - Primaire betaalmethode
   - Verificatie: `app/api/payments/verify-solana/route.ts`
   - Wallet: `Bqpo3emFG46VGLX4korYoeta3a317pWbR2DMbWnFpZ8c`
   - X402 flow: Request → 402 Response → Pay → Resend with signature

2. **Stripe** - Alternatieve fiat betaling (EUR)
   - Verificatie: `app/api/payments/verify-stripe/route.ts`
   - Methodes: iDEAL, Card
   - Prijs: €0.50 per tool gebruik
   - Elke betaalde tool heeft een eigen Stripe Payment Link

### Tool Pricing
| Tool | Prijs | Status |
|------|-------|--------|
| Factuur Scanner | 0.001 SOL | Live |
| Factuur Maker | GRATIS | Live |
| Offerte Generator | GRATIS | Live |
| Contract Checker | 0.001 SOL | Live |
| Algemene Voorwaarden | 0.001 SOL | Live |
| CV Screener | 0.001 SOL | Live |
| Interview Questions | 0.001 SOL | Live |
| Social Media Planner | 0.001 SOL | Live |
| Lead Scorer | 0.001 SOL | Live |
| Pitch Deck Generator | 0.001 SOL | Live |
| ROI Calculator | GRATIS | Live |
| AI Benchmark | GRATIS | Live |

### Payment Gatekeeper
Centrale payment verificatie: `lib/payment-gatekeeper.ts`
- Accepteert Solana signature OF Stripe session ID
- DEV_BYPASS alleen in development/test mode
- Redis tracking voor replay attack preventie

### Stripe Payment Links

Elke betaalde tool heeft een Stripe Payment Link geconfigureerd in `config/tools.ts`:

```typescript
pricing: {
    type: "paid",
    price: 0.001,        // SOL amount
    currency: "SOL",
    priceEur: 0.50,      // EUR amount
    stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_CV,  // Stripe Payment Link
}
```

**Environment Variables voor Stripe Links:**
| Tool | Env Var |
|------|---------|
| Invoice Scanner | `NEXT_PUBLIC_STRIPE_LINK_SINGLE` |
| Contract Checker | `NEXT_PUBLIC_STRIPE_LINK_CONTRACT` |
| Terms Generator | `NEXT_PUBLIC_STRIPE_LINK_TERMS` |
| CV Screener | `NEXT_PUBLIC_STRIPE_LINK_CV` |
| Interview Questions | `NEXT_PUBLIC_STRIPE_LINK_INTERVIEW` |
| Social Media Planner | `NEXT_PUBLIC_STRIPE_LINK_SOCIAL` |
| Pitch Deck Generator | `NEXT_PUBLIC_STRIPE_LINK_PITCH` |
| Lead Scorer | `NEXT_PUBLIC_STRIPE_LINK_LEAD` |

**Payment UI Component:**
`app/Components/tools/PaywallToolWrapper.tsx` toont beide opties:
- iDEAL / Card (Stripe) - €0.50
- Solana Pay - 0.001 SOL

### Stripe Links Aanmaken

**Scripts:**
- `scripts/create-stripe-links.ts` - Maakt alle payment links aan
- `scripts/ensure-stripe-links.ts` - Checkt en maakt ontbrekende links

**Admin Endpoint:**
```bash
# POST /api/admin/create-stripe-links
curl -X POST https://aifais.com/api/admin/create-stripe-links \
  -H "x-admin-key: $ADMIN_SECRET_KEY"
```

**Lokaal aanmaken:**
```bash
npx tsx scripts/create-stripe-links.ts
```

**Van Test naar Live:**
1. Zet live Stripe keys in Vercel (`STRIPE_PRIVATE_KEY=sk_live_...`)
2. Run het script of call de admin endpoint
3. Voeg de nieuwe links toe aan Vercel env vars
4. Redeploy

---

## MCP Server

**Locatie:** `aifais-mcp-server/`

De MCP server maakt het mogelijk voor Claude Desktop en Cursor IDE om direct AIFAIS tools te gebruiken.

### Bestanden
- `src/index.ts` - Main server met tool definities
- `mcp.json` - Server configuratie
- `README.md` - Documentatie voor gebruikers
- `package.json` - Dependencies

### Configuratie in Claude Desktop
```json
{
  "mcpServers": {
    "aifais": {
      "command": "npx",
      "args": ["-y", "github:aifais/aifais-mcp-server"]
    }
  }
}
```

### BELANGRIJK: Documentatie Updates
Wanneer er **nieuwe tools** worden toegevoegd of **prijzen** veranderen:
1. Update `aifais-mcp-server/README.md` met nieuwe tool info
2. Update `aifais-mcp-server/src/index.ts` met tool definities
3. Update `/app/[locale]/developers/page.tsx` (developer docs)
4. Update `config/tools.ts` met metadata
5. Run `npm run generate:mcp-readme` om docs te regeneren

---

## Architectuur

### Tech Stack
- **Frontend:** React 19.2.0 + Next.js 16.0.7 + Tailwind CSS 4
- **Backend:** Next.js API Routes (App Router)
- **AI:** Anthropic Claude SDK (@anthropic-ai/sdk)
- **Blockchain:** Solana web3.js, @solana/pay
- **Payments:** Stripe SDK
- **Cache:** Redis (ioredis)
- **i18n:** next-intl (NL/EN)
- **Monitoring:** Sentry
- **Docs:** PDF (pdf-lib), Excel (exceljs), Word (docx), PowerPoint (pptxgenjs)

### Folder Structuur
```
aifaiss/
├── app/
│   ├── [locale]/              # Locale-based routes (nl/en)
│   │   ├── developers/        # Developer documentation
│   │   ├── diensten/          # Services pages
│   │   ├── tools/[slug]/      # Individual tool pages
│   │   └── agents/            # Agent demos
│   ├── api/
│   │   ├── v1/                # Public API endpoints
│   │   │   ├── finance/       # scan, create-invoice, generate-quote
│   │   │   ├── legal/         # check-contract, generate-terms
│   │   │   ├── hr/            # cv-screener, interview-questions
│   │   │   ├── marketing/     # social-planner
│   │   │   └── sales/         # lead-scorer, pitch-deck
│   │   ├── payments/          # verify-solana, verify-stripe
│   │   ├── internal/          # contact, newsletter, benchmark
│   │   ├── blinks/            # Solana Actions/Blinks
│   │   └── mcp/               # MCP discovery endpoint
│   └── Components/            # React components
├── aifais-mcp-server/         # Standalone MCP server
├── lib/
│   ├── tools/                 # Tool handler factory
│   ├── security/              # API guards, rate limiting
│   ├── payment-gatekeeper.ts  # Payment verification
│   ├── ai/prompts.ts          # AI prompts voor tools
│   ├── export/                # Export utilities
│   └── redis.ts               # Redis client
├── config/
│   ├── tools.ts               # Tool registry & metadata
│   ├── apis.ts                # API configurations
│   └── sectors.ts             # MKB sector definitions
├── utils/
│   ├── ai-scanner.ts          # Claude document scanning
│   ├── x402-guard.ts          # X402 payment protocol
│   └── solana-pricing.ts      # SOL pricing logic
├── hooks/                     # React hooks
├── types/                     # TypeScript types
├── messages/                  # i18n translations (en.json, nl.json)
└── scripts/                   # Build scripts
```

---

## API Endpoints

### Tool APIs (`/api/v1/*`)

| Category | Endpoint | Method | Payment |
|----------|----------|--------|---------|
| Finance | `/api/v1/finance/scan` | POST | 0.001 SOL |
| Finance | `/api/v1/finance/create-invoice` | POST | Free |
| Finance | `/api/v1/finance/generate-quote` | POST | Free |
| Legal | `/api/v1/legal/check-contract` | POST | 0.001 SOL |
| Legal | `/api/v1/legal/generate-terms` | POST | 0.001 SOL |
| HR | `/api/v1/hr/cv-screener` | POST | 0.001 SOL |
| HR | `/api/v1/hr/interview-questions` | POST | 0.001 SOL |
| Marketing | `/api/v1/marketing/social-planner` | POST | 0.001 SOL |
| Sales | `/api/v1/sales/lead-scorer` | POST | 0.001 SOL |
| Sales | `/api/v1/sales/pitch-deck` | POST | 0.001 SOL |

### Internal APIs (`/api/internal/*`)
- `POST /api/internal/contact` - Contact form
- `POST /api/internal/newsletter` - Newsletter signup
- `POST /api/internal/benchmark` - Benchmark score storage
- `POST /api/internal/quickscan` - Quick scan results

### Payment APIs
- `GET /api/payments/verify-solana?signature=...`
- `GET /api/payments/verify-stripe?session_id=...`

### MCP & Blinks
- `GET /api/mcp` - MCP server definition
- `GET /api/blinks/actions.json` - Solana Actions discovery
- `GET/POST /api/blinks/top-up` - Solana pay transaction

---

## Tool Handler Pattern

Alle tool endpoints gebruiken `lib/tools/createToolHandler.ts`:

```typescript
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { schema } from "@/lib/security/schemas";

export const POST = createToolHandler({
  schema: schema.toolName,
  requiresPayment: true, // false voor gratis tools
  handler: async (data, context) => {
    // Tool logic hier
    return { success: true, data: result };
  }
});
```

De handler doet automatisch:
- Zod schema validatie
- Payment gatekeeping (X402/Stripe)
- Error handling
- Response formatting
- Rate limiting

---

## i18n Translations

**Locaties:** `messages/en.json`, `messages/nl.json`

**Namespaces:**
- `navigation` - Header/footer links
- `hero` - Homepage hero
- `tools` - Tool descriptions
- `agentDemo` - Agent demo section
- `articleCta` - Article CTAs
- `leadMagnet` - Lead magnet popup
- `cookieBanner` - Cookie consent
- `developersPage` - Developer documentation

**Gebruik:**
```typescript
// Client component
import { useTranslations } from "next-intl";
const t = useTranslations("namespace");

// Server component
import { getTranslations } from "next-intl/server";
const t = await getTranslations({ locale, namespace: "namespace" });
```

---

## Security

### API Guard
`lib/security/api-guard.ts` wrapped alle endpoints:
- Origin validation (CORS)
- Rate limiting per IP
- Zod schema validation

### Rate Limiting
`lib/security/rate-limiter.ts`:
- In-memory sliding window
- 20 requests/min default
- Per-IP tracking

### DEV Bypass
`lib/security/dev-bypass.ts`:
- Alleen in `NODE_ENV === 'development'` of `'test'`
- **Geblokkeerd in production**

---

## Environment Variables

Zie `.env.example` voor alle variables:

```env
# AI
ANTHROPIC_API_KEY=sk-ant-...

# Solana
SOLANA_WALLET_ADDRESS=Bqpo3...
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_PRIVATE_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_LINK_SINGLE=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_LINK_CONTRACT=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_LINK_TERMS=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_LINK_CV=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_LINK_INTERVIEW=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_LINK_SOCIAL=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_LINK_PITCH=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_LINK_LEAD=https://buy.stripe.com/...

# Admin (voor Stripe link creation endpoint)
ADMIN_SECRET_KEY=your-secure-random-key

# Redis
REDIS_URL=redis://...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_ORG=...
SENTRY_PROJECT=...
SENTRY_AUTH_TOKEN=sntryu_...

# Optional: Notion CRM
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...

# Optional: Email
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
CONTACT_EMAIL=...

# Optional: Newsletter
MAILCHIMP_API_KEY=...
MAILCHIMP_LIST_ID=...
```

---

## Nieuwe Tool Toevoegen Checklist

1. [ ] Create API route in `app/api/v1/[category]/[tool-name]/route.ts`
2. [ ] Add Zod schema in `lib/security/schemas.ts`
3. [ ] Add AI prompt in `lib/ai/prompts.ts`
4. [ ] Add metadata in `config/tools.ts` (inclusief `stripeLink` voor betaalde tools)
5. [ ] Create client component in `app/[locale]/tools/[slug]/`
6. [ ] Add translations in `messages/en.json` en `messages/nl.json`
7. [ ] **Voor betaalde tools - Stripe Payment Link:**
   - Voeg env var toe: `NEXT_PUBLIC_STRIPE_LINK_[TOOL]`
   - Run `npx tsx scripts/create-stripe-links.ts` of voeg handmatig toe in Stripe Dashboard
   - Update `.env` en Vercel env vars
8. [ ] **Update MCP server:**
   - Update `aifais-mcp-server/src/index.ts`
   - Update `aifais-mcp-server/README.md`
   - Run `npm run generate:mcp-readme`
9. [ ] **Update developer docs:** `app/[locale]/developers/page.tsx`

---

## Belangrijke Componenten

### Payment Flow
- `app/Components/CryptoModal.tsx` - Payment modal (Solana QR + Stripe)
- `hooks/usePaywallTool.ts` - Tool execution with payment

### Tools UI
- `app/Components/tools/PaywallToolWrapper.tsx` - Payment wrapper
- `app/Components/tools/ResultDisplay.tsx` - Results viewer
- `app/Components/tools/ToolLoadingState.tsx` - Loading state

### Lead Capture
- `app/Components/LeadMagnetPopup.tsx` - Lead magnet popup
- `app/Components/ArticleCTA.tsx` - Article CTA with ROI calculator
- `app/Components/ExitIntentPopup.tsx` - Exit intent trigger

### Agent Demo
- `app/Components/home/AgentDemoSection.tsx` - Inbox Zero agent demo

---

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run start            # Start production server
npm run test             # Run tests (Vitest)
npm run lint             # ESLint
npm run generate:mcp-readme  # Generate MCP README

# Stripe Payment Links
npx tsx scripts/create-stripe-links.ts   # Maak alle ontbrekende Stripe links
npx tsx scripts/ensure-stripe-links.ts   # Check en maak ontbrekende links
```

---

## Skills

Custom Claude Code skills voor dit project. Locatie: `.claude/skills/`

### `/new-tool` - Nieuwe Tool Toevoegen

Begeleidt bij het toevoegen van een nieuwe tool aan het platform.

```
/new-tool email-generator
```

Maakt: API route, config, client component, translations, Stripe link, MCP server update.

### `/deploy` - Deployment naar Vercel

Voert pre-deployment checks uit en deployt naar Vercel.

```
/deploy              # Preview deployment
/deploy production   # Production deployment
```

Checkt: uncommitted changes, TypeScript errors, build, tests.

### `/update-pricing` - Prijs Wijzigen

Wijzigt de prijs van een tool in alle 4+ locaties.

```
/update-pricing cv-screener 0.002
/update-pricing invoice-extraction free
```

Update: config/tools.ts, MCP server, README, developer docs, CLAUDE.md.

### `/debug-payments` - Betalingsproblemen

Troubleshooting guide voor Solana en Stripe betalingen.

```
/debug-payments
/debug-payments solana
/debug-payments stripe
```

Diagnosticeert: 402 errors, QR code issues, session problemen, Redis issues.

---

## Hooks & Automation

Geconfigureerd in `.claude/settings.local.json`:

### Session Start Hook
- Toont huidige git branch bij start van sessie
- Initialiseert AIFAISS context

### Post-Commit Type Check
- Runt `npx tsc --noEmit` na git commits
- Voorkomt TypeScript errors in commits

### Status Line
- Toont huidige branch + "AIFAISS" label
- Altijd zichtbaar tijdens sessie

---

## Veelvoorkomende Taken

### Prijs Wijzigen
1. Update `config/tools.ts` - pricing object
2. Update `aifais-mcp-server/src/index.ts` - tool price
3. Update `aifais-mcp-server/README.md` - documentatie
4. Update `app/[locale]/developers/page.tsx` - docs page

### Nieuwe Sector/Categorie
1. Add to `config/sectors.ts`
2. Add translations in `messages/*.json`
3. Update search in `app/Components/layout/Header.tsx`

### Debug Payment Issues
1. Check Redis connection
2. Verify Solana RPC is responsive
3. Check transaction on Solana Explorer
4. Verify signature format in request

---

## Contact & Resources

- GitHub: `github.com/markjkaem/aifaiss`
- Solana Explorer: Check wallet transactions
- Sentry Dashboard: Error monitoring

---

## Session Startup Workflow

**BELANGRIJK:** Bij het starten van een coding sessie, voer deze stappen uit:

1. **Fetch Sentry Issues (background)** - Run `/sentry:getIssues` in the background at session start
   - Dit geeft context over huidige productie errors
   - Prioriteer fixes voor high-impact issues als relevant voor de taak

Dit zorgt ervoor dat je aware bent van productie issues voordat je code wijzigingen maakt.
