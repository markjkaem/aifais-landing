import { getRequestConfig } from 'next-intl/server';

export const locales = ['nl', 'en'] as const;
export const defaultLocale = 'nl';

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // ✅ In Next.js 15, gebruik requestLocale in plaats van locale
  let locale = await requestLocale;

  // Ensure it's a valid locale
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale, // ✅ Nu gegarandeerd een string
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});