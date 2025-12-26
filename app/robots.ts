import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://aifais.com'

  return {
    rules: [
      // 1. Regular Bots (Google, Bing, etc.)
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/thank-you'],
      },
      // 2. Specific AI Scrapers (Optional: Block them if you want)
      // If you WANT to be in ChatGPT, remove this block.
      // If you want to protect your IP, keep this.
      {
        userAgent: ['GPTBot', 'CCBot', 'ClaudeBot'],
        disallow: ['/admin/', '/api/', '/thank-you'],
        // Note: 'allow: /' is implied if not disallowed, 
        // but you can set 'disallow: /' here to block them entirely.
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}