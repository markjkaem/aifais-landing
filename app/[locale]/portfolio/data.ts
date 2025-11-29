// ========================================
// FILE: app/portfolio/data.ts
// VOLLEDIG AANGEPAST NAAR NEDERLANDS
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
    title: "AI Email Beantwoording Systeem",
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
    title: "Sales Lead Automatisering",
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

  // ========================================
  // 🆕 NIEUWE CASE STUDIES (6 TOEGEVOEGD)
  // ========================================

  {
    slug: "recruitment-screening-automation",
    title: "Recruitment Screening Automatisering",
    image: "/recruitment-agent.png",
    description:
      "AI-gedreven kandidaat screening systeem dat CV's analyseert, functie-eisen matcht en interviews automatisch inplant.",
    details: [
      "Extraheert en scoort automatisch CV-data tegen functieomschrijvingen met AI.",
      "Integreert met LinkedIn, Indeed en recruitment platformen.",
      "Stuurt gepersonaliseerde afwijzings/uitnodigings emails op basis van fit score.",
      "Plant automatisch interviews via Calendly integratie met top kandidaten.",
      "Time-to-hire met 55% verminderd en screening workload met 90% verminderd.",
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
      "8 uur/week aan handmatige notities en follow-ups geëlimineerd.",
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
    title: "Factuur & Betalingsherinnering Automatisering",
    image: "/invoice-agent.png",
    description:
      "Geautomatiseerd facturatie en betalings follow-up systeem dat onbetaalde facturen met 60% vermindert en cashflow verbetert.",
    details: [
      "Genereert en verstuurt automatisch facturen op basis van projectafronding of mijlpalen.",
      "Stuurt gepersonaliseerde betalingsherinneringen op 7, 14 en 30-dagen intervallen.",
      "Escaleert achterstallige facturen naar management met volledige betalingshistorie.",
      "Integreert met Exact, Moneybird en QuickBooks.",
      "Days Sales Outstanding (DSO) teruggebracht van 45 naar 18 dagen.",
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
      "Social media output met 400% verhoogd met zelfde teamgrootte.",
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
      "Klant onboarding tijd teruggebracht van 14 dagen naar 4 dagen gemiddeld.",
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
      "Contract verlenging rate verhoogd van 68% naar 96%.",
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
  },
];