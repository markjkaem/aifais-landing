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
| Tool | Prijs | Status | Category |
|------|-------|--------|----------|
| Factuur Scanner | 0.001 SOL | Live | Finance |
| Factuur Maker | GRATIS | Live | Finance |
| Offerte Generator | GRATIS | Live | Finance |
| Prijs Calculator | GRATIS | Live | Finance |
| Contract Checker | 0.001 SOL | Live | Legal |
| Algemene Voorwaarden | 0.001 SOL | Live | Legal |
| CV Screener | 0.001 SOL | Live | HR |
| Interview Questions | 0.001 SOL | Live | HR |
| Social Media Planner | 0.001 SOL | Live | Marketing |
| Email Generator | GRATIS | Live | Marketing |
| Lead Scorer | 0.001 SOL | Live | Sales |
| Pitch Deck Generator | 0.001 SOL | Live | Sales |
| Competitor Analyzer | 0.001 SOL | Live | Sales |
| Business Plan Generator | 0.001 SOL | Live | Consulting |
| SWOT Generator | 0.001 SOL | Live | Consulting |
| Meeting Summarizer | 0.001 SOL | Live | Business |
| ROI Calculator | GRATIS | Live | Finance |
| AI Benchmark | GRATIS | Live | Internal |
| KVK Bedrijfszoeker | GRATIS | Live | Business |

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

**Testing Paid Tools:**
In development mode, bypass payment with `signature: "DEV_BYPASS"`:
```bash
curl -X POST http://localhost:3000/api/v1/business/kvk-search \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"query": "Coolblue", "type": "naam", "signature": "DEV_BYPASS"}'
```

---

## Environment Variables

Zie `.env.example` voor alle variables:

```env
# AI
ANTHROPIC_API_KEY=sk-ant-...

# OpenKVK (FREE - register at overheid.io)
OPENKVK_API_KEY=your-openkvk-api-key

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
bun run dev              # Start development server
bun run build            # Production build
bun run start            # Start production server
bun run test             # Run tests (Vitest)
bun run test:watch       # Tests in watch mode (TDD)
bun run test:coverage    # Tests met coverage report
bun run test:ui          # Vitest UI
bun run type-check       # TypeScript check
bun run lint             # ESLint
bun run e2e              # Playwright E2E tests
bun run e2e:ui           # Playwright met UI
bun run e2e:headed       # Playwright in browser
bun run generate:mcp-readme  # Generate MCP README

# Stripe Payment Links
bunx tsx scripts/create-stripe-links.ts   # Maak alle ontbrekende Stripe links
bunx tsx scripts/ensure-stripe-links.ts   # Check en maak ontbrekende links
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

### `/check-sentry` - Pre-Deploy Sentry Gate

Check voor unresolved critical Sentry issues voor deployment.

```
/check-sentry
/check-sentry --strict
```

Blokkeert deployment als er kritieke issues zijn (>100 users affected).

### `/check-translations` - i18n Sync Validator

Verifieert dat alle translation keys in zowel `en.json` als `nl.json` bestaan.

```
/check-translations
/check-translations --fix
```

Vindt: ontbrekende keys, lege values, structuur mismatches.

### `/check-api-health` - API Endpoint Validator

Verifieert dat alle API endpoints correct reageren.

```
/check-api-health
/check-api-health --production
/check-api-health --local
```

Test: alle /api/v1/* endpoints, payment verificatie, MCP endpoint.

### `/check-payments` - Payment Systems Health

Verifieert Stripe en Solana payment systemen.

```
/check-payments
/check-payments --stripe
/check-payments --solana
```

Checkt: Stripe connection, products/prices, Solana RPC, wallet balance.

### `/check-mcp-sync` - MCP-API Alignment Validator

Verifieert dat MCP server tool definities matchen met API routes.

```
/check-mcp-sync
```

Vindt: ontbrekende MCP tools, orphaned tools, pricing mismatches.

### `/test-tool` - Quick API Tester

Test API endpoints snel met DEV_BYPASS tijdens development.

```
/test-tool kvk-search {"query": "Coolblue", "type": "naam"}
/test-tool cv-screener {"cvText": "Senior developer..."}
```

Voegt automatisch DEV_BYPASS toe aan betaalde endpoints.

### `/verify` - Verificatie Suite (Boris Principle)

Runt comprehensive verificatie na code changes.

```
/verify              # Alle checks
/verify build        # Alleen build
/verify types        # Alleen TypeScript
/verify tests        # Alleen tests
```

Checkt: TypeScript → Lint → Tests → Build. Stopt bij eerste fout.

### `/scaffold-tests` - Test Generator

Genereer unit tests voor API routes op basis van template.

```
/scaffold-tests finance/create-invoice  # Specifieke route
/scaffold-tests all                      # Alle untested routes
/scaffold-tests --check                  # Lijst routes zonder tests
```

Genereert tests in `app/api/v1/{route}/route.test.ts`.

### `/browser-test` - Browser Tool Verificatie

Test een tool in de browser met automatische DEV_BYPASS.

```
/browser-test cv-screener              # Test tool in browser
/browser-test invoice-generator --headed # Watch in browser
```

Navigeert naar `http://localhost:3000/nl/tools/{slug}?dev=true` en verifieert:
- Page loads
- Form werkt
- Geen payment modal (dev mode)
- Result displays

---

## Dev Mode (Browser Testing)

In development kun je betaalde tools testen zonder payment:

**URL Parameter:** Voeg `?dev=true` toe aan de tool URL:
```
http://localhost:3000/nl/tools/cv-screener?dev=true
```

**Hoe het werkt:**
1. `useDevMode` hook detecteert `?dev=true` parameter
2. `usePaywallTool` hook gebruikt automatisch `DEV_BYPASS` signature
3. Backend accepteert `DEV_BYPASS` alleen in `NODE_ENV=development`

**Bestanden:**
- `hooks/useDevMode.ts` - Dev mode detectie
- `hooks/usePaywallTool.ts` - Automatische bypass
- `lib/security/dev-bypass.ts` - Server-side verificatie

---

## Hooks & Automation

Geconfigureerd in `.claude/settings.local.json`:

### Session Start Hook
- Toont huidige git branch bij start van sessie
- Initialiseert AIFAISS context

### Post-Commit Type Check
- Runt `npx tsc --noEmit` na git commits
- Voorkomt TypeScript errors in commits

### Production Deploy Reminder
- Triggered bij `vercel --prod` commando
- Herinnert om `/check-sentry` en `/check-api-health` te runnen
- Voorkomt deployment zonder health checks

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

---

## MANDATORY Workflows (Automatisch Volgen)

**Claude MOET deze workflows volgen wanneer specifieke taken worden gevraagd:**

### Bij "Maak nieuwe tool" / "Create new tool":
1. Volg `/new-tool` skill volledig (alle 13 stappen)
2. **VERPLICHT: Browser verificatie** - Gebruik Playwright om tool te testen met `?dev=true`
3. Run `/verify` voordat je klaar meldt
4. Maak screenshot van werkende tool
5. **Git commit & push:**
   ```bash
   git add -A
   git commit -m "feat: add [tool-name] tool"
   git push origin master
   ```
6. **Vercel deployment check & auto-fix loop:**
   - Wacht 30-60 seconden na push
   - Check deployment: `curl -s https://aifais.com/api/health`
   - **Als deployment FAALT:**
     1. Check Vercel logs: `vercel logs --limit 50`
     2. Identificeer de error
     3. Fix de code
     4. `git add -A && git commit -m "fix: [error description]" && git push`
     5. Wacht 30-60 sec, check opnieuw
     6. **HERHAAL tot deployment slaagt** (max 5 pogingen)
   - Meld: "Vercel deployment ✅ succesvol na X pogingen" of "❌ kon niet fixen na 5 pogingen"

### Bij code changes aan bestaande tools:
1. Test de gewijzigde tool met `/browser-test [tool-slug]`
2. Run type check: `bunx tsc --noEmit`
3. Git commit & push met descriptieve message
4. **Vercel deployment check & auto-fix loop** (zelfde als hierboven)
5. Meld aan gebruiker: "Getest in browser ✅, deployed ✅ na X pogingen"

### Bij ALLE website wijzigingen (pages, components, config, styling):
1. **Check Sentry EERST:** `search_issues` voor unresolved issues in laatste 24h
   - Fix kritieke issues voordat je nieuwe wijzigingen maakt
   - Negeer third-party errors (browser extensions, iOS Safari internal code)
   - **Na fix: `update_issue` met `status: resolved`** om issue te sluiten
2. **Maak de wijzigingen**
3. **TypeScript check:** `bunx tsc --noEmit`
4. **Start dev server:** `bun run dev` (in background)
5. **Browser test met Playwright:**
   - Navigeer naar de gewijzigde pagina(s)
   - Verifieer visueel dat alles correct rendert
   - Check console voor errors
6. **Git commit & push** met descriptieve message (gebruik `Fixes ISSUE-ID` in commit)
7. **Vercel deployment check:**
   - Wacht 30-60 sec
   - Verifieer op production URL
   - Als FAALT: fix → commit → push → herhaal (max 5x)
8. **Meld resultaat:** "Sentry ✅, Browser test ✅, deployed ✅"

### Bij API/Tool wijzigingen - Sync Requirements:
Wanneer je APIs of tools wijzigt, update ALTIJD deze locaties:

| Wijziging | Update ook |
|-----------|------------|
| Nieuwe tool | `config/tools.ts`, `config/apis.ts`, `lib/ai/prompts.ts`, `lib/security/schemas.ts`, componentMap in `page.tsx` |
| Nieuwe API endpoint | `config/apis.ts` (voor /developers page) |
| Prijs wijziging | `config/tools.ts`, `config/apis.ts`, `CLAUDE.md` (pricing table), MCP server |
| Nieuwe category | `config/apis.ts` (API_CATEGORIES), developers page colorClasses |
| UI tekst toevoegen | BEIDE `messages/en.json` EN `messages/nl.json` |

### Vóór production deployment:
1. `/check-sentry` - Check voor kritieke issues
2. `/verify` - Full verificatie suite
3. `/check-api-health` (optioneel) - Test alle endpoints

---

## DON'T DO - Geleerde Lessen

**BELANGRIJK:** Deze sectie bevat dingen die Claude NIET moet doen. Update deze lijst wanneer Claude fouten maakt.

### Code Patterns
- ❌ **Gebruik GEEN `npm`** - Dit project gebruikt `bun`. Gebruik `bun install`, `bun run`, `bunx`
- ❌ **Geen hardcoded Stripe links** - Altijd via `process.env.NEXT_PUBLIC_STRIPE_LINK_*`
- ❌ **Geen DEV_BYPASS in production code** - Alleen in test files en lokale development
- ❌ **Geen inline styles** - Gebruik Tailwind CSS classes
- ❌ **Geen `any` types** - Definieer proper types in `lib/tools/types.ts`
- ❌ **Geen `setResult(data)` in client components** - `createToolHandler` wrapt responses in `{success, data, meta}`. Gebruik `setResult(data.data)` om actual result te extracten

### API Routes
- ❌ **Geen directe Anthropic calls** - Gebruik `lib/ai/prompts.ts` voor prompts
- ❌ **Geen handmatige payment checks** - Gebruik `createToolHandler` met `requiresPayment: true`
- ❌ **Geen nieuwe API routes zonder schema** - Altijd Zod schema in `lib/security/schemas.ts`

### Vertalingen
- ❌ **Geen hardcoded Nederlandse/Engelse tekst in components** - Gebruik `useTranslations()`
- ❌ **Geen nieuwe keys in één taal** - Update BEIDE `en.json` en `nl.json`

### Git & Deployment
- ❌ **Geen commits zonder type check** - Hook runt automatisch, maar fix errors eerst
- ❌ **Geen production deploy zonder checks** - Run `/verify` of `/check-api-health` eerst
- ❌ **Geen force push naar master** - Alleen via PR met CI checks

### Verificatie (Boris Principle)
- ❌ **Geen code changes zonder verificatie** - Run altijd `/verify` na wijzigingen
- ❌ **Geen aannames over werkende code** - Test met `/test-tool` of curl
- ❌ **Geen grote refactors zonder plan mode** - Start in plan mode, krijg eerst goedkeuring
- ❌ **Geen nieuwe tools zonder Playwright browser test** - Test lokaal met Playwright MCP tools VOOR git push. Na deployment: FREE tools volledig testen op production, PAID tools alleen page load checken (kan niet testen zonder te betalen)

### Sync & Documentation
- ❌ **Geen nieuwe APIs zonder config/apis.ts update** - Developers page haalt data uit config/apis.ts
- ❌ **Geen nieuwe categories zonder colorClasses check** - Developers page gebruikt colorClasses object
- ❌ **Geen tool wijzigingen zonder CLAUDE.md update** - Houd Tool Pricing table actueel
- ❌ **Geen wijzigingen zonder browser test** - ALTIJD Playwright gebruiken om visueel te verifiëren

### Process Killing (Windows)
- ❌ **Geen `taskkill /F /PID` met forward slashes** - Windows gebruikt `//F //PID` in Git Bash
- ❌ **Geen dev server starten zonder port check** - Check eerst of port 3000 vrij is met `netstat -ano | findstr ":3000"`
- ❌ **Geen lock file issues negeren** - Verwijder `.next/dev/lock` als dev server crashed
