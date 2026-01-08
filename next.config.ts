import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Performance optimizations
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Compress responses
  compress: true,

  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,

  async rewrites() {
    return [
      {
        source: '/actions.json',
        destination: '/api/actions/actions.json',
      },
      {
        source: '/.well-known/actions.json',
        destination: '/api/actions/actions.json',
      },
    ];
  },
};

// Wrap with next-intl first, then Sentry
const configWithIntl = withNextIntl(nextConfig);

export default withSentryConfig(configWithIntl, {
  // Sentry options
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Suppress logs
  silent: true,

  // Upload source maps for better error tracking
  widenClientFileUpload: true,

  // Source maps config
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
