// ========================================
// FILE: app/portfolio/data.ts
// UPDATED WITH 6 NEW STRATEGIC CASE STUDIES
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
    improvement?: string;
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

  // ========================================
  // 🆕 NEW CASE STUDIES (6 ADDED)
  // ========================================

  {
    slug: "recruitment-screening-automation",
    title: "Recruitment Screening Automation",
    image: "/recruitment-agent.png",
    description:
      "AI-powered candidate screening system that analyzes CVs, matches job requirements, and schedules interviews automatically.",
    details: [
      "Automatically extracts and scores CV data against job descriptions using AI.",
      "Integrates with LinkedIn, Indeed, and recruitment platforms.",
      "Sends personalized rejection/invitation emails based on fit score.",
      "Auto-schedules interviews via Calendly integration with top candidates.",
      "Reduced time-to-hire by 55% and screening workload by 90%.",
    ],
    
    category: "HR & Recruitment Automatisering",
    tags: ["n8n", "OpenAI", "LinkedIn", "Calendly", "CV Parsing", "ATS Integration", "Recruitment"],
    readTime: 6,
    date: "2024-10-28",
    
    results: {
      timeSaved: "30 uur/week",
      roiMonths: 1,
      improvement: "55% snellere hiring, 90% minder screening werk"
    },
    
    testimonial: {
      quote: "We kregen 200+ sollicitaties per vacature. Ons HR team verdronk erin. Nu analyseert AI alle CV's, matcht ze met de functie, en plant gesprekken met de top 5%. We stellen 55% sneller aan.",
      author: "Jasper Verhoeven",
      role: "HR Director",
      company: "Tech Scale-up (120 medewerkers)"
    }
  },

  {
    slug: "meeting-notes-action-items-agent",
    title: "Meeting Notes & Action Items Agent",
    image: "/meeting-agent.png",
    description:
      "Automatically transcribes meetings, generates summaries, extracts action items, and assigns tasks to team members.",
    details: [
      "Integrates with Google Meet, Zoom, and Microsoft Teams for auto-transcription.",
      "Uses AI to identify key decisions, action items, and deadlines.",
      "Automatically creates tasks in Asana, Monday.com, or Notion.",
      "Sends personalized follow-up emails to attendees with their action items.",
      "Eliminated 8 uur/week of manual note-taking and follow-ups.",
    ],
    
    category: "Productiviteits Automatisering",
    tags: ["n8n", "OpenAI", "Whisper", "Google Meet", "Zoom", "Asana", "Notion", "Task Management"],
    readTime: 5,
    date: "2024-09-15",
    
    results: {
      timeSaved: "8 uur/week",
      roiMonths: 2,
      improvement: "100% meeting follow-through, 0 vergeten acties"
    },
    
    testimonial: {
      quote: "Niemand hield zich aan meeting acties omdat we vergaten wie wat moest doen. Nu krijgt iedereen automatisch hun taken met deadlines. Onze uitvoering is van 40% naar 95% gegaan.",
      author: "Lisa Vermeer",
      role: "Operations Manager",
      company: "Consultancy Firm (42 medewerkers)"
    }
  },

  {
    slug: "invoice-payment-reminder-automation",
    title: "Invoice & Payment Reminder Automation",
    image: "/invoice-agent.png",
    description:
      "Automated invoicing and payment follow-up system that reduces outstanding invoices by 60% and improves cash flow.",
    details: [
      "Generates and sends invoices automatically based on project completion or milestones.",
      "Sends personalized payment reminders at 7, 14, and 30-day intervals.",
      "Escalates overdue invoices to management with full payment history.",
      "Integrates with Exact, Moneybird, and QuickBooks.",
      "Reduced Days Sales Outstanding (DSO) from 45 to 18 dagen.",
    ],
    
    category: "Financiële Automatisering",
    tags: ["n8n", "Exact", "Moneybird", "QuickBooks", "Payment Reminders", "Cash Flow", "Invoicing"],
    readTime: 5,
    date: "2024-08-22",
    
    results: {
      timeSaved: "6 uur/week",
      roiMonths: 1,
      costSaving: "€18.000/jaar",
      improvement: "60% minder onbetaalde facturen, DSO van 45→18 dagen"
    },
    
    testimonial: {
      quote: "We hadden structureel €80K aan uitstaande facturen. Handmatig herinneren lukte niet. Nu stuurt het systeem automatisch vriendelijke reminders en escalaties. Onze cashflow is dramatisch verbeterd.",
      author: "Robert Jansen",
      role: "Financial Controller",
      company: "Professional Services (55 medewerkers)"
    }
  },

  {
    slug: "social-media-content-scheduler",
    title: "Social Media Content Scheduler & Analytics",
    image: "/social-agent.png",
    description:
      "AI-powered social media automation that plans, creates, schedules, and analyzes posts across multiple platforms.",
    details: [
      "Generates platform-optimized content variations (LinkedIn, Instagram, Twitter) from one source.",
      "Uses AI to suggest best posting times based on audience engagement data.",
      "Auto-schedules posts to Buffer, Hootsuite, or native platform APIs.",
      "Tracks performance metrics and generates weekly insight reports.",
      "Increased social media output by 400% with same team size.",
    ],
    
    category: "Social Media Automatisering",
    tags: ["n8n", "OpenAI", "Buffer", "LinkedIn", "Instagram", "Twitter", "Analytics", "Content Creation"],
    readTime: 6,
    date: "2024-07-30",
    
    results: {
      timeSaved: "14 uur/week",
      roiMonths: 2,
      improvement: "400% meer content, 67% meer engagement"
    },
    
    testimonial: {
      quote: "We postten 2x per week omdat content maken zo veel tijd kostte. Nu genereert AI variaties voor elk platform, plant optimaal in, en analyseert wat werkt. We posten nu dagelijks met betere resultaten.",
      author: "Emma Bakker",
      role: "Marketing Lead",
      company: "SaaS Startup (18 medewerkers)"
    }
  },

  {
    slug: "customer-onboarding-automation",
    title: "Customer Onboarding Automation",
    image: "/onboarding-agent.png",
    description:
      "End-to-end customer onboarding workflow that reduces setup time by 70% and improves customer satisfaction scores.",
    details: [
      "Triggers personalized welcome sequences upon new customer signup.",
      "Automatically provisions accounts, sends credentials, and schedules kickoff calls.",
      "Delivers step-by-step onboarding content via email and in-app messages.",
      "Tracks onboarding progress and alerts CSM team when customers stall.",
      "Reduced customer onboarding time from 14 days to 4 days on average.",
    ],
    
    category: "Customer Success Automatisering",
    tags: ["n8n", "Intercom", "HubSpot", "Calendly", "Customer Success", "Onboarding", "Email Automation"],
    readTime: 6,
    date: "2024-11-12",
    
    results: {
      timeSaved: "16 uur/week",
      roiMonths: 2,
      improvement: "70% snellere onboarding (14→4 dagen), 35% hogere customer satisfaction"
    },
    
    testimonial: {
      quote: "Klanten raakten gefrustreerd tijdens onze langzame onboarding. Nu krijgen ze direct alles wat ze nodig hebben, automatisch. Time-to-value is gehalveerd en onze NPS is met 35 punten gestegen.",
      author: "Sophie Mulder",
      role: "Head of Customer Success",
      company: "B2B SaaS Platform (67 medewerkers)"
    }
  },

  {
    slug: "contract-renewal-management",
    title: "Contract Renewal Management System",
    image: "/contract-agent.png",
    description:
      "Proactive contract management automation that prevents revenue leakage and improves renewal rates by 28%.",
    details: [
      "Monitors all customer contracts and triggers renewal workflows 90/60/30 days before expiration.",
      "Sends personalized renewal offers based on usage data and customer health scores.",
      "Escalates at-risk renewals to account managers with full customer context.",
      "Auto-generates renewal contracts and DocuSign workflows.",
      "Increased contract renewal rate from 68% to 96%.",
    ],
    
    category: "Revenue Operations Automatisering",
    tags: ["n8n", "Salesforce", "HubSpot", "DocuSign", "Contract Management", "Revenue Retention", "Customer Success"],
    readTime: 7,
    date: "2024-06-25",
    
    results: {
      timeSaved: "10 uur/week",
      roiMonths: 1,
      costSaving: "€120.000/jaar (saved revenue)",
      improvement: "28% hogere renewal rate (68%→96%)"
    },
    
    testimonial: {
      quote: "We verloren €150K per jaar aan contracten die stilletjes verliepen. Niemand had overzicht. Nu worden renewals proactief gemanaged en krijgen we alerts bij risico's. Onze renewal rate is van 68% naar 96%.",
      author: "Martijn de Vries",
      role: "VP of Sales",
      company: "Enterprise Software Vendor (210 medewerkers)"
    }
  },
];