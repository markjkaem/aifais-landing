# /browser-test - Browser Tool Verification (Boris Principle)

Test a tool directly in the browser with automatic DEV_BYPASS. Uses Playwright for verification.

## Usage

```
/browser-test <tool-slug>              # Test specific tool
/browser-test <tool-slug> --screenshot # Take screenshot of result
/browser-test <tool-slug> --headed     # Watch in browser
```

## Examples

```bash
/browser-test cv-screener
/browser-test invoice-generator --screenshot
/browser-test social-planner --headed
```

## How It Works

1. **Dev Mode URL**: Adds `?dev=true` to bypass payment in development
2. **Playwright**: Navigates to tool, fills form, submits, verifies result
3. **Screenshot**: Captures result for visual verification

## Instructions

When this skill is invoked:

### 1. Ensure dev server is running

Check if localhost:3000 is available:
```bash
curl -s http://localhost:3000 > /dev/null && echo "Server running" || echo "Start server with: bun run dev"
```

If not running, inform user to start it.

### 2. Map tool slug to URL and test data

| Tool | URL | Test Data |
|------|-----|-----------|
| cv-screener | `/nl/tools/cv-screener?dev=true` | cvText, jobDescription |
| interview-questions | `/nl/tools/interview-questions?dev=true` | jobTitle, level |
| contract-checker | `/nl/tools/contract-checker?dev=true` | contractText |
| social-planner | `/nl/tools/social-planner?dev=true` | business, goals |
| lead-scorer | `/nl/tools/lead-scorer?dev=true` | leadInfo |
| invoice-generator | `/nl/tools/factuur-maker?dev=true` | clientName, items |
| quote-generator | `/nl/tools/offerte-generator?dev=true` | clientName, items |
| terms-generator | `/nl/tools/algemene-voorwaarden?dev=true` | companyName |
| pitch-deck | `/nl/tools/pitch-deck?dev=true` | companyName, problem |

### 3. Run Playwright test

Use Playwright MCP tools or run inline test:

```typescript
// Using Playwright MCP
mcp__plugin_playwright_playwright__browser_navigate({
    url: "http://localhost:3000/nl/tools/{tool-slug}?dev=true"
});

// Take snapshot to see the page
mcp__plugin_playwright_playwright__browser_snapshot();

// Fill form fields (ref from snapshot)
mcp__plugin_playwright_playwright__browser_type({
    element: "input field",
    ref: "ref-from-snapshot",
    text: "test value"
});

// Click submit button
mcp__plugin_playwright_playwright__browser_click({
    element: "Submit button",
    ref: "ref-from-snapshot"
});

// Wait for result
mcp__plugin_playwright_playwright__browser_wait_for({
    text: "Resultaat"  // Or success indicator
});

// Take screenshot of result
mcp__plugin_playwright_playwright__browser_take_screenshot({
    filename: "tool-test-result.png"
});
```

### 4. Verify the result

Check that:
- [ ] Page loaded without errors
- [ ] Form was fillable
- [ ] Submit button was clickable
- [ ] Result appeared (no payment modal!)
- [ ] Result contains expected data structure

### 5. Report to user

```
## Browser Test: {tool-slug}

| Step | Status |
|------|--------|
| Page Load | ✅ |
| Form Fill | ✅ |
| Submit | ✅ |
| Result | ✅ |

Screenshot: tool-test-result.png

The tool works correctly in the browser with DEV_BYPASS.
```

## Dev Mode Indicator

When `?dev=true` is in the URL:
- Payment is automatically bypassed
- `usePaywallTool` hook returns `isDevMode: true`
- Components can show a "DEV MODE" badge

## Test Data Examples

### CV Screener
```json
{
    "cvText": "Software Engineer met 5 jaar ervaring in React en Node.js. Gewerkt bij tech startups.",
    "jobDescription": "Senior Frontend Developer gezocht met React ervaring."
}
```

### Interview Questions
```json
{
    "jobTitle": "Product Manager",
    "level": "senior",
    "focusAreas": ["leadership", "strategy"]
}
```

### Social Planner
```json
{
    "business": "SaaS startup voor project management",
    "goals": ["meer leads", "brand awareness"],
    "platforms": ["linkedin", "twitter"]
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Payment modal still shows | Check `?dev=true` in URL |
| 402 error | Verify NODE_ENV=development |
| Form not found | Check tool slug matches URL |
| Timeout | Increase wait time, check dev server |

## Boris Principle

> "Verification is key - Claude performs much better when it can verify its own work."

This skill provides **visual verification** that:
1. The tool UI renders correctly
2. The form works
3. Payment bypass works in development
4. Results display properly
