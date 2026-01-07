# Deploy Skill

Deploy the AIFAISS application to Vercel with pre-deployment checks.

## Usage

```
/deploy
/deploy production
/deploy preview
```

## Workflow

### Step 1: Pre-Deployment Checks

Run these checks before deploying:

```bash
# 1. Check for uncommitted changes
git status

# 2. Run type check
npx tsc --noEmit

# 3. Run build
bun run build

# 4. Run tests (if any)
bun run test
```

**Stop deployment if any check fails.**

### Step 2: Check Environment

Verify critical environment variables are set in Vercel:

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes | Claude API |
| `STRIPE_PRIVATE_KEY` | Yes | Stripe payments |
| `REDIS_URL` | Yes | Session/cache storage |
| `NEXT_PUBLIC_SOLANA_WALLET` | Yes | Solana payments |
| `SENTRY_AUTH_TOKEN` | Yes | Error monitoring |

### Step 3: Deploy

**Preview deployment:**
```bash
vercel
```

**Production deployment:**
```bash
vercel --prod
```

### Step 4: Post-Deployment Verification

After deployment completes:

1. **Check the deployment URL** - Visit and verify homepage loads
2. **Test a free tool** - Try the Invoice Maker or ROI Calculator
3. **Check Sentry** - Run `/sentry:getIssues` to see if new errors appeared
4. **Verify API health** - Check `/api/mcp` returns valid response

```bash
# Quick health check
curl -s https://aifais.com/api/mcp | head -20
```

### Step 5: Rollback (if needed)

If issues are found:

```bash
# List recent deployments
vercel ls

# Rollback to previous
vercel rollback
```

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] Build succeeds locally
- [ ] No TypeScript errors
- [ ] Environment variables configured in Vercel
- [ ] Stripe payment links are live (not test mode)
- [ ] Database migrations applied (if any)

## Common Issues

| Issue | Solution |
|-------|----------|
| Build fails on Vercel | Check Node version matches local |
| API routes 500 | Verify env vars are set in Vercel |
| Payments not working | Check Stripe keys are live, not test |
| Sentry not reporting | Verify SENTRY_AUTH_TOKEN is valid |

## Environment-Specific Notes

### Preview Deployments
- Use test Stripe keys
- Safe for testing payment flows
- URL format: `aifaiss-*.vercel.app`

### Production Deployments
- Use live Stripe keys
- URL: `aifais.com`
- Sentry source maps uploaded automatically

## Quick Deploy Commands

```bash
# Preview (safe, creates new URL)
vercel

# Production (updates aifais.com)
vercel --prod

# Force rebuild
vercel --force

# Deploy specific branch
git push origin feature-branch && vercel
```
