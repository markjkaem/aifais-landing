# Debug Payments Skill

Troubleshoot payment issues for both Solana and Stripe payments.

## Usage

```
/debug-payments
/debug-payments solana
/debug-payments stripe
```

## Quick Diagnosis

Ask the user:
1. **Which payment method?** (Solana or Stripe)
2. **What's the error?** (402, 500, timeout, etc.)
3. **Which tool?** (invoice-extraction, cv-screener, etc.)
4. **Environment?** (local dev, preview, production)

## Solana Payment Issues

### Issue: 402 Payment Required (even after paying)

**Check 1: Verify transaction on blockchain**
```bash
# User should provide the transaction signature
# Check on Solana Explorer: https://explorer.solana.com/tx/[SIGNATURE]
```

**Check 2: Verify correct wallet received payment**
```typescript
// Expected wallet (from .env):
NEXT_PUBLIC_SOLANA_WALLET=Bqpo3emFG46VGLX4korYoeta3a317pWbR2DMbWnFpZ8c
```

**Check 3: Verify amount is correct**
- Most tools: 0.001 SOL
- Check `config/tools.ts` for exact price

**Check 4: Check Redis connection**
```typescript
// File: lib/redis.ts
// Redis tracks used signatures to prevent replay attacks
```

**Check 5: Signature format**
- Must be base58 encoded
- ~88 characters long
- Example: `5UfDuX...abc123`

### Issue: QR Code not generating

**Check 1: Wallet address configured**
```bash
# Verify env var is set
echo $NEXT_PUBLIC_SOLANA_WALLET
```

**Check 2: RPC endpoint working**
```bash
curl -X POST https://api.mainnet-beta.solana.com -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

### Issue: Transaction not being detected

**Check 1: Polling is active**
- CryptoModal polls every 3 seconds after 5 second delay
- Check browser console for polling errors

**Check 2: Reference key matching**
- Each session generates unique reference key
- Transaction must include this reference

**Check 3: Transaction timing**
- Must be after modal opened (startTime check)
- Old transactions are ignored

## Stripe Payment Issues

### Issue: 402 Payment Required (after Stripe checkout)

**Check 1: Session ID in URL**
```
// After Stripe redirect, URL should have:
?session_id=cs_test_...
```

**Check 2: Verify session with Stripe**
```typescript
// File: app/api/payments/verify-stripe/route.ts
// Check: stripe.checkout.sessions.retrieve(sessionId)
```

**Check 3: Payment status**
```typescript
// Session must have: payment_status === "paid"
```

**Check 4: Session not already used**
- Redis tracks used sessions (24h expiry)
- Check: `stripe_session:${sessionId}` in Redis

### Issue: Stripe checkout not redirecting back

**Check 1: Success URL configured in Stripe link**
- Payment Link should redirect to tool page with `?session_id={CHECKOUT_SESSION_ID}`

**Check 2: Browser blocking redirect**
- Check for popup blockers
- Check browser console for errors

### Issue: iDEAL not showing

**Check 1: Payment Link configuration**
- Payment Link must have `payment_method_types: ['card', 'ideal']`

**Check 2: Currency**
- iDEAL only works with EUR
- Check price is in EUR

### Issue: Wrong amount charged

**Check 1: Stripe Payment Link price**
- Go to Stripe Dashboard → Payment Links
- Verify price is €0.50 (or correct amount)

**Check 2: Tool pricing config**
```typescript
// File: config/tools.ts
pricing: {
    priceEur: 0.50,  // Must match Stripe link
}
```

## Redis Issues

### Issue: Redis connection failed

**Check 1: Redis URL**
```bash
# Verify REDIS_URL is set and valid
echo $REDIS_URL
```

**Check 2: Test connection**
```typescript
// File: lib/redis.ts
// Should log: "✅ Redis verbinding succesvol."
```

**Check 3: Redis server status**
- Check your Redis provider dashboard (Upstash, Redis Cloud, etc.)

### Issue: Replay attack detected (valid payment rejected)

**Cause:** Same signature/session used twice

**Solution:** User must make new payment

**Prevention:** This is expected behavior - each payment = one use

## Environment-Specific Issues

### Local Development

**DEV_BYPASS available:**
```typescript
// File: lib/security/dev-bypass.ts
// In dev mode, can bypass payment for testing
// Set: NODE_ENV=development
```

### Production

**No bypass available** - payments must be real

**Test mode vs Live mode:**
- Test Stripe keys: `sk_test_...`, `pk_test_...`
- Live Stripe keys: `sk_live_...`, `pk_live_...`
- Test Solana: Use devnet RPC
- Live Solana: Use mainnet RPC

## Diagnostic Commands

```bash
# Check all payment-related env vars
env | grep -E "(STRIPE|SOLANA|REDIS)"

# Test Redis connection
npx tsx -e "import redis from './lib/redis'; redis.ping().then(console.log)"

# Check Stripe API
curl https://api.stripe.com/v1/payment_links -u sk_test_xxx:

# Check Solana RPC
curl -X POST $NEXT_PUBLIC_SOLANA_RPC -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/payment-gatekeeper.ts` | Central payment verification |
| `app/api/payments/verify-solana/route.ts` | Solana verification endpoint |
| `app/api/payments/verify-stripe/route.ts` | Stripe verification endpoint |
| `app/Components/CryptoModal.tsx` | Solana Pay QR modal |
| `app/Components/tools/PaywallToolWrapper.tsx` | Payment method selector |
| `hooks/usePaywallTool.ts` | Client-side payment flow |
| `lib/redis.ts` | Redis connection |

## Escalation Path

If issue persists after these checks:

1. **Check Sentry** - `/sentry:getIssues` for related errors
2. **Check logs** - Vercel Function logs for API errors
3. **Check Stripe Dashboard** - For failed payments/webhooks
4. **Check Solana Explorer** - For transaction details

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Payment required" | No valid payment proof | User must pay |
| "Session already used" | Replay attack prevention | Make new payment |
| "Invalid signature" | Malformed Solana signature | Check signature format |
| "Session not found" | Invalid Stripe session ID | Check URL for session_id |
| "Redis connection failed" | Redis unavailable | Check Redis URL/server |
