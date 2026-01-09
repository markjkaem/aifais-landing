# Check Translations - i18n Sync Validator

Verify that all translation keys exist in both `en.json` and `nl.json` files.

## Usage

```
/check-translations
/check-translations --fix
```

## Workflow

### Step 1: Load Translation Files

Read both translation files:
- `messages/en.json`
- `messages/nl.json`

### Step 2: Extract All Keys

Recursively extract all nested keys from both files.

For example:
```json
{
  "navigation": {
    "home": "Home",
    "tools": "Tools"
  }
}
```
Becomes: `navigation.home`, `navigation.tools`

### Step 3: Compare Keys

Find:
1. **Missing in NL**: Keys in `en.json` but not in `nl.json`
2. **Missing in EN**: Keys in `nl.json` but not in `en.json`
3. **Empty values**: Keys with empty string values

### Step 4: Generate Report

```
## 🌐 Translation Sync Report

**Status:** ✅ SYNCED / ⚠️ ISSUES FOUND

### Statistics
- Total EN keys: X
- Total NL keys: X
- Missing in NL: X
- Missing in EN: X
- Empty values: X

### Missing in NL (Dutch)
These keys need Dutch translations:
- `navigation.newFeature`
- `tools.kvkSearch.description`

### Missing in EN (English)
These keys exist only in Dutch:
- `hero.subtitle2`

### Empty Values
These keys have empty translations:
- NL: `footer.copyright`
- EN: (none)

### Fix Suggestions
[Specific suggestions for each missing key]
```

### Step 5: Auto-Fix Mode (--fix)

If `--fix` flag is provided:

1. **For missing keys:** Copy from the other language as placeholder
2. **Add TODO comment:** Mark with `[TODO: Translate]`
3. **Report changes:** Show what was added

```typescript
// Example fix for missing NL key
"newFeature": "[TODO: Translate] New Feature"
```

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Key mismatch | Forgot to add translation | Add to both files |
| Nested structure differs | Different JSON structure | Align structures |
| Empty string | Placeholder not filled | Translate the text |

## Integration

Run this check:
- Before every PR that touches UI
- Before production deployments
- After adding new components with text

## Script Helper

If you need to run this programmatically, create a script:

```typescript
// scripts/check-translations.ts
import en from '../messages/en.json';
import nl from '../messages/nl.json';

function getKeys(obj: any, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      return getKeys(value, path);
    }
    return [path];
  });
}

const enKeys = new Set(getKeys(en));
const nlKeys = new Set(getKeys(nl));

const missingInNL = [...enKeys].filter(k => !nlKeys.has(k));
const missingInEN = [...nlKeys].filter(k => !enKeys.has(k));

console.log('Missing in NL:', missingInNL);
console.log('Missing in EN:', missingInEN);
```
