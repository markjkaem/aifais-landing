---
description: How to add a new page or section to the AIFAIS website
---

## Page Structure
Pages live in `app/[locale]/` following Next.js App Router conventions.

## Creating a New Page

1. **Create the directory and page file:**
   ```
   app/[locale]/[page-name]/page.tsx
   ```

2. **Basic page template:**
   ```tsx
   import { useTranslations } from "next-intl";
   import Header from "@/app/Components/Header";
   import Footer from "@/app/Components/Footer";

   export default function NewPage() {
     return (
       <>
         <Header />
         <main className="min-h-screen pt-24">
           {/* Content */}
         </main>
         <Footer />
       </>
     );
   }
   ```

3. **For client-side interactivity**, create a separate client component:
   ```
   app/[locale]/[page-name]/ClientComponent.tsx
   ```
   And import it in page.tsx with `"use client"` directive.

## Post-Creation Checklist

- [ ] Add translations to `messages/nl.json` and `messages/en.json`
- [ ] Update `app/sitemap.ts` with the new page URL
- [ ] Add to navigation in `app/Components/layout/headerData.ts` if needed
- [ ] Add metadata via `generateMetadata()` if the page needs SEO

## Important Files
- `app/sitemap.ts` - Sitemap generator
- `app/Components/Header.tsx` - Navigation header
- `app/Components/layout/headerData.ts` - Nav link definitions
- `app/[locale]/layout.tsx` - Root layout with metadata
