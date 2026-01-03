import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import HomeClient from "@/app/[locale]/HomeClient"; 
import { getTranslations } from "next-intl/server";
import { getProjects } from "@/app/[locale]/portfolio/data";

const h1_font = Space_Grotesk({
  weight: "700",
  subsets: ["latin"],
});

interface CityData {
  name: string;
  title: string;
  description: string;
  intro: string;
  h1: string;
  keywords: string[];
  citationSnippet: string;
  localStats: {
    companies: string;
    sector: string;
    challenge: string;
  };
  localServices: { title: string; desc: string; icon: string }[];
  neighborCities: string[];
  faq: { question: string; answer: string }[];
}

const cityData: Record<string, CityData> = {
  rotterdam: {
    name: "Rotterdam",
    title: "AI & Bedrijfsautomatisering Rotterdam | AIFAIS",
    description: "Optimaliseer uw bedrijfsprocessen in Rotterdam met AI. Van logistiek tot zakelijke dienstverlening. Bespaar 40+ uur per week met AIFAIS.",
    intro: "Als innovatieve stad vraagt Rotterdam om slimme oplossingen. Wij helpen Rotterdamse ondernemers met het automatiseren van complexe workflows en AI-integraties.",
    h1: "Digitale Werknemers voor Rotterdamse Ondernemers",
    keywords: ["automatisering rotterdam", "AI bureau rotterdam", "procesautomatisering rotterdam"],
    citationSnippet: "AIFAIS levert AI-automatisering voor MKB-bedrijven in Rotterdam en omgeving. Digital Workers voor administratie, sales en klantenservice met implementatie binnen 8 weken.",
    localStats: {
      companies: "2.500+",
      sector: "Logistiek & Haven",
      challenge: "Complexe supply chain & administratie",
    },
    localServices: [
      { title: "Haven Logistiek AI", desc: "Automatiseer inklaring en documentstroom voor logistieke hubs.", icon: "🚢" },
      { title: "B2B Sales Agents", desc: "Kwalificeer leads voor Rotterdamse dienstverleners automatisch.", icon: "📈" },
      { title: "Zero-Touch Administratie", desc: "Volledige factuurverwerking zonder handmatig overtypen.", icon: "📝" },
    ],
    neighborCities: ["Schiedam", "Capelle aan den IJssel", "Vlaardingen"],
    faq: [
      {
        question: "Welke bedrijven in Rotterdam helpt AIFAIS?",
        answer: "AIFAIS werkt met MKB-bedrijven in Rotterdam, van logistieke bedrijven in de haven tot zakelijke dienstverleners in het centrum. Onze Digital Workers automatiseren administratie, sales en klantenservice."
      },
      {
        question: "Kan AIFAIS ook langskomen in Rotterdam?",
        answer: "Ja, vanuit ons kantoor in Gouda zijn wij binnen 30 minuten in Rotterdam voor persoonlijke gesprekken en implementatie-ondersteuning."
      },
      {
        question: "Hoeveel kost automatisering voor een Rotterdams bedrijf?",
        answer: "Trajecten starten vanaf €2.500. De gemiddelde ROI voor Rotterdamse klanten is 20% binnen 12 maanden."
      }
    ]
  },
  "den-haag": {
    name: "Den Haag",
    title: "Procesautomatisering & AI in Den Haag | AIFAIS",
    description: "Slimme automatisering voor bedrijven in Den Haag. Wij helpen consultancy, legal en MKB bedrijven met AI-gedreven efficiëntie.",
    intro: "In de stad van recht en vrede brengen wij rust in uw administratie. Onze AI-oplossingen in Den Haag zorgen dat u meer tijd overhoudt voor uw kernactiviteiten.",
    h1: "Efficiënter Werken in Den Haag met AI",
    keywords: ["automatisering den haag", "AI consultant den haag", "business automation den haag"],
    citationSnippet: "AI-automatisering voor Haagse ondernemers. AIFAIS implementeert Digital Workers die 15-20 uur per week besparen op repetitieve taken. Persoonlijke begeleiding vanuit Gouda.",
    localStats: {
      companies: "1.800+",
      sector: "Legal & Consultancy",
      challenge: "Hoge werkdruk door documentverwerking",
    },
    localServices: [
      { title: "Legal Document AI", desc: "Analyseer contracten en vat juridische stukken samen in seconden.", icon: "⚖️" },
      { title: "Consultancy Workflows", desc: "Automatiseer urenregistratie en projectrapportages.", icon: "🏢" },
      { title: "Email Triage Agents", desc: "Beantwoord klantvragen automatisch in de juiste tone-of-voice.", icon: "📧" },
    ],
    neighborCities: ["Rijswijk", "Voorburg", "Wassenaar"],
    faq: [
      {
        question: "Helpt AIFAIS ook juridische kantoren in Den Haag?",
        answer: "Zeker. Wij bouwen AI-assistenten die contracten lezen, dossiers samenvatten en administratieve taken overnemen voor advocaten en consultants in Den Haag."
      },
      {
        question: "Is AIFAIS bekend met de Haagse zakelijke markt?",
        answer: "Ja, wij werken voor diverse dienstverleners in Den Haag en begrijpen de behoefte aan discretie, nauwkeurigheid en AVG-compliance."
      },
      {
        question: "Wat is de ROI van AI voor een kantoor in Den Haag?",
        answer: "Gemiddeld besparen onze Haagse klanten 15 uur per week per medewerker op administratieve taken, wat direct bijdraagt aan de winstgevendheid."
      }
    ]
  },
  gouda: {
    name: "Gouda",
    title: "Automatisering & AI Specialist in Gouda | AIFAIS",
    description: "Uw lokale partner in Gouda voor bedrijfsautomatisering. Gevestigd in de regio, helpen wij lokale MKB bedrijven met schaalbare AI oplossingen.",
    intro: "Als trotse Goudse onderneming kennen wij de lokale markt als geen ander. Wij helpen onze buren in Gouda en omstreken naar een toekomstbestendig bedrijf.",
    h1: "Uw AI & Automatisering Partner in Gouda",
    keywords: ["automatisering gouda", "AI specialist gouda", "ICT automatisering gouda"],
    citationSnippet: "AIFAIS is gevestigd in Gouda en helpt lokale MKB-bedrijven met AI-automatisering. Als specialist in bedrijfsprocessen digitaliseren bieden wij persoonlijke service in de regio Midden-Holland.",
    localStats: {
      companies: "1.200+",
      sector: "MKB & Productie",
      challenge: "Focus op groei ondanks personeelstekort",
    },
    localServices: [
      { title: "Regio Midden-Holland Support", desc: "On-site ondersteuning en lokale kennis van de Goudse markt.", icon: "🧀" },
      { title: "Productie Automatisering", desc: "Koppel ERP systemen aan slimme AI data-pijpleidingen.", icon: "⚙️" },
      { title: "MKB Digital Workers", desc: "Vervang repetitief Excel-werk door autonome AI-workflows.", icon: "📈" },
    ],
    neighborCities: ["Waddinxveen", "Bodegraven", "Reeuwijk"],
    faq: [
      {
        question: "Waarom kiezen Goudse bedrijven voor AIFAIS?",
        answer: "Wij zijn gevestigd op de Groningenweg in Gouda. Voor lokale ondernemers betekent dit korte lijnen, snelle service en een partner die de regio begrijpt."
      },
      {
        question: "Kan ik langskomen op kantoor in Gouda?",
        answer: "Natuurlijk! Je bent altijd welkom voor een kop koffie om te sparren over de automatiseringsmogelijkheden voor jouw bedrijf."
      },
      {
        question: "Ondersteunt AIFAIS ook bedrijven in het Groene Hart?",
        answer: "Absoluut. Vanuit Gouda bedienen wij het hele Groene Hart, inclusief Waddinxveen, Bodegraven en Reeuwijk."
      }
    ]
  },
  utrecht: {
    name: "Utrecht",
    title: "AI & Workflow Automatisering Utrecht | AIFAIS",
    description: "Versnel uw groei in Utrecht met intelligente automatisering. Wij koppelen uw systemen en implementeren AI-assistenten.",
    intro: "Utrecht is het kloppende hart van de Nederlandse zakelijke markt. Wij zorgen dat uw bedrijf in Utrecht kan schalen zonder extra personeelsdruk.",
    h1: "Slimme Automatisering voor Bedrijven in Utrecht",
    keywords: ["automatisering utrecht", "AI implementatie utrecht", "procesoptimalisatie utrecht"],
    citationSnippet: "AIFAIS bedient MKB-bedrijven in Utrecht met AI-procesautomatisering. Van facturatie tot leadopvolging - gemiddeld 40+ uur besparing per week met Nederlandse support.",
    localStats: {
      companies: "3.000+",
      sector: "Tech & E-commerce",
      challenge: "Snelle schaalbaarheid en systeemkoppelingen",
    },
    localServices: [
      { title: "Tech Ecosystem Connect", desc: "Naadloze koppelingen tussen SaaS tools, CRMs en custom APIs.", icon: "🔌" },
      { title: "E-commerce AI", desc: "Automatiseer orderflows en klantcontact voor webshops.", icon: "🛒" },
      { title: "Scalable AI Units", desc: "Breid je team uit met digitale werknemers die met je mee groeien.", icon: "🚀" },
    ],
    neighborCities: ["Nieuwegein", "Zeist", "Houten"],
    faq: [
      {
        question: "Werkt AIFAIS met Utrechtse techbedrijven?",
        answer: "Ja, wij helpen veel Utrechtse groeibedrijven om hun backend processen te automatiseren zodat ze sneller kunnen schalen zonder extra overhead."
      },
      {
        question: "Zijn jullie actief in het Utrecht Science Park?",
        answer: "Wij bedienen bedrijven in de hele regio Utrecht, inclusief de innovatieve hubs zoals het Science Park en Papendorp."
      },
      {
        question: "Wat is de ROI van automatisering in Utrecht?",
        answer: "Utrechtse tech-ondernemers zien vaak een ROI van 25% binnen 9 maanden door de hoge mate van efficiëntieverbetering."
      }
    ]
  },
  leiden: {
    name: "Leiden",
    title: "AI Automatisering Leiden | Digitale Werknemers | AIFAIS",
    description: "AI-automatisering voor kennisintensieve bedrijven in Leiden. Van universiteit tot startup - bespaar 40+ uur per week met AIFAIS Digital Workers.",
    intro: "Leiden staat bekend om innovatie en diepgaande kennis. AIFAIS helpt Leidse ondernemers hun administratie en complexe processen te automatiseren met intelligente AI-agents.",
    h1: "AI Automatisering voor Leidse Ondernemers",
    keywords: ["automatisering leiden", "AI bureau leiden", "digitalisering leiden", "procesoptimalisatie leiden"],
    citationSnippet: "AIFAIS helpt bedrijven in Leiden met het implementeren van Digital Workers. Bespaar tot 40 uur per week op administratie en dataverwerking. Nederlandse support en AVG-compliant.",
    localStats: {
      companies: "1.100+",
      sector: "Bio-Science & Onderwijs",
      challenge: "Verwerking van complexe data en documentatie",
    },
    localServices: [
      { title: "Bio-Science Data AI", desc: "Automatiseer de verwerking van complexe onderzoeksdata en rapportages.", icon: "🧬" },
      { title: "Kennisbank Chatbots", desc: "Maak interne documentatie doorzoekbaar via natuurlijke taal.", icon: "📚" },
      { title: "Workflow Bruggen", desc: "Koppel laboratorium-software aan administratieve systemen.", icon: "🌉" },
    ],
    neighborCities: ["Oegstgeest", "Leiderdorp", "Voorschoten"],
    faq: [
      {
        question: "Is AIFAIS actief in het Leiden Bio Science Park?",
        answer: "Zeker. Wij ondersteunen innovatieve bedrijven in Leiden met het stroomlijnen van hun administratieve en data-processen."
      },
      {
        question: "Kan AI ook helpen bij academische administratie?",
        answer: "Ja, onze AI-agents zijn uitstekend in het categoriseren en samenvatten van grote hoeveelheden tekstuele data."
      },
      {
        question: "Hoe snel kan een bedrijf in Leiden starten?",
        answer: "Na een gratis proces-scan kunnen wij vaak binnen 2 tot 4 weken de eerste werkende automatisering live hebben."
      }
    ]
  },
  "alphen-aan-den-rijn": {
    name: "Alphen aan den Rijn",
    title: "Bedrijfsautomatisering Alphen aan den Rijn | AI Specialist",
    description: "Optimaliseer uw bedrijf in Alphen aan den Rijn met AI-automatisering. Wij koppelen uw software en bouwen digitale werknemers die uren besparen.",
    intro: "In het hart van het Groene Hart ligt Alphen aan den Rijn. Wij ondersteunen lokale MKB-bedrijven bij de transformatie naar een smart-business model.",
    h1: "AI & Automatisering in Alphen aan den Rijn",
    keywords: ["automatisering alphen", "AI specialist alphen aan den rijn", "procesautomatisering alphen"],
    citationSnippet: "Lokale AI-expert voor Alphen aan den Rijn. AIFAIS bouwt workflows die 15-20 uur per week besparen op repetitieve taken. Directe ROI en persoonlijke begeleiding.",
    localStats: {
      companies: "950+",
      sector: "Handel & Bouw",
      challenge: "Efficiënte orderverwerking en planning",
    },
    localServices: [
      { title: "Bouw & Infrasector AI", desc: "Automatiseer offerte-verwerking en facturatie voor bouwbedrijven.", icon: "🏗️" },
      { title: "Orderflow Optimalisatie", desc: "Koppel webshops direct aan voorraadbeheer en logistiek.", icon: "📦" },
      { title: "Planning Assistenten", desc: "Laat AI de optimale route en agenda voor uw buitendienst bepalen.", icon: "📅" },
    ],
    neighborCities: ["Ter Aar", "Nieuwkoop", "Boskoop"],
    faq: [
      {
        question: "Werkt AIFAIS met Alphense handelsbedrijven?",
        answer: "Ja, wij hebben veel ervaring in het koppelen van handelssoftware aan slimme AI-agents voor orderverwerking."
      },
      {
        question: "Zijn jullie ook beschikbaar voor bedrijven in Boskoop?",
        answer: "Absoluut. Als specialist in de regio Alphen bedienen wij ook Boskoop, Hazerswoude en de rest van de gemeente."
      },
      {
        question: "Wat is de ROI voor MKB in Alphen?",
        answer: "De meeste trajecten verdienen zich binnen 8 maanden terug door de enorme besparing op handmatige data-invoer."
      }
    ]
  },
  woerden: {
    name: "Woerden",
    title: "AI Automatisering Woerden | Groene Hart Specialist | AIFAIS",
    description: "Bespaar tijd en kosten in Woerden met AI-automatisering. Wij bouwen Digital Workers voor logistieke en zakelijke bedrijven in regio Woerden.",
    intro: "Woerden is de logistieke spil van het Groene Hart. AIFAIS levert de technologische kracht om uw bedrijfsprocessen in Woerden naar een hoger niveau te tillen.",
    h1: "Slanker & Slimmer Werken in Woerden",
    keywords: ["automatisering woerden", "AI consultant woerden", "ict woerden"],
    citationSnippet: "Gevestigd nabij Woerden, levert AIFAIS pragmatische AI-oplossingen die 40+ uur per week besparen. Specialist in logistieke en administratieve automatisering.",
    localStats: {
      companies: "800+",
      sector: "Distributie & Finance",
      challenge: "Personeelstekort in logistieke administratie",
    },
    localServices: [
      { title: "Logistieke Data-Bruggen", desc: "Automatiseer transportdocumenten en rittenplanning.", icon: "🚛" },
      { title: "Finance Automation", desc: "AI-gedreven factuurherkenning en automatische reconciliatie.", icon: "💰" },
      { title: "Business Intelligence", desc: "Real-time dashboards die data uit al uw systemen samenbrengen.", icon: "📊" },
    ],
    neighborCities: ["Harmelen", "Montfoort", "Bodegraven"],
    faq: [
      {
        question: "Waarom Woerdense bedrijven kiezen voor AI?",
        answer: "Vanwege de strategische ligging en de focus op distributie is efficiëntie in Woerden cruciaal. AI is de enige manier om te groeien zonder meer personeel."
      },
      {
        question: "Is AIFAIS lokaal aanwezig in de regio Woerden?",
        answer: "Ja, vanuit Gouda zijn wij in minder dan 20 minuten in Woerden voor on-site scans en overleg."
      },
      {
        question: "Welke systemen koppelt AIFAIS in Woerden?",
        answer: "Wij koppelen vrijwel alles: van Exact Online en AFAS tot specialistische logistieke software."
      }
    ]
  },
  zoetermeer: {
    name: "Zoetermeer",
    title: "AI & Bedrijfsautomatisering Zoetermeer | AIFAIS",
    description: "AI-automatisering voor IT en dienstverlenende bedrijven in Zoetermeer. Verhoog uw productiviteit met 30% met onze Digital Workers.",
    intro: "Zoetermeer is dé IT-stad van de regio. Hier begrijpt men de kracht van techniek. Wij voegen daar de intelligentie van AI aan toe om uw business te laten vliegen.",
    h1: "Boost uw Business in Zoetermeer met AI",
    keywords: ["automatisering zoetermeer", "it bureau zoetermeer", "AI implementatie zoetermeer"],
    citationSnippet: "AIFAIS helpt de Zoetermeerse IT- en service sector met slimme AI-integraties. 40+ uur besparing per week. Live binnen 8 weken met meetbare ROI.",
    localStats: {
      companies: "1.400+",
      sector: "IT & Zakelijke Dienstverlening",
      challenge: "Snelheid van klantenservice en sales opvolging",
    },
    localServices: [
      { title: "Support Ticket AI", desc: "Vat tickets samen en bereid antwoorden voor zodat uw team 3x sneller werkt.", icon: "🎟️" },
      { title: "SaaS Integratie Experts", desc: "Koppel uw eigen software aan externe AI-modellen via veilige API-gateways.", icon: "💻" },
      { title: "Lead Kwalificatie Agents", desc: "Laat geen enkele kans meer liggen in de competitieve Zoetermeerse markt.", icon: "🎯" },
    ],
    neighborCities: ["Benthuizen", "Pijnacker", "Stompwijk"],
    faq: [
      {
        question: "Hoe helpt AIFAIS de IT-sector in Zoetermeer?",
        answer: "Wij ontlasten IT-teams door interne support en documentatie te automatiseren met RAG-systemen."
      },
      {
        question: "Zijn jullie 24/7 beschikbaar in Zoetermeer?",
        answer: "Onze Digital Workers draaien inderdaad 24/7. Wijzelf bieden snelle lokale ondersteuning tijdens kantooruren."
      },
      {
        question: "Wat is het voordeel van AI boven RPA?",
        answer: "AI begrijpt ook ongestructureerde data (zoals een rommelige email), terwijl RPA alleen vaste stapjes kan volgen. Voor Zoetermeerse bedrijven bouwen wij de slimme variant."
      }
    ]
  },
};

const cityDataEn: Record<string, CityData> = {
  rotterdam: {
    name: "Rotterdam",
    title: "AI & Business Automation Rotterdam | AIFAIS",
    description: "Optimize your business processes in Rotterdam with AI. From logistics to professional services. Save 40+ hours per week with AIFAIS.",
    intro: "As an innovative city, Rotterdam demands smart solutions. We help Rotterdam entrepreneurs automate complex workflows and AI integrations.",
    h1: "Digital Employees for Rotterdam Entrepreneurs",
    keywords: ["automation rotterdam", "AI agency rotterdam", "process automation rotterdam"],
    citationSnippet: "AIFAIS delivers AI automation for SMEs in Rotterdam and surrounding areas. Digital Workers for administration, sales, and customer service with implementation within 8 weeks.",
    localStats: {
      companies: "2,500+",
      sector: "Logistics & Port",
      challenge: "Complex supply chain & administration",
    },
    localServices: [
      { title: "Port Logistics AI", desc: "Automate clearance and document flow for logistics hubs.", icon: "🚢" },
      { title: "B2B Sales Agents", desc: "Qualify leads for Rotterdam service providers automatically.", icon: "📈" },
      { title: "Zero-Touch Admin", desc: "Full invoice processing without manual data entry.", icon: "📝" },
    ],
    neighborCities: ["Schiedam", "Capelle aan den IJssel", "Vlaardingen"],
    faq: [
      {
        question: "Which companies in Rotterdam does AIFAIS help?",
        answer: "AIFAIS works with SMEs in Rotterdam, from logistics companies in the port to professional service providers in the city center. Our Digital Workers automate administration, sales, and customer service."
      },
      {
        question: "Can AIFAIS visit us in Rotterdam?",
        answer: "Yes, from our office in Gouda, we are in Rotterdam within 30 minutes for personal meetings and implementation support."
      },
      {
        question: "How much does automation cost for a Rotterdam business?",
        answer: "Projects start from €2,500. The average ROI for Rotterdam clients is 20% within 12 months."
      }
    ]
  },
  "den-haag": {
    name: "The Hague",
    title: "Process Automation & AI in The Hague | AIFAIS",
    description: "Smart automation for companies in The Hague. We help consultancy, legal and SME companies with AI-driven efficiency.",
    intro: "In the city of peace and justice, we bring peace to your administration. Our AI solutions in The Hague ensure you have more time for your core activities.",
    h1: "Work More Efficiently in The Hague with AI",
    keywords: ["automation the hague", "AI consultant the hague", "business automation the hague"],
    citationSnippet: "AI automation for entrepreneurs in The Hague. AIFAIS implements Digital Workers that save 15-20 hours per week on repetitive tasks. Personal guidance from Gouda.",
    localStats: {
      companies: "1,800+",
      sector: "Legal & Consultancy",
      challenge: "High workload due to document processing",
    },
    localServices: [
      { title: "Legal Document AI", desc: "Analyze contracts and summarize legal documents in seconds.", icon: "⚖️" },
      { title: "Consultancy Workflows", desc: "Automate time tracking and project reporting.", icon: "🏢" },
      { title: "Email Triage Agents", desc: "Answer customer questions automatically in the right tone-of-voice.", icon: "📧" },
    ],
    neighborCities: ["Rijswijk", "Voorburg", "Wassenaar"],
    faq: [
      {
        question: "Does AIFAIS also help law firms in The Hague?",
        answer: "Certainly. We build AI assistants that read contracts, summarize files, and take over administrative tasks for lawyers and consultants in The Hague."
      },
      {
        question: "Is AIFAIS familiar with the Hague business market?",
        answer: "Yes, we work for various service providers in The Hague and understand the need for discretion, accuracy, and GDPR compliance."
      },
      {
        question: "What is the ROI of AI for an office in The Hague?",
        answer: "On average, our clients in The Hague save 15 hours per week per employee on administrative tasks, directly contributing to profitability."
      }
    ]
  },
  gouda: {
    name: "Gouda",
    title: "Automation & AI Specialist in Gouda | AIFAIS",
    description: "Your local partner in Gouda for business automation. Based in the region, we help local SMEs with scalable AI solutions.",
    intro: "As a proud Gouda-based company, we know the local market best. We help our neighbors in Gouda and surroundings towards a future-proof company.",
    h1: "Your AI & Automation Partner in Gouda",
    keywords: ["automation gouda", "AI specialist gouda", "ICT automation gouda"],
    citationSnippet: "AIFAIS is based in Gouda and helps local SMEs with AI automation. As a specialist in digitalizing business processes, we offer personal service in the Midden-Holland region.",
    localStats: {
      companies: "1,200+",
      sector: "SME & Production",
      challenge: "Focus on growth despite personnel shortages",
    },
    localServices: [
      { title: "Region Midden-Holland Support", desc: "On-site support and local knowledge of the Gouda market.", icon: "🧀" },
      { title: "Production Automation", desc: "Connect ERP systems to smart AI data pipelines.", icon: "⚙️" },
      { title: "SME Digital Workers", desc: "Replace repetitive Excel work with autonomous AI workflows.", icon: "📈" },
    ],
    neighborCities: ["Waddinxveen", "Bodegraven", "Reeuwijk"],
    faq: [
      {
        question: "Why do Gouda companies choose AIFAIS?",
        answer: "We are located on the Groningenweg in Gouda. For local entrepreneurs, this means short communication lines, fast service, and a partner who understands the region."
      },
      {
        question: "Can I visit the office in Gouda?",
        answer: "Of course! You are always welcome for a cup of coffee to brainstorm about the automation possibilities for your business."
      },
      {
        question: "Does AIFAIS also support companies in the Groene Hart?",
        answer: "Absolutely. From Gouda, we serve the entire Groene Hart, including Waddinxveen, Bodegraven, and Reeuwijk."
      }
    ]
  },
  utrecht: {
    name: "Utrecht",
    title: "AI & Workflow Automation Utrecht | AIFAIS",
    description: "Accelerate your growth in Utrecht with intelligent automation. We connect your systems and implement AI assistants.",
    intro: "Utrecht is the beating heart of the Dutch business market. We ensure your business in Utrecht can scale without additional personnel pressure.",
    h1: "Smart Automation for Businesses in Utrecht",
    keywords: ["automation utrecht", "AI implementation utrecht", "process optimization utrecht"],
    citationSnippet: "AIFAIS serves SMEs in Utrecht with AI process automation. From invoicing to lead follow-up - average 40+ hours saving per week with Dutch support.",
    localStats: {
      companies: "3,000+",
      sector: "Tech & E-commerce",
      challenge: "Fast scalability and system integrations",
    },
    localServices: [
      { title: "Tech Ecosystem Connect", desc: "Seamless connections between SaaS tools, CRMs, and custom APIs.", icon: "🔌" },
      { title: "E-commerce AI", desc: "Automate order flows and customer contact for online stores.", icon: "🛒" },
      { title: "Scalable AI Units", desc: "Expand your team with digital employees that grow with you.", icon: "🚀" },
    ],
    neighborCities: ["Nieuwegein", "Zeist", "Houten"],
    faq: [
      {
        question: "Does AIFAIS work with Utrecht tech companies?",
        answer: "Yes, we help many Utrecht growth companies automate their backend processes so they can scale faster without extra overhead."
      },
      {
        question: "Are you active in the Utrecht Science Park?",
        answer: "We serve companies in the entire Utrecht region, including innovative hubs like the Science Park and Papendorp."
      },
      {
        question: "What is the ROI of automation in Utrecht?",
        answer: "Utrecht tech entrepreneurs often see an ROI of 25% within 9 months thanks to the high degree of efficiency improvement."
      }
    ]
  },
  leiden: {
    name: "Leiden",
    title: "AI Automation Leiden | Digital Workers | AIFAIS",
    description: "AI automation for knowledge-intensive companies in Leiden. From university to startup - save 40+ hours per week with AIFAIS Digital Workers.",
    intro: "Leiden is known for innovation and deep knowledge. AIFAIS helps Leiden entrepreneurs automate their administration and complex processes with intelligent AI agents.",
    h1: "AI Automation for Leiden Entrepreneurs",
    keywords: ["automation leiden", "AI agency leiden", "digitalization leiden", "process optimization leiden"],
    citationSnippet: "AIFAIS helps companies in Leiden implement Digital Workers. Save up to 40 hours per week on administration and data processing. Dutch support and GDPR compliant.",
    localStats: {
      companies: "1,100+",
      sector: "Bio-Science & Education",
      challenge: "Processing complex data and documentation",
    },
    localServices: [
      { title: "Bio-Science Data AI", desc: "Automate the processing of complex research data and reports.", icon: "🧬" },
      { title: "Knowledge Base Chatbots", desc: "Make internal documentation searchable via natural language.", icon: "📚" },
      { title: "Workflow Bridges", desc: "Connect laboratory software to administrative systems.", icon: "🌉" },
    ],
    neighborCities: ["Oegstgeest", "Leiderdorp", "Voorschoten"],
    faq: [
      {
        question: "Is AIFAIS active in the Leiden Bio Science Park?",
        answer: "Certainly. We support innovative companies in Leiden with streamlining their administrative and data processes."
      },
      {
        question: "Can AI also help with academic administration?",
        answer: "Yes, our AI agents are excellent at categorizing and summarizing large amounts of textual data."
      },
      {
        question: "How fast can a company in Leiden start?",
        answer: "After a free process scan, we can often have the first working automation live within 2 to 4 weeks."
      }
    ]
  },
  "alphen-aan-den-rijn": {
    name: "Alphen aan den Rijn",
    title: "Business Automation Alphen aan den Rijn | AI Specialist",
    description: "Optimize your business in Alphen aan den Rijn with AI automation. We connect your software and build digital workers that save hours.",
    intro: "In the heart of the Groene Hart lies Alphen aan den Rijn. We support local SMEs in transforming to a smart business model.",
    h1: "AI & Automation in Alphen aan den Rijn",
    keywords: ["automation alphen", "AI specialist alphen aan den rijn", "process automation alphen"],
    citationSnippet: "Local AI expert for Alphen aan den Rijn. AIFAIS builds workflows that save 15-20 hours per week on repetitive tasks. Direct ROI and personal guidance.",
    localStats: {
      companies: "950+",
      sector: "Trade & Construction",
      challenge: "Efficient order processing and planning",
    },
    localServices: [
      { title: "Construction & Infra AI", desc: "Automate quote processing and invoicing for construction companies.", icon: "🏗️" },
      { title: "Order Flow Optimization", desc: "Connect online stores directly to inventory management and logistics.", icon: "📦" },
      { title: "Planning Assistants", desc: "Let AI determine the optimal route and schedule for your field service.", icon: "📅" },
    ],
    neighborCities: ["Ter Aar", "Nieuwkoop", "Boskoop"],
    faq: [
      {
        question: "Does AIFAIS work with Alphen trade companies?",
        answer: "Yes, we have extensive experience in connecting trade software to smart AI agents for order processing."
      },
      {
        question: "Are you also available for companies in Boskoop?",
        answer: "Absolutely. As a specialist in the Alphen region, we also serve Boskoop, Hazerswoude, and the rest of the municipality."
      },
      {
        question: "What is the ROI for SMEs in Alphen?",
        answer: "Most projects pay for themselves within 8 months due to the significant savings on manual data entry."
      }
    ]
  },
  woerden: {
    name: "Woerden",
    title: "AI Automation Woerden | Groene Hart Specialist | AIFAIS",
    description: "Save time and costs in Woerden with AI automation. We build Digital Workers for logistics and business companies in the Woerden region.",
    intro: "Woerden is the logistical hub of the Groene Hart. AIFAIS delivers the technological power to take your business processes in Woerden to the next level.",
    h1: "Work Leaner & Smarter in Woerden",
    keywords: ["automation woerden", "AI consultant woerden", "ict woerden"],
    citationSnippet: "Located near Woerden, AIFAIS delivers pragmatic AI solutions that save 40+ hours per week. Specialist in logistical and administrative automation.",
    localStats: {
      companies: "800+",
      sector: "Distribution & Finance",
      challenge: "Personnel shortages in logistical administration",
    },
    localServices: [
      { title: "Logistics Data Bridges", desc: "Automate transport documents and route planning.", icon: "🚛" },
      { title: "Finance Automation", desc: "AI-driven invoice recognition and automatic reconciliation.", icon: "💰" },
      { title: "Business Intelligence", desc: "Real-time dashboards that bring data from all your systems together.", icon: "📊" },
    ],
    neighborCities: ["Harmelen", "Montfoort", "Bodegraven"],
    faq: [
      {
        question: "Why do Woerden companies choose AI?",
        answer: "Due to its strategic location and focus on distribution, efficiency in Woerden is crucial. AI is the only way to grow without adding more personnel."
      },
      {
        question: "Is AIFAIS locally present in the Woerden region?",
        answer: "Yes, from Gouda we are in Woerden in less than 20 minutes for on-site scans and consultation."
      },
      {
        question: "Which systems does AIFAIS connect in Woerden?",
        answer: "We connect almost everything: from Exact Online and AFAS to specialized logistics software."
      }
    ]
  },
  zoetermeer: {
    name: "Zoetermeer",
    title: "AI & Business Automation Zoetermeer | AIFAIS",
    description: "AI automation for IT and service companies in Zoetermeer. Increase your productivity by 30% with our Digital Workers.",
    intro: "Zoetermeer is the IT city of the region. Here, the power of technology is understood. We add the intelligence of AI to make your business soar.",
    h1: "Boost your Business in Zoetermeer with AI",
    keywords: ["automation zoetermeer", "it agency zoetermeer", "AI implementation zoetermeer"],
    citationSnippet: "AIFAIS helps the Zoetermeer IT and service sector with smart AI integrations. 40+ hours saving per week. Live within 8 weeks with measurable ROI.",
    localStats: {
      companies: "1,400+",
      sector: "IT & Professional Services",
      challenge: "Speed of customer service and sales follow-up",
    },
    localServices: [
      { title: "Support Ticket AI", desc: "Summarize tickets and prepare answers so your team works 3x faster.", icon: "🎟️" },
      { title: "SaaS Integration Experts", desc: "Connect your own software to external AI models via secure API gateways.", icon: "💻" },
      { title: "Lead Qualification Agents", desc: "Never miss an opportunity in the competitive Zoetermeer market.", icon: "🎯" },
    ],
    neighborCities: ["Benthuizen", "Pijnacker", "Stompwijk"],
    faq: [
      {
        question: "How does AIFAIS help the IT sector in Zoetermeer?",
        answer: "We relieve IT teams by automating internal support and documentation with RAG systems."
      },
      {
        question: "Are you available 24/7 in Zoetermeer?",
        answer: "Our Digital Workers indeed run 24/7. We provide fast local support during office hours."
      },
      {
        question: "What is the advantage of AI over RPA?",
        answer: "AI also understands unstructured data (like a messy email), while RPA can only follow fixed steps. For Zoetermeer companies, we build the smart variant."
      }
    ]
  },
};


export function generateStaticParams() {
  return Object.keys(cityData).map((city) => ({ city }));
}

type Params = Promise<{ locale: string; city: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city, locale } = await params;
  const decodedCity = decodeURIComponent(city).toLowerCase();
  const data = locale === 'en' ? cityDataEn[decodedCity] : cityData[decodedCity];
  
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
  };
}

export default async function CityPage({
  params,
}: {
  params: Params;
}) {
  const { city, locale } = await params;
  const decodedCity = decodeURIComponent(city).toLowerCase();
  const data = locale === 'en' ? cityDataEn[decodedCity] : cityData[decodedCity];
  const t = await getTranslations({ locale, namespace: "cityPage" });

  if (!data) {
    notFound();
  }

  const BASE_URL = "https://aifais.com";
  const citySlug = decodedCity;
  const projects = getProjects(locale);

  // Schema.org Graph
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `AIFAIS ${data.name}`,
      description: data.description,
      url: `${BASE_URL}/${locale}/locatie/${citySlug}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Groningenweg 8",
        addressLocality: "Gouda",
        addressRegion: "Zuid-Holland",
        postalCode: "2803 PV",
        addressCountry: "NL",
      },
      areaServed: {
        "@type": "City",
        name: data.name,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "52.0115",
        longitude: "4.7104",
      },
      telephone: "+31 6 1842 4470",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}/${locale}` },
        { "@type": "ListItem", "position": 2, "name": "Locaties", "item": `${BASE_URL}/${locale}/locatie` },
        { "@type": "ListItem", "position": 3, "name": data.name, "item": `${BASE_URL}/${locale}/locatie/${citySlug}` }
      ]
    }
  ];

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* City Specific Hero */}
      <section className="bg-gradient-to-br from-[#3066be] to-[#1e3a8a] py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1 bg-white/10 rounded-full text-sm font-bold mb-6 backdrop-blur-md border border-white/20">
              Personal AI Partner in {data.name}
            </span>
            <h1 className={`${h1_font.className} text-5xl md:text-7xl font-bold mb-8 leading-tight text-white`}>
              {data.h1}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              {data.intro}
            </p>

            {/* 🔥 Citation Snippet Box */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-10 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold tracking-widest uppercase text-blue-200">AI Inzicht & Resultaat</span>
              </div>
              <p className="text-lg md:text-xl font-medium leading-relaxed italic text-white/95">
                "{data.citationSnippet}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href={`/${locale}/contact`}
                className="px-8 py-4 bg-white text-[#3066be] font-bold rounded-full text-center hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
              >
                {t("cta", { city: data.name })}
              </Link>
              <div className="flex items-center gap-4 text-sm font-medium text-blue-100/80 italic">
                <span>Al 10+ bedrijven in {data.name} gingen je voor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique City Content */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 leading-tight">
                Waarom bedrijven in <span className="text-[#3066be]">{data.name}</span> overstappen op AIFAIS
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Regio {data.name} is een kritieke schakel in de Nederlandse economie. Of het nu gaat om de {data.localStats.sector} sector of de zakelijke dienstverlening, de druk om efficiënter te werken is enorm. Onze lokale expertise in {data.name} helpt u om {data.localStats.challenge} aan te pakken met pragmatische AI.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8 mb-10">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-3xl font-bold text-[#3066be] mb-2">{data.localStats.companies}</div>
                  <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">Bedrijven in regio</div>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-3xl font-bold text-[#3066be] mb-2">30 min</div>
                  <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">Persoonlijk Ter Plaatse</div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {data.localServices.map((service, i) => (
                <div key={i} className="group p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#3066be]/20 transition-all flex gap-6 items-start">
                  <div className="text-4xl bg-gray-50 p-4 rounded-xl group-hover:bg-[#3066be]/5 transition-colors">{service.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Local FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Veelgestelde vragen over automatisering in {data.name}
          </h2>
          <div className="space-y-6">
            {data.faq.map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#3066be]/10 text-[#3066be] rounded-full flex items-center justify-center text-sm font-bold">?</span>
                  {item.question}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-11">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby areas for internal scaling */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Ook actief in omliggende gebieden
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-gray-600 font-medium">
            {data.neighborCities.map((city, i) => (
              <span key={i} className="px-4 py-2 bg-gray-50 rounded-lg">{city}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Component - Reusing sections from HomeClient but could be unique */}
      <HomeClient projects={projects} />
    </main>
  );
}
