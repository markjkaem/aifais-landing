export interface Project {
  slug: string;
  title: string;
  image: string;
  description: string;
  details: string[];
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

export const projectsNl: Project[] = [
  {
    slug: "email-reply-ai-agent",
    title: "Hoe AIFAIS 20 uur/week bespaarde met AI Email Automatisering",
    image: "/emailagent.png",
    description:
      "Geautomatiseerd emailbeantwoording systeem dat gebruik maakt van een kennisbank van eerdere klantinteracties om context-bewuste, real-time antwoorden te genereren op schaal.",
    details: [
      "Geïntegreerd met een kennisbank (Pinecone of Weaviate) om eerdere gesprekken te begrijpen.",
      "Maakt automatisch accurate en merkconforme antwoorden op klant-emails.",
      "Leert continu van eerdere antwoorden en CRM-data.",
      "Handmatige inbox-tijd met 80% verminderd.",
    ],
    category: "Klantenservice Automatisering",
    tags: ["AI Agent", "OpenAI", "Pinecone", "Gmail", "Kennisbank", "Email Automatisering"],
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
    title: "Sales Lead Automatisering: 45% Meer Conversie voor B2B",
    image: "/sales-agent.webp",
    description:
      "Geautomatiseerd systeem dat leads verzamelt, kwalificeert en verrijkt over meerdere platformen, automatisch het CRM bijwerkt en sales teams notificeert.",
    details: [
      "Verbindt LinkedIn, website formulieren en email campagnes in één uniforme leadstroom.",
      "Gebruikt verrijkings-API's (Clearbit / Apollo) voor bedrijfsdata en intentiegegevens.",
      "Scoort leads op relevantie en triggert Slack of email alerts.",
      "Synchroniseert volledig met HubSpot, Pipedrive of Notion CRM databases.",
    ],
    category: "Lead Automatisering",
    tags: ["Lead Generation", "HubSpot", "LinkedIn", "Clearbit", "Apollo", "Slack", "CRM"],
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
    title: "Support Ticket Samenvatting Systeem",
    image: "/support-agent.png",
    description:
      "AI-gedreven samenvattingssysteem dat grote support threads condenseert en bruikbare inzichten geeft aan support medewerkers.",
    details: [
      "Vat automatisch klantenservice tickets samen van Zendesk of Intercom.",
      "Benadrukt kernproblemen, toon en sentiment in een gestructureerde samenvatting.",
      "Slaat samenvattingen op in een kennisbank voor lange-termijn opslag.",
      "Gemiddelde reactietijd met 35% verminderd.",
    ],
    category: "Klantenservice Automatisering",
    tags: ["Support Automatisering", "Zendesk", "Intercom", "OpenAI", "Sentiment Analyse", "Kennisbank"],
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
    title: "Dynamische Marketing Content Generator",
    image: "/marketing-agent.png",
    description:
      "Genereert gepersonaliseerde marketing emails en social posts op basis van klantgedrag en segmentatie, volledig geautomatiseerd.",
    details: [
      "Haalt gebruikersdata op uit CRM, analytics en campagne tools.",
      "Gebruikt AI prompts om custom marketing berichten te maken voor elk segment.",
      "Post automatisch goedgekeurde content naar LinkedIn, email en Slack.",
      "Engagement rates gemiddeld met 42% verhoogd.",
    ],
    category: "Marketing Automatisering",
    tags: ["Content Generatie", "OpenAI", "Mailchimp", "LinkedIn", "Google Analytics", "Segmentatie"],
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
    title: "Data Pipeline & Rapportage Automatisering",
    image: "/data-agent.png",
    description:
      "End-to-end automatisering voor het verzamelen, transformeren en visualiseren van bedrijfsdata, met 70% minder handmatige rapportage tijd.",
    details: [
      "Verzamelt data van meerdere API's, databases en spreadsheets.",
      "Schoont en normaliseert data automatisch met transformaties.",
      "Pusht resultaten naar dashboards (Google Data Studio, Power BI of Notion).",
      "Handmatige rapportage van uren naar minuten teruggebracht.",
    ],
    category: "Data & Rapportage Automatisering",
    tags: ["Data Pipeline", "Google Sheets", "Power BI", "Google Data Studio", "API Integratie", "ETL"],
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
    title: "Voorraad Voorspelling Systeem",
    image: "/forecasting-agent.png",
    description:
      "Voorspellend AI-systeem dat verkoopdata en seizoenstrends integreert om voorraadbeheer automatisch te optimaliseren.",
    details: [
      "Combineert real-time verkoopdata met externe markttrends.",
      "Gebruikt AI-modellen om voorraadniveaus en herbestelpunten te voorspellen.",
      "Waarschuwt inkoop teams automatisch wanneer drempels worden bereikt.",
      "Overvoorraad met 25% verminderd en stockouts met 40% verminderd.",
    ],
    category: "Voorspellende Automatisering",
    tags: ["Machine Learning", "Voorspelling", "ERP Integratie", "Slack", "AI Voorspellingen", "Voorraadbeheer"],
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
  {
    slug: "recruitment-screening-automation",
    title: "Hoe AIFAIS Recruitment met 55% versnelde via AI Screening",
    image: "/recruitment-agent.png",
    description:
      "AI-gedreven kandidaat screening systeem dat CV's analyseert, functie-eisen matcht en interviews automatisch inplant.",
    details: [
      "Extraheert en scoort automatisch CV-data tegen functieomschrijvingen met AI.",
      "Integreert met LinkedIn, Indeed en recruitment platformen.",
      "Stuurt gepersonaliseerde afwijzings/uitnodigings emails op basis van fit score.",
      "Plant automatisch interviews via Calendly integratie met top kandidaten.",
    ],
    category: "HR & Recruitment Automatisering",
    tags: ["Recruitment", "OpenAI", "LinkedIn", "Calendly", "CV Analyse", "ATS Integratie", "HR Automatisering"],
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
    title: "Meeting Notities & Actie Items Agent",
    image: "/meeting-agent.png",
    description:
      "Transcribeert automatisch meetings, genereert samenvattingen, extraheert actie items en wijst taken toe aan teamleden.",
    details: [
      "Integreert met Google Meet, Zoom en Microsoft Teams voor auto-transcriptie.",
      "Gebruikt AI om belangrijke beslissingen, actie items en deadlines te identificeren.",
      "Maakt automatisch taken aan in Asana, Monday.com of Notion.",
      "Stuurt gepersonaliseerde follow-up emails naar deelnemers met hun actie items.",
    ],
    category: "Productiviteits Automatisering",
    tags: ["Meeting Automatisering", "OpenAI", "Whisper", "Google Meet", "Zoom", "Asana", "Notion", "Taakbeheer"],
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
    title: "60% Minder Onbetaalde Facturen via AI Automatisering",
    image: "/invoice-agent.png",
    description:
      "Geautomatiseerd facturatie en betalings follow-up systeem dat onbetaalde facturen met 60% vermindert en cashflow verbetert.",
    details: [
      "Genereert en verstuurt automatisch facturen op basis van projectafronding of mijlpalen.",
      "Stuurt gepersonaliseerde betalingsherinneringen op 7, 14 en 30-dagen intervallen.",
      "Escaleert achterstallige facturen naar management met volledige betalingshistorie.",
      "Integreert met Exact, Moneybird en QuickBooks.",
    ],
    category: "Financiële Automatisering",
    tags: ["Facturatie", "Exact", "Moneybird", "QuickBooks", "Betalingsherinneringen", "Cashflow", "Financiën"],
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
    title: "Social Media Content Planner & Analytics",
    image: "/social-agent.png",
    description:
      "AI-gedreven social media automatisering die posts plant, creëert, inroostert en analyseert over meerdere platformen.",
    details: [
      "Genereert platform-geoptimaliseerde content variaties (LinkedIn, Instagram, Twitter) van één bron.",
      "Gebruikt AI om beste posttijden voor te stellen op basis van audience engagement data.",
      "Plant automatisch posts naar Buffer, Hootsuite of native platform API's.",
      "Volgt performance metrics en genereert wekelijkse inzicht rapporten.",
    ],
    category: "Social Media Automatisering",
    tags: ["Social Media", "OpenAI", "Buffer", "LinkedIn", "Instagram", "Twitter", "Analytics", "Content Creatie"],
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
    title: "Klant Onboarding Automatisering",
    image: "/onboarding-agent.png",
    description:
      "End-to-end klant onboarding proces dat setup tijd met 70% vermindert en klanttevredenheid scores verbetert.",
    details: [
      "Triggert gepersonaliseerde welkomstreeksen bij nieuwe klant aanmelding.",
      "Maakt automatisch accounts aan, verstuurt credentials en plant kickoff calls.",
      "Levert stapsgewijze onboarding content via email en in-app berichten.",
      "Volgt onboarding voortgang en waarschuwt CSM team wanneer klanten vastlopen.",
    ],
    category: "Customer Success Automatisering",
    tags: ["Onboarding", "Intercom", "HubSpot", "Calendly", "Customer Success", "Email Automatisering", "Klantbeleving"],
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
    title: "Contract Verlenging Management Systeem",
    image: "/contract-agent.png",
    description:
      "Proactief contract management automatisering die revenue lekkage voorkomt en verlenging rates met 28% verbetert.",
    details: [
      "Monitort alle klantcontracten en triggert verlenging processen 90/60/30 dagen voor afloop.",
      "Stuurt gepersonaliseerde verlengingsaanbiedingen op basis van gebruiksdata en customer health scores.",
      "Escaleert risico-verlenging naar account managers met volledige klant context.",
      "Genereert automatisch verlenging contracten en DocuSign processen.",
    ],
    category: "Revenue Operations Automatisering",
    tags: ["Contract Beheer", "Salesforce", "HubSpot", "DocuSign", "Revenue Retention", "Customer Success", "Account Management"],
    readTime: 7,
    date: "2024-06-25",
    results: {
      timeSaved: "10 uur/week",
      roiMonths: 1,
      costSaving: "€120.000/jaar (behouden omzet)",
      improvement: "28% hogere renewal rate (68%→96%)"
    },
    testimonial: {
      quote: "We verloren €150K per jaar aan contracten die stilletjes verliepen. Niemand had overzicht. Nu worden renewals proactief gemanaged en krijgen we alerts bij risico's. Onze renewal rate is van 68% naar 96%.",
      author: "Martijn de Vries",
      role: "VP of Sales",
      company: "Enterprise Software Vendor (210 medewerkers)"
    }
  }
];

export const projects = projectsNl;

export const projectsEn: Project[] = [
  {
    slug: "email-reply-ai-agent",
    title: "How AIFAIS Saved 20 Hours/Week with AI Email Automation",
    image: "/emailagent.png",
    description:
      "Automated email answering system that uses a knowledge base of previous customer interactions to generate context-aware, real-time responses at scale.",
    details: [
      "Integrated with a knowledge base (Pinecone or Weaviate) to understand previous conversations.",
      "Automatically creates accurate and brand-compliant responses to customer emails.",
      "Continuously learns from previous responses and CRM data.",
      "Manual inbox time reduced by 80%.",
    ],
    category: "Customer Service Automation",
    tags: ["AI Agent", "OpenAI", "Pinecone", "Gmail", "Knowledge Base", "Email Automation"],
    readTime: 6,
    date: "2024-10-15",
    results: {
      timeSaved: "20 hours/week",
      roiMonths: 2,
      improvement: "80% less manual inbox work"
    },
    testimonial: {
      quote: "Our support employees can now have 80% of emails handled automatically. They only focus on complex questions. A game-changer.",
      author: "Linda Bakker",
      role: "Head of Customer Success",
      company: "SaaS Company (45 employees)"
    }
  },
  {
    slug: "sales-lead-automation",
    title: "Sales Lead Automation: 45% More Conversion for B2B",
    image: "/sales-agent.webp",
    description:
      "Automated system that collects, qualifies, and enriches leads across multiple platforms, automatically updates the CRM, and notifies sales teams.",
    details: [
      "Connects LinkedIn, website forms, and email campaigns into one uniform lead flow.",
      "Uses enrichment APIs (Clearbit / Apollo) for company and intent data.",
      "Scores leads on relevance and triggers Slack or email alerts.",
      "Fully synchronizes with HubSpot, Pipedrive, or Notion CRM databases.",
    ],
    category: "Lead Automation",
    tags: ["Lead Generation", "HubSpot", "LinkedIn", "Clearbit", "Apollo", "Slack", "CRM"],
    readTime: 7,
    date: "2024-09-22",
    results: {
      timeSaved: "15 hours/week",
      roiMonths: 3,
      costSaving: "€21,000/year",
      improvement: "45% more qualified leads"
    },
    testimonial: {
      quote: "We used to miss 30% of our leads due to manual processing. Now every lead enters our CRM directly with complete data. Our conversion has increased by 45%.",
      author: "Mark Visser",
      role: "Sales Director",
      company: "B2B Software Company (62 employees)"
    }
  },
  {
    slug: "support-ticket-summarizer",
    title: "Support Ticket Summarization System",
    image: "/support-agent.png",
    description:
      "AI-driven summarization system that condenses large support threads and provides actionable insights to support staff.",
    details: [
      "Automatically summarizes customer service tickets from Zendesk or Intercom.",
      "Highlights core issues, tone, and sentiment in a structured summary.",
      "Stores summaries in a knowledge base for long-term storage.",
      "Average response time reduced by 35%.",
    ],
    category: "Customer Service Automation",
    tags: ["Support Automation", "Zendesk", "Intercom", "OpenAI", "Sentiment Analysis", "Knowledge Base"],
    readTime: 5,
    date: "2024-11-08",
    results: {
      timeSaved: "10 hours/week",
      roiMonths: 2,
      improvement: "35% faster response time"
    },
    testimonial: {
      quote: "Our support agents no longer need to sift through long email threads. They immediately see the core of the problem and can help specifically.",
      author: "Sarah de Jong",
      role: "Customer Support Manager",
      company: "E-commerce Platform (38 employees)"
    }
  },
  {
    slug: "dynamic-marketing-content-generator",
    title: "Dynamic Marketing Content Generator",
    image: "/marketing-agent.png",
    description:
      "Generates personalized marketing emails and social posts based on customer behavior and segmentation, fully automated.",
    details: [
      "Retrieves user data from CRM, analytics, and campaign tools.",
      "Uses AI prompts to create custom marketing messages for each segment.",
      "Automatically posts approved content to LinkedIn, email, and Slack.",
      "Engagement rates increased by 42% on average.",
    ],
    category: "Marketing Automation",
    tags: ["Content Generation", "OpenAI", "Mailchimp", "LinkedIn", "Google Analytics", "Segmentation"],
    readTime: 6,
    date: "2024-08-14",
    results: {
      timeSaved: "18 hours/week",
      roiMonths: 3,
      improvement: "42% more engagement"
    },
    testimonial: {
      quote: "We now produce 5x more personalized content with the same team. Our open rates have increased by 42% because every message is relevant to the recipient.",
      author: "Tom Hendriks",
      role: "Marketing Manager",
      company: "Marketing Agency (25 employees)"
    }
  },
  {
    slug: "data-pipeline-and-reporting-automation",
    title: "Data Pipeline & Reporting Automation",
    image: "/data-agent.png",
    description:
      "End-to-end automation for collecting, transforming, and visualizing business data, with 70% less manual reporting time.",
    details: [
      "Collects data from multiple APIs, databases, and spreadsheets.",
      "Cleans and normalizes data automatically with transformations.",
      "Pushes results to dashboards (Google Data Studio, Power BI, or Notion).",
      "Manual reporting time reduced from hours to minutes.",
    ],
    category: "Data & Reporting Automation",
    tags: ["Data Pipeline", "Google Sheets", "Power BI", "Google Data Studio", "API Integration", "ETL"],
    readTime: 8,
    date: "2024-07-19",
    results: {
      timeSaved: "25 hours/week",
      roiMonths: 2,
      costSaving: "€36,000/year",
      improvement: "70% faster reporting"
    },
    testimonial: {
      quote: "Our monthly reporting used to take us 2 full working days. Now it is automated and available in real-time. We make better decisions faster.",
      author: "Peter van Dijk",
      role: "CFO",
      company: "Scale-up (95 employees)"
    }
  },
  {
    slug: "inventory-forecasting-agent",
    title: "Inventory Forecasting System",
    image: "/forecasting-agent.png",
    description:
      "Predictive AI system that integrates sales data and seasonal trends to automatically optimize inventory management.",
    details: [
      "Combines real-time sales data with external market trends.",
      "Uses AI models to predict stock levels and reorder points.",
      "Automatically alerts purchasing teams when thresholds are reached.",
      "Overstock reduced by 25% and stockouts reduced by 40%.",
    ],
    category: "Predictive Automation",
    tags: ["Machine Learning", "Forecasting", "ERP Integration", "Slack", "AI Predictions", "Inventory Management"],
    readTime: 7,
    date: "2024-06-11",
    results: {
      timeSaved: "12 hours/week",
      roiMonths: 4,
      improvement: "25% less stock, 40% fewer stockouts"
    },
    testimonial: {
      quote: "We had chronic problems with too much stock and shortages. This AI agent now predicts our needs so accurately that we tie up 25% less capital and are never sold out again.",
      author: "Anne Meijer",
      role: "Operations Director",
      company: "E-commerce Retail (78 employees)"
    }
  },
  {
    slug: "recruitment-screening-automation",
    title: "How AIFAIS Accelerated Hiring by 55% via AI Screening",
    image: "/recruitment-agent.png",
    description:
      "AI-driven candidate screening system that analyzes resumes, matches job requirements, and schedules interviews automatically.",
    details: [
      "Automatically extracts and scores resume data against job descriptions with AI.",
      "Integrates with LinkedIn, Indeed, and recruitment platforms.",
      "Sends personalized rejection/invitation emails based on fit score.",
      "Automatically schedules interviews via Calendly integration with top candidates.",
    ],
    category: "HR & Recruitment Automation",
    tags: ["Recruitment", "OpenAI", "LinkedIn", "Calendly", "Resume Analysis", "ATS Integration", "HR Automation"],
    readTime: 6,
    date: "2024-10-28",
    results: {
      timeSaved: "30 hours/week",
      roiMonths: 1,
      improvement: "55% faster hiring, 90% less screening work"
    },
    testimonial: {
      quote: "We used to get 200+ applications per vacancy. Our HR team was drowning. Now AI analyzes all resumes, matches them with the role, and schedules calls with the top 5%. We hire 55% faster.",
      author: "Jasper Verhoeven",
      role: "HR Director",
      company: "Tech Scale-up (120 employees)"
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
      "Sends personalized follow-up emails to participants with their action items.",
    ],
    category: "Productivity Automation",
    tags: ["Meeting Automation", "OpenAI", "Whisper", "Google Meet", "Zoom", "Asana", "Notion", "Task Management"],
    readTime: 5,
    date: "2024-09-15",
    results: {
      timeSaved: "8 hours/week",
      roiMonths: 2,
      improvement: "100% meeting follow-through, 0 forgotten actions"
    },
    testimonial: {
      quote: "No one stuck to meeting actions because we forgot who was supposed to do what. Now everyone automatically gets their tasks with deadlines. Our execution has gone from 40% to 95%.",
      author: "Lisa Vermeer",
      role: "Operations Manager",
      company: "Consultancy Firm (42 employees)"
    }
  },
  {
    slug: "invoice-payment-reminder-automation",
    title: "60% Fewer Unpaid Invoices via AI Automation",
    image: "/invoice-agent.png",
    description:
      "Automated invoicing and payment follow-up system that reduces unpaid invoices by 60% and improves cash flow.",
    details: [
      "Automatically generates and sends invoices based on project completion or milestones.",
      "Sends personalized payment reminders at 7, 14, and 30-day intervals.",
      "Escalates overdue invoices to management with full payment history.",
      "Integrates with Exact, Moneybird, and QuickBooks.",
    ],
    category: "Financial Automation",
    tags: ["Invoicing", "Exact", "Moneybird", "QuickBooks", "Payment Reminders", "Cashflow", "Finance"],
    readTime: 5,
    date: "2024-08-22",
    results: {
      timeSaved: "6 hours/week",
      roiMonths: 1,
      costSaving: "€18,000/year",
      improvement: "60% fewer unpaid invoices, DSO from 45→18 days"
    },
    testimonial: {
      quote: "We consistently had €80K in outstanding invoices. Manual reminders didn't work. Now the system automatically sends friendly reminders and escalations. Our cash flow has improved dramatically.",
      author: "Robert Jansen",
      role: "Financial Controller",
      company: "Professional Services (55 employees)"
    }
  },
  {
    slug: "social-media-content-scheduler",
    title: "Social Media Content Planner & Analytics",
    image: "/social-agent.png",
    description:
      "AI-driven social media automation that plans, creates, schedules, and analyzes posts across multiple platforms.",
    details: [
      "Generates platform-optimized content variations (LinkedIn, Instagram, Twitter) from one source.",
      "Uses AI to suggest best posting times based on audience engagement data.",
      "Automatically schedules posts to Buffer, Hootsuite, or native platform APIs.",
      "Tracks performance metrics and generates weekly insight reports.",
    ],
    category: "Social Media Automation",
    tags: ["Social Media", "OpenAI", "Buffer", "LinkedIn", "Instagram", "Twitter", "Analytics", "Content Creation"],
    readTime: 6,
    date: "2024-07-30",
    results: {
      timeSaved: "14 hours/week",
      roiMonths: 2,
      improvement: "400% more content, 67% more engagement"
    },
    testimonial: {
      quote: "We used to post 2x per week because creating content took so much time. Now AI generates variations for each platform, schedules optimally, and analyzes what works. We now post daily with better results.",
      author: "Emma Bakker",
      role: "Marketing Lead",
      company: "SaaS Startup (18 employees)"
    }
  },
  {
    slug: "customer-onboarding-automation",
    title: "Customer Onboarding Automation",
    image: "/onboarding-agent.png",
    description:
      "End-to-end customer onboarding process that reduces setup time by 70% and improves customer satisfaction scores.",
    details: [
      "Triggers personalized welcome sequences upon new customer sign-up.",
      "Automatically creates accounts, sends credentials, and schedules kickoff calls.",
      "Delivers step-by-step onboarding content via email and in-app messages.",
      "Tracks onboarding progress and alerts CSM team when customers get stuck.",
    ],
    category: "Customer Success Automation",
    tags: ["Onboarding", "Intercom", "HubSpot", "Calendly", "Customer Success", "Email Automation", "Customer Experience"],
    readTime: 6,
    date: "2024-11-12",
    results: {
      timeSaved: "16 hours/week",
      roiMonths: 2,
      improvement: "70% faster onboarding (14→4 days), 35% higher customer satisfaction"
    },
    testimonial: {
      quote: "Customers used to get frustrated during our slow onboarding. Now they immediately get everything they need, automatically. Time-to-value has halved and our NPS has risen by 35 points.",
      author: "Sophie Mulder",
      role: "Head of Customer Success",
      company: "B2B SaaS Platform (67 employees)"
    }
  },
  {
    slug: "contract-renewal-management",
    title: "Contract Renewal Management System",
    image: "/contract-agent.png",
    description:
      "Proactive contract management automation that prevents revenue leakage and improves renewal rates by 28%.",
    details: [
      "Monitors all customer contracts and triggers renewal processes 90/60/30 days before expiration.",
      "Sends personalized renewal offers based on usage data and customer health scores.",
      "Escalates risk renewals to account managers with full customer context.",
      "Automatically generates renewal contracts and DocuSign processes.",
    ],
    category: "Revenue Operations Automation",
    tags: ["Contract Management", "Salesforce", "HubSpot", "DocuSign", "Revenue Retention", "Customer Success", "Account Management"],
    readTime: 7,
    date: "2024-06-25",
    results: {
      timeSaved: "10 hours/week",
      roiMonths: 1,
      costSaving: "€120,000/year (retained revenue)",
      improvement: "28% higher renewal rate (68%→96%)"
    },
    testimonial: {
      quote: "We were losing €150K per year on contracts that silently expired. No one had an overview. Now renewals are proactively managed and we get alerts for risks. Our renewal rate has gone from 68% to 96%.",
      author: "Martijn de Vries",
      role: "VP of Sales",
      company: "Enterprise Software Vendor (210 employees)"
    }
  }
];

export function getProjects(locale: string): Project[] {
  return locale === "en" ? projectsEn : projectsNl;
}