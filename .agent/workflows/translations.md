---
description: How to add or update translations (i18n) in AIFAIS
---

## Locales
AIFAIS supports two locales:
- `nl` (Dutch - default)
- `en` (English)

## Translation Files
Translations are stored in JSON files in the `messages/` folder:
- `messages/nl.json`
- `messages/en.json`

## Using Translations in Components

```tsx
import { useTranslations } from "next-intl";

export default function Component() {
  const t = useTranslations("HomePage");
  return <h1>{t("title")}</h1>
}
```

## Adding New Translations

1. Add keys to BOTH `messages/nl.json` AND `messages/en.json`
2. Use dot notation for nested keys: `"tools.title": "Tools"`
3. Keep both files in sync to prevent missing translation errors

## Static Metadata (SEO)
For page metadata, translations are handled in `app/[locale]/layout.tsx` using `generateMetadata()`.

## Important Files
- `i18n.ts` - i18n configuration
- `middleware.ts` - Locale detection
- `app/routing.ts` - Locale routing config

## Checklist When Adding i18n
- [ ] Add keys to `messages/nl.json`
- [ ] Add keys to `messages/en.json`
- [ ] Test both `/nl/` and `/en/` routes
- [ ] Update metadata in layout.tsx if adding new pages
