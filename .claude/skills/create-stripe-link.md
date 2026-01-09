# Create Stripe Link Skill

Maak een Stripe Payment Link voor een AIFAISS tool en push direct naar Vercel.

## Usage

```
/create-stripe-link [tool-name]
```

## Wat het doet

1. Maakt Stripe Product aan
2. Maakt Stripe Price aan (€0.50)
3. Maakt Payment Link aan
4. Voegt toe aan lokale `.env`
5. Pusht naar Vercel environment variables
6. Update `config/tools.ts` met de nieuwe link

## Workflow

### Step 1: Verzamel Tool Info

Als tool-name niet gegeven is, vraag:
- Tool slug (bijv. `cv-screener`)
- Display name (bijv. `CV Screener`)

### Step 2: Check bestaande Stripe Products

```typescript
// Check of product al bestaat
mcp__plugin_stripe_stripe__list_products({ limit: 100 })
```

Zoek naar product met naam die matcht met "AIFAISS - {Tool Name}".
Als gevonden, gebruik bestaande product ID.

### Step 3: Maak Stripe Product (indien nodig)

```typescript
mcp__plugin_stripe_stripe__create_product({
    name: "AIFAISS - {Tool Display Name}",
    description: "Eenmalig gebruik van {Tool Display Name} op aifais.com"
})
```

Bewaar de `prod_xxx` ID.

### Step 4: Maak Stripe Price

```typescript
mcp__plugin_stripe_stripe__create_price({
    product: "prod_xxx",
    unit_amount: 50,  // €0.50 in cents
    currency: "eur"
})
```

Bewaar de `price_xxx` ID.

### Step 5: Maak Payment Link

```typescript
mcp__plugin_stripe_stripe__create_payment_link({
    price: "price_xxx",
    quantity: 1
})
```

Bewaar de payment link URL (bijv. `https://buy.stripe.com/xxx`).

### Step 6: Bepaal Env Var Naam

Converteer tool slug naar env var naam:
- `cv-screener` → `NEXT_PUBLIC_STRIPE_LINK_CV`
- `interview-questions` → `NEXT_PUBLIC_STRIPE_LINK_INTERVIEW`
- `social-planner` → `NEXT_PUBLIC_STRIPE_LINK_SOCIAL`
- `lead-scorer` → `NEXT_PUBLIC_STRIPE_LINK_LEAD`
- `pitch-deck` → `NEXT_PUBLIC_STRIPE_LINK_PITCH`
- `contract-checker` → `NEXT_PUBLIC_STRIPE_LINK_CONTRACT`
- `terms-generator` → `NEXT_PUBLIC_STRIPE_LINK_TERMS`
- `invoice-scanner` → `NEXT_PUBLIC_STRIPE_LINK_SINGLE`

Voor nieuwe tools: `NEXT_PUBLIC_STRIPE_LINK_{FIRST_WORD_UPPERCASE}`

### Step 7: Update lokale .env

Voeg toe aan `.env`:
```
NEXT_PUBLIC_STRIPE_LINK_XXX=https://buy.stripe.com/xxx
```

### Step 8: Push naar Vercel

```bash
# Add to all environments (production, preview, development)
echo "https://buy.stripe.com/xxx" | vercel env add NEXT_PUBLIC_STRIPE_LINK_XXX production
echo "https://buy.stripe.com/xxx" | vercel env add NEXT_PUBLIC_STRIPE_LINK_XXX preview
echo "https://buy.stripe.com/xxx" | vercel env add NEXT_PUBLIC_STRIPE_LINK_XXX development
```

**Of als de env var al bestaat, gebruik:**
```bash
vercel env rm NEXT_PUBLIC_STRIPE_LINK_XXX production -y
echo "https://buy.stripe.com/xxx" | vercel env add NEXT_PUBLIC_STRIPE_LINK_XXX production
```

### Step 9: Update config/tools.ts

Zoek de tool in `TOOL_REGISTRY` en update het `stripeLink` veld:

```typescript
pricing: {
    type: "paid",
    price: 0.001,
    currency: "SOL",
    priceEur: 0.50,
    stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_XXX,
},
```

### Step 10: Rapporteer Resultaat

```
## Stripe Payment Link Created

| Item | Value |
|------|-------|
| Tool | {tool-name} |
| Product ID | prod_xxx |
| Price ID | price_xxx |
| Payment Link | https://buy.stripe.com/xxx |
| Env Var | NEXT_PUBLIC_STRIPE_LINK_XXX |

### Status
- [x] Stripe Product created
- [x] Stripe Price created
- [x] Payment Link created
- [x] Added to .env
- [x] Pushed to Vercel (production, preview, development)
- [x] Updated config/tools.ts

**Next:** Redeploy om de nieuwe env var actief te maken:
```bash
vercel --prod
```
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Product already exists" | Gebruik bestaande product, maak alleen price/link |
| "Vercel not linked" | Run `vercel link` eerst |
| "Permission denied" | Check Vercel login: `vercel login` |
| "Price already exists" | List prices: `list_prices({ product: "prod_xxx" })` |

## Voorbeelden

```
/create-stripe-link cv-screener
/create-stripe-link meeting-summarizer
/create-stripe-link competitor-analyzer
```

## Gerelateerde Skills

- `/new-tool` - Volledige tool creatie (gebruikt deze skill voor betaalde tools)
- `/update-pricing` - Wijzig prijs van bestaande tool
