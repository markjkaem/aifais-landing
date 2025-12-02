import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = {
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

export default withNextIntl(nextConfig);