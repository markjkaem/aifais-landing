# Check Payments - Payment Systems Health

Verify Stripe and Solana payment systems are operational.

## Usage

```
/check-payments
/check-payments --stripe
/check-payments --solana
```

## Workflow

### Step 1: Check Stripe Connection

Use the Stripe MCP to verify connection:

```
Call: mcp__plugin_stripe_stripe__get_stripe_account_info
```

**Expected:** Returns account info with `account_id` and `display_name`

Verify:
- Account is connected
- Account is in live mode (for production)
- No restrictions on the account

### Step 2: Check Stripe Products & Prices

List products and prices to ensure payment links work:

```
Call: mcp__plugin_stripe_stripe__list_products
Call: mcp__plugin_stripe_stripe__list_prices
```

**Verify:**
- Products exist for each paid tool
- Prices are set correctly (€0.50)
- Prices are in EUR

### Step 3: Check Solana RPC

Test Solana connection by checking wallet balance:

```bash
# Check Solana RPC health
curl -s -X POST https://api.mainnet-beta.solana.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' | jq .result
```

**Expected:** `"ok"`

### Step 4: Check AIFAIS Wallet

Verify the receiving wallet is valid:

```bash
# Get wallet info
curl -s -X POST https://api.mainnet-beta.solana.com \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"getBalance",
    "params":["Bqpo3emFG46VGLX4korYoeta3a317pWbR2DMbWnFpZ8c"]
  }' | jq .result.value
```

### Step 5: Test Payment Verification Endpoints

```bash
# Test Stripe verification (should return error for invalid session)
curl -s "https://aifais.com/api/payments/verify-stripe?session_id=test"

# Test Solana verification (should return error for invalid signature)
curl -s "https://aifais.com/api/payments/verify-solana?signature=test"
```

**Expected:** Both return 400 with proper error messages (not 500)

### Step 6: Generate Report

```
## 💳 Payment Systems Health Report

**Timestamp:** 2024-01-15 14:30:00

### Stripe Status
| Check | Status | Details |
|-------|--------|---------|
| Connection | ✅ | Account: acct_xxx (Gamboge Jumper) |
| Mode | ✅ | Live mode |
| Products | ✅ | 8 products configured |
| Prices | ✅ | All prices set to €0.50 |
| Verification API | ✅ | Returns proper errors |

### Solana Status
| Check | Status | Details |
|-------|--------|---------|
| RPC Health | ✅ | mainnet-beta healthy |
| Wallet Valid | ✅ | Bqpo3...pZ8c exists |
| Wallet Balance | ✅ | X.XX SOL |
| Verification API | ✅ | Returns proper errors |

### Payment Links
| Tool | Stripe Link | Status |
|------|-------------|--------|
| Invoice Scanner | buy.stripe.com/xxx | ✅ Active |
| Contract Checker | buy.stripe.com/xxx | ✅ Active |
| CV Screener | buy.stripe.com/xxx | ✅ Active |
| ... | ... | ... |

### Overall Status: ✅ ALL SYSTEMS OPERATIONAL
```

## Environment Variables Check

Verify these are set:

```
STRIPE_PUBLIC_KEY      → pk_live_...
STRIPE_PRIVATE_KEY     → sk_live_...
SOLANA_WALLET_ADDRESS  → Bqpo3emFG46VGLX4korYoeta3a317pWbR2DMbWnFpZ8c
SOLANA_RPC_URL         → https://api.mainnet-beta.solana.com
NEXT_PUBLIC_STRIPE_LINK_SINGLE    → Set
NEXT_PUBLIC_STRIPE_LINK_CONTRACT  → Set
NEXT_PUBLIC_STRIPE_LINK_TERMS     → Set
NEXT_PUBLIC_STRIPE_LINK_CV        → Set
NEXT_PUBLIC_STRIPE_LINK_INTERVIEW → Set
NEXT_PUBLIC_STRIPE_LINK_SOCIAL    → Set
NEXT_PUBLIC_STRIPE_LINK_PITCH     → Set
NEXT_PUBLIC_STRIPE_LINK_LEAD      → Set
NEXT_PUBLIC_STRIPE_LINK_KVK       → Set
```

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Stripe 401 | Invalid API key | Check STRIPE_PRIVATE_KEY |
| Stripe test mode | Using test keys | Switch to live keys |
| Solana RPC timeout | RPC overloaded | Try different RPC endpoint |
| 402 not returning | Payment bypass enabled | Check DEV_BYPASS |
| Missing Stripe link | Not created | Run create-stripe-links script |

## Integration

Run this check:
- Before going live with payments
- After changing Stripe/Solana config
- When payment issues are reported
- Monthly health check
