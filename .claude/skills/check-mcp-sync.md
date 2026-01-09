# Check MCP Sync - API Alignment Validator

Ensure MCP server tool definitions match the actual API routes.

## Usage

```
/check-mcp-sync
```

## Workflow

### Step 1: Load MCP Server Tools

Read `aifais-mcp-server/src/index.ts` and extract the TOOLS object:

```typescript
const TOOLS = {
    scan_invoice: { endpoint: "/finance/scan", ... },
    check_contract: { endpoint: "/legal/check-contract", ... },
    // etc.
}
```

### Step 2: Load API Routes

Scan `app/api/v1/` directory for route files:

```
app/api/v1/
├── finance/
│   ├── scan/route.ts
│   ├── create-invoice/route.ts
│   └── generate-quote/route.ts
├── legal/
│   ├── check-contract/route.ts
│   └── generate-terms/route.ts
├── hr/
│   ├── cv-screener/route.ts
│   └── interview-questions/route.ts
├── marketing/
│   └── social-planner/route.ts
├── sales/
│   ├── lead-scorer/route.ts
│   └── pitch-deck/route.ts
└── business/
    └── kvk-search/route.ts
```

### Step 3: Load Tool Registry

Read `config/tools.ts` and extract TOOL_REGISTRY.

### Step 4: Compare All Three Sources

| Source | Contains |
|--------|----------|
| MCP Server | Tool definitions + endpoints |
| API Routes | Actual endpoint implementations |
| Tool Registry | UI metadata + pricing |

Find discrepancies:
1. **MCP tool without API route** - MCP defines tool but route doesn't exist
2. **API route without MCP tool** - Route exists but not exposed via MCP
3. **Tool registry mismatch** - Pricing/name differs between sources
4. **Endpoint path mismatch** - MCP endpoint doesn't match API route path

### Step 5: Generate Report

```
## 🔄 MCP-API Sync Report

**Timestamp:** 2024-01-15 14:30:00

### Summary
- MCP Tools: 10
- API Routes: 11
- Tool Registry: 12
- Sync Issues: 2

### Sync Matrix

| Tool | MCP | API | Registry | Status |
|------|-----|-----|----------|--------|
| scan_invoice | ✅ | ✅ | ✅ | ✅ Synced |
| check_contract | ✅ | ✅ | ✅ | ✅ Synced |
| kvk_search | ❌ | ✅ | ✅ | ⚠️ Missing in MCP |
| old_tool | ✅ | ❌ | ❌ | ⚠️ Orphaned MCP tool |

### Issues Found

#### 1. Missing in MCP Server
These API routes exist but aren't exposed via MCP:
- `/api/v1/business/kvk-search` → Add `kvk_search` to MCP

#### 2. Orphaned MCP Tools
These MCP tools have no corresponding API:
- (none)

#### 3. Pricing Mismatches
| Tool | MCP Price | Registry Price |
|------|-----------|----------------|
| (none) | | |

### Recommended Actions
1. [ ] Add kvk_search to aifais-mcp-server/src/index.ts
2. [ ] Update MCP README with new tool
3. [ ] Test MCP server locally

### Files to Update
- `aifais-mcp-server/src/index.ts` - Add missing tools
- `aifais-mcp-server/README.md` - Update documentation
```

## Expected Tool Mapping

| MCP Tool Name | API Endpoint | Registry ID |
|---------------|--------------|-------------|
| scan_invoice | /finance/scan | invoice-extraction |
| create_invoice | /finance/create-invoice | invoice-creation |
| generate_quote | /finance/generate-quote | quote-generator |
| check_contract | /legal/check-contract | contract-checker |
| generate_terms | /legal/generate-terms | terms-generator |
| cv_screener | /hr/cv-screener | cv-screener |
| interview_questions | /hr/interview-questions | interview-questions |
| social_planner | /marketing/social-planner | social-planner |
| lead_scorer | /sales/lead-scorer | lead-scorer |
| pitch_deck | /sales/pitch-deck | pitch-deck |
| kvk_search | /business/kvk-search | kvk-search |

## Automation Script

For CI/CD integration:

```typescript
// scripts/check-mcp-sync.ts
import { TOOLS } from '../aifais-mcp-server/src/index';
import { TOOL_REGISTRY } from '../config/tools';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

// Get all API routes
function getApiRoutes(): string[] {
    const routes: string[] = [];
    const v1Path = 'app/api/v1';

    const categories = readdirSync(v1Path);
    for (const category of categories) {
        const categoryPath = join(v1Path, category);
        const tools = readdirSync(categoryPath);
        for (const tool of tools) {
            if (existsSync(join(categoryPath, tool, 'route.ts'))) {
                routes.push(`/${category}/${tool}`);
            }
        }
    }
    return routes;
}

// Compare
const mcpEndpoints = Object.values(TOOLS).map(t => t.endpoint);
const apiRoutes = getApiRoutes();

const missingInMcp = apiRoutes.filter(r => !mcpEndpoints.includes(r));
const missingInApi = mcpEndpoints.filter(e => !apiRoutes.includes(e));

if (missingInMcp.length || missingInApi.length) {
    console.error('MCP/API out of sync!');
    process.exit(1);
}
```

## Integration

Run this check:
- Before releasing MCP server updates
- After adding new API routes
- In CI/CD pipeline
- Before production deployments
