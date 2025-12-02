import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = {
  // Je bestaande config blijft staan...
  
  async rewrites() {
    return [
      {
        source: '/.well-known/actions.json',
        destination: '/api/actions/actions.json',
      },
    ];
  },
};

export default withNextIntl(nextConfig);