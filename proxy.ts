import createMiddleware from 'next-intl/middleware';

export const proxy = createMiddleware({
  locales: ['nl', 'en'],
  defaultLocale: 'nl',
  localePrefix: 'as-needed',
  localeDetection: false // ✅ DISABLE auto-detection
});

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};