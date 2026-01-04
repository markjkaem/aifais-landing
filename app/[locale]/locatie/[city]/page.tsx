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

      {/* Hero Section - Premium Dark Design */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3066be]/20 via-transparent to-[#3066be]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(48,102,190,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(48,102,190,0.1),transparent_50%)]" />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-[#3066be]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-[#3066be]/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              {/* Location badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl mb-8 group hover:bg-white/10 transition-all cursor-default">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                </span>
                <span className="text-sm font-medium text-white/80">AI Partner in {data.name}</span>
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              {/* Main headline */}
              <h1 className={`${h1_font.className} text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight`}>
                <span className="text-white">{data.h1.split(' ').slice(0, -2).join(' ')}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-white">
                  {data.h1.split(' ').slice(-2).join(' ')}
                </span>
              </h1>

              {/* Intro text */}
              <p className="text-lg md:text-xl text-white/60 mb-10 leading-relaxed max-w-xl">
                {data.intro}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href={`/${locale}/contact`}
                  className="group relative px-8 py-4 bg-[#3066be] hover:bg-[#2554a3] text-white font-bold text-base rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(48,102,190,0.3)] hover:shadow-[0_0_40px_rgba(48,102,190,0.5)] transform hover:-translate-y-1"
                >
                  <span>{t("cta", { city: data.name })}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={`/${locale}/tools/roi-calculator`}
                  className="px-8 py-4 bg-white/5 border border-white/20 rounded-full text-white font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center backdrop-blur-md"
                >
                  Bereken uw ROI
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>40+ uur besparing/week</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Live binnen 8 weken</span>
                </div>
              </div>
            </div>

            {/* Right side - Citation card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#3066be]/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/60">AI Insight</span>
                </div>
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-white/90 mb-6">
                  &ldquo;{data.citationSnippet}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3066be] to-blue-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">AIFAIS</div>
                    <div className="text-sm text-white/50">Digital Workforce Solutions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Stat 1 - Companies */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#3066be]/20 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3066be]/10 to-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-[#3066be]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{data.localStats.companies}</div>
              <div className="text-sm font-medium text-gray-500">Bedrijven in regio {data.name}</div>
            </div>

            {/* Stat 2 - Sector */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#3066be]/20 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-xl font-bold text-gray-900 mb-2">{data.localStats.sector}</div>
              <div className="text-sm font-medium text-gray-500">Primaire sector</div>
            </div>

            {/* Stat 3 - Response time */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#3066be]/20 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">30 min</div>
              <div className="text-sm font-medium text-gray-500">Persoonlijk ter plaatse</div>
            </div>

            {/* Stat 4 - ROI */}
            <div className="group bg-gradient-to-br from-[#3066be] to-blue-700 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-4xl font-bold mb-2">20%+</div>
              <div className="text-sm font-medium text-blue-100">Gemiddelde ROI binnen 12 maanden</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#3066be] to-purple-500" />
              <span className="text-sm font-medium text-gray-600">Onze specialisaties</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              AI oplossingen voor{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-blue-600">{data.name}</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Wij pakken de {data.localStats.challenge.toLowerCase()} aan met pragmatische AI-oplossingen die direct resultaat leveren.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {data.localServices.map((service, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-500 hover:-translate-y-2"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3066be]/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#3066be] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-[#3066be] to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-gray-600">Waarom AIFAIS</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 tracking-tight leading-tight">
                Waarom bedrijven in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-blue-600">{data.name}</span>{' '}
                kiezen voor AIFAIS
              </h2>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Regio {data.name} is een kritieke schakel in de Nederlandse economie.
                Of het nu gaat om de {data.localStats.sector} sector of de zakelijke dienstverlening,
                de druk om efficiënter te werken is enorm.
              </p>

              {/* Benefits list */}
              <div className="space-y-5">
                {[
                  { icon: '🎯', title: 'Lokale expertise', desc: `Wij kennen de markt in ${data.name} en omgeving` },
                  { icon: '⚡', title: 'Snelle implementatie', desc: 'Eerste resultaten binnen 2-4 weken zichtbaar' },
                  { icon: '🤝', title: 'Persoonlijke aanpak', desc: 'Altijd binnen 30 minuten bij u op kantoor' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <div className="font-bold text-gray-900 mb-1">{item.title}</div>
                      <div className="text-gray-600 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Visual element */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#3066be]/10 to-purple-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-3xl p-10 border border-gray-100 shadow-xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#3066be] to-blue-600 mb-6 shadow-lg shadow-blue-500/30">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Resultaatgarantie</h3>
                  <p className="text-gray-600">Meetbare ROI of uw geld terug</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Gemiddelde tijdsbesparing</span>
                    <span className="font-bold text-gray-900">40+ uur/week</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Implementatietijd</span>
                    <span className="font-bold text-gray-900">2-8 weken</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <span className="text-emerald-700">Klanttevredenheid</span>
                    <span className="font-bold text-emerald-700">9.2/10</span>
                  </div>
                </div>

                <Link
                  href={`/${locale}/contact`}
                  className="mt-8 w-full py-4 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors"
                >
                  Start uw gratis proces-scan
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#3066be]" />
              <span className="text-sm font-medium text-gray-600">Veelgestelde vragen</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Vragen over AI in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3066be] to-blue-600">{data.name}</span>
            </h2>
          </div>

          {/* FAQ items */}
          <div className="space-y-4">
            {data.faq.map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#3066be]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#3066be]/10 to-blue-100 flex items-center justify-center group-hover:from-[#3066be] group-hover:to-blue-600 transition-all duration-300">
                      <svg className="w-5 h-5 text-[#3066be] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-[#3066be] transition-colors">
                        {item.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More questions CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Heeft u een andere vraag?</p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all"
            >
              Neem contact op
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Nearby cities section */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ook actief in de regio</h3>
              <p className="text-gray-500">Wij helpen bedrijven in {data.name} en omgeving</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-3">
              {data.neighborCities.map((neighborCity, i) => (
                <span
                  key={i}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-700 font-medium hover:border-[#3066be]/30 hover:text-[#3066be] transition-all cursor-default"
                >
                  {neighborCity}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Component */}
      <HomeClient projects={projects} hideHero />
    </main>
  );
}
