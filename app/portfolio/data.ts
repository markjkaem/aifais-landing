// ========================================
// FILE: app/portfolio/data.ts
// ========================================

export interface Project {
  slug: string;
  title: string;
  image: string;
  description: string;
  details: string[];
  
  // ✅ SEO & Conversion Fields
  category: string;
  tags: string[];
  readTime: number;
  date: string;
  
  results: {
    timeSaved?: string;
    roiMonths?: number;
    costSaving?: string;
    improvement?: string; // bijv. "80% sneller", "42% meer engagement"
  };
  
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company?: string;
  };
}

export const projects: Project[] = [
  {
    slug: "email-reply-ai-agent",
    title: "Email Reply AI Agent",
    image: "/emailagent.png",
    description:
      "Automated email response agent leveraging a vector database of customer interactions to provide context-aware, real-time replies at scale.",
    details: [
      "Integrated with a vector database (e.g., Pinecone or Weaviate) to understand prior conversations.",
      "Automatically drafts accurate and on-brand replies to customer emails.",
      "Continuously learns from past responses and CRM data.",
      "Reduced manual inbox handling time by 80%.",
    ],
    
    // ✅ NIEUW:
    category: "Customer Support Automation",
    tags: ["n8n", "OpenAI", "Pinecone", "Gmail", "Vector Database", "AI Agent"],
    readTime: 6,
    date: "2024-10-15",
    
    results: {
      timeSaved: "20 uur/week",
      roiMonths: 2,
      improvement: "80% minder handmatig inbox werk"
    },
    
    testimonial: {
      quote: "Onze support medewerkers kunnen nu 80% van de emails automatisch laten afhandelen. Ze focussen alleen nog op complexe vragen. Een game-changer.",
      author: "Linda Bakker",
      role: "Head of Customer Success",
      company: "SaaS Bedrijf (45 medewerkers)"
    }
  },
  
  {
    slug: "sales-lead-automation",
    title: "Sales Lead Automation",
    image: "/sales-agent.webp",
    description:
      "n8n workflow that gathers, qualifies, and enriches leads across multiple platforms, automatically updating CRM and notifying sales teams.",
    details: [
      "Connects LinkedIn, website forms, and email campaigns into one unified lead stream.",
      "Uses enrichment APIs (Clearbit / Apollo) for firmographic and intent data.",
      "Scores leads based on relevance and triggers Slack or email alerts.",
      "Fully syncs with HubSpot, Pipedrive, or Notion CRM databases.",
    ],
    
    // ✅ NIEUW:
    category: "Lead Automatisering",
    tags: ["n8n", "HubSpot", "LinkedIn", "Clearbit", "Apollo", "Slack", "CRM"],
    readTime: 7,
    date: "2024-09-22",
    
    results: {
      timeSaved: "15 uur/week",
      roiMonths: 3,
      costSaving: "€21.000/jaar",
      improvement: "45% meer gekwalificeerde leads"
    },
    
    testimonial: {
      quote: "We misten voorheen 30% van onze leads door handmatige verwerking. Nu komt elke lead direct in ons CRM met complete data. Onze conversie is met 45% gestegen.",
      author: "Mark Visser",
      role: "Sales Director",
      company: "B2B Software Bedrijf (62 medewerkers)"
    }
  },
  
  {
    slug: "support-ticket-summarizer",
    title: "Support Ticket Summarizer",
    image: "/support-agent.png",
    description:
      "AI-powered summarization workflow that condenses large support threads and provides actionable insights for support agents.",
    details: [
      "Automatically summarizes customer support tickets from Zendesk or Intercom.",
      "Highlights key issues, tone, and sentiment in a structured summary.",
      "Stores summaries in a vector database for long-term retrieval.",
      "Reduced average response time by 35%.",
    ],
    
    // ✅ NIEUW:
    category: "Customer Support Automation",
    tags: ["n8n", "Zendesk", "Intercom", "OpenAI", "Sentiment Analysis", "Vector DB"],
    readTime: 5,
    date: "2024-11-08",
    
    results: {
      timeSaved: "10 uur/week",
      roiMonths: 2,
      improvement: "35% snellere response tijd"
    },
    
    testimonial: {
      quote: "Onze support agents hoeven niet meer door lange email threads te spitten. Ze zien direct de kern van het probleem en kunnen gericht helpen.",
      author: "Sarah de Jong",
      role: "Customer Support Manager",
      company: "E-commerce Platform (38 medewerkers)"
    }
  },
  
  {
    slug: "dynamic-marketing-content-generator",
    title: "Dynamic Marketing Content Generator",
    image: "/marketing-agent.png",
    description:
      "Generates personalized marketing emails and social posts based on customer behavior and segmentation, fully automated through n8n workflows.",
    details: [
      "Pulls user data from CRM, analytics, and campaign tools.",
      "Uses AI prompts to craft custom marketing messages for each segment.",
      "Auto-posts approved content to LinkedIn, email, and Slack.",
      "Increased engagement rates by 42% on average.",
    ],
    
    // ✅ NIEUW:
    category: "Marketing Automatisering",
    tags: ["n8n", "OpenAI", "Mailchimp", "LinkedIn", "Google Analytics", "Segmentation"],
    readTime: 6,
    date: "2024-08-14",
    
    results: {
      timeSaved: "18 uur/week",
      roiMonths: 3,
      improvement: "42% meer engagement"
    },
    
    testimonial: {
      quote: "We produceren nu 5x meer gepersonaliseerde content met hetzelfde team. Onze open rates zijn met 42% gestegen omdat elk bericht relevant is voor de ontvanger.",
      author: "Tom Hendriks",
      role: "Marketing Manager",
      company: "Marketing Agency (25 medewerkers)"
    }
  },
  
  {
    slug: "data-pipeline-and-reporting-automation",
    title: "Data Pipeline & Reporting Automation",
    image: "/data-agent.png",
    description:
      "End-to-end automation for collecting, transforming, and visualizing business data, reducing manual reporting time by 70%.",
    details: [
      "Aggregates data from multiple APIs, databases, and spreadsheets.",
      "Cleans and normalizes data automatically using n8n transformations.",
      "Pushes results into dashboards (Google Data Studio, Power BI, or Notion).",
      "Reduced manual report generation from hours to minutes.",
    ],
    
    // ✅ NIEUW:
    category: "Data & Rapportage Automatisering",
    tags: ["n8n", "Google Sheets", "Power BI", "Google Data Studio", "API Integration", "ETL"],
    readTime: 8,
    date: "2024-07-19",
    
    results: {
      timeSaved: "25 uur/week",
      roiMonths: 2,
      costSaving: "€36.000/jaar",
      improvement: "70% snellere rapportage"
    },
    
    testimonial: {
      quote: "Onze maandelijkse rapportage kostte ons 2 volledige werkdagen. Nu is het geautomatiseerd en real-time beschikbaar. We nemen sneller betere beslissingen.",
      author: "Peter van Dijk",
      role: "CFO",
      company: "Scale-up (95 medewerkers)"
    }
  },
  
  {
    slug: "inventory-forecasting-agent",
    title: "Inventory Forecasting Agent",
    image: "/forecasting-agent.png",
    description:
      "Predictive AI agent that integrates sales data and seasonal trends to optimize inventory management automatically.",
    details: [
      "Combines real-time sales data with external market trends.",
      "Uses AI models to predict stock levels and reorder points.",
      "Automatically alerts procurement teams when thresholds are met.",
      "Decreased overstocking by 25% and stockouts by 40%.",
    ],
    
    // ✅ NIEUW:
    category: "Voorspellende Automatisering",
    tags: ["n8n", "Machine Learning", "Forecasting", "ERP Integration", "Slack", "AI Predictions"],
    readTime: 7,
    date: "2024-06-11",
    
    results: {
      timeSaved: "12 uur/week",
      roiMonths: 4,
      improvement: "25% minder voorraad, 40% minder stockouts"
    },
    
    testimonial: {
      quote: "We hadden chronisch problemen met te veel voorraad én tekorten. Deze AI-agent voorspelt onze behoeften nu zo accuraat dat we 25% minder kapitaal vastzetten én nooit meer uitverkocht zijn.",
      author: "Anne Meijer",
      role: "Operations Director",
      company: "E-commerce Retail (78 medewerkers)"
    }
  },
];


// ========================================
// OPTIONAL: TYPE EXPORT FOR TYPESCRIPT
// ========================================

