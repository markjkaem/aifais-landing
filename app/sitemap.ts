import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aifais.com'
  
  // Statische pagina's
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quickscan`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/thank-you`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/agv`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // ✅ DYNAMISCHE PORTFOLIO PAGINA'S
  // Als je portfolio items in een database/CMS hebt, haal ze hier op
  // Voor nu gebruiken we je projects array
  
  // Import je projects data (pas path aan naar jouw structuur)
  // import { projects } from './portfolio/data'
  
  // Voorbeeld als je projects array hebt:
  // const portfolioRoutes = projects.map((project) => ({
  //   url: `${baseUrl}/portfolio/${project.slug}`,
  //   lastModified: new Date(project.date || new Date()),
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // }))

  // Hardcoded voorbeeld (vervang door dynamic als je projects hebt):
  const portfolioRoutes = [
    {
      url: `${baseUrl}/portfolio/email-reply-ai-agent`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/sales-lead-automation`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/support-ticket-summarizer`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/dynamic-marketing-content-generator`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/data-pipeline-and-reporting-automation`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/inventory-forecasting-agent`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio/recruitment-screening-automation`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
     {
      url: `${baseUrl}/portfolio/meeting-notes-action-items-agent`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
     {
      url: `${baseUrl}/portfolio/invoice-payment-reminder-automation`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
     {
      url: `${baseUrl}/portfolio/social-media-content-scheduler`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
     {
      url: `${baseUrl}/portfolio/customer-onboarding-automation`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
     {
      url: `${baseUrl}/portfolio/contract-renewal-management`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    // ✅ VOEG HIER AL JOUW PORTFOLIO ITEMS TOE
  ]

  return [...staticRoutes, ...portfolioRoutes]
}