import { MetadataRoute } from 'next'
import { projects } from './[locale]/portfolio/data'
// 👇 Import your data here. Adjust the path to where your array lives.
// If you don't have a file yet, see the "Data" section below the code.

export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable for flexibility, fallback to production domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://aifais.com'

  // 1. Define your Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quickscan`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/thank-you`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.1, // Lower priority for thank you pages (SEO best practice)
    },
    {
      url: `${baseUrl}/agv`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // 2. Generate Dynamic Portfolio Routes automatically
  const portfolioRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    // Use the actual project date if available, otherwise current date
    lastModified: new Date(project.date || new Date()), 
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...portfolioRoutes]
}