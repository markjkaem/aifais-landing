# Check Sentry - Pre-Deploy Gate

Check for unresolved critical Sentry issues before deploying to production.

## Usage

```
/check-sentry
/check-sentry --strict
```

## Workflow

### Step 1: Fetch Recent Issues

Use the Sentry MCP to get recent unresolved issues:

```
Call: mcp__plugin_sentry_sentry__search_issues
Organization: (get from mcp__plugin_sentry_sentry__find_organizations)
Query: "unresolved issues from the last 24 hours"
```

### Step 2: Analyze Issue Severity

Categorize issues by severity:

| Level | Criteria | Deploy? |
|-------|----------|---------|
| 🔴 Critical | > 100 users affected OR "crash" in title | ❌ BLOCK |
| 🟠 High | 10-100 users affected | ⚠️ WARNING |
| 🟡 Medium | < 10 users affected | ✅ OK |
| 🟢 Low | Edge cases, handled errors | ✅ OK |

### Step 3: Generate Report

Output a deployment readiness report:

```
## 🚦 Sentry Deployment Gate

**Status:** ✅ PASS / ⚠️ WARNING / ❌ BLOCKED

### Issue Summary
- Critical: X issues (Y users affected)
- High: X issues
- Medium: X issues
- Low: X issues

### Critical Issues (if any)
1. [ISSUE-ID] - Title - X users affected
   Link: https://sentry.io/...

### Recommendation
[Deploy / Fix critical issues first / Review warnings]
```

### Step 4: Decision

**If `--strict` flag is used:**
- ANY unresolved issue = BLOCK deployment
- Useful for production releases

**Default mode:**
- Only Critical issues block deployment
- High issues show warnings
- Medium/Low issues are informational

## Integration with /deploy

This check is automatically suggested before production deployments. The `/deploy` skill should call this first:

```
1. Run /check-sentry
2. If BLOCKED → Stop and show issues
3. If WARNING → Ask user to confirm
4. If PASS → Proceed with deployment
```

## Sentry Queries

Useful queries for issue search:

```
# Unresolved in last 24h
"unresolved issues from the last 24 hours"

# High impact issues
"unresolved issues affecting more than 100 users"

# Recent crashes
"crash errors from this week"

# Payment-related issues
"unresolved errors containing payment or stripe"
```

## Environment

Requires Sentry MCP to be connected. Check with:
```
mcp__plugin_sentry_sentry__whoami
```
