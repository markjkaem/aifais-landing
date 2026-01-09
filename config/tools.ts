import { LucideIcon } from "lucide-react";
import {
    ScanLine,
    FileText,
    PenTool,
    Scale,
    ShieldCheck,
    Users,
    Briefcase,
    Mail,
    Linkedin,
    Receipt,
    TrendingUp,
    PiggyBank,
    FileLock,
    Lock,
    Gavel,
    ClipboardList,
    MessageSquare,
    FileCheck,
    Megaphone,
    BarChart3,
    Calendar,
    Target,
    Package,
    Cpu,
    Database,
    Headphones,
    Image,
    Palette,
    Calculator,
    Building2,
    FileSpreadsheet,
    Swords,
    Compass,
} from "lucide-react";

export type ToolStatus = "live" | "beta" | "soon";
export type ToolCategory = "finance" | "legal" | "hr" | "marketing" | "sales" | "business" | "ecommerce" | "technology" | "support" | "creative" | "consulting";

export interface ToolMetadata {
    id: string;
    slug: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    icon: LucideIcon;
    status: ToolStatus;
    category: ToolCategory;
    featured?: boolean;
    new?: boolean;

    // SEO
    metaTitle: string;
    metaDescription: string;
    keywords: string[];

    // Features
    features: string[];
    useCases: string[];

    // Pricing
    pricing: {
        type: "free" | "paid" | "freemium";
        price?: number;
        currency?: string;
        priceEur?: number;
        stripeLink?: string;
    };

    // Component
    componentPath: string; // Path to the client component
    createdAt?: number;
    usageCount?: number;
}

export const TOOL_REGISTRY: Record<string, ToolMetadata> = {
    "invoice-extraction": {
        id: "invoice-extraction",
        slug: "invoice-extraction",
        title: "Factuur Scanner",
        shortDescription: "Zet PDF facturen om naar Excel/CSV. Herkent automatisch KvK, BTW-nummers en alle regels.",
        longDescription: "Onze AI-powered factuur scanner analyseert je PDF facturen en extraheert automatisch alle belangrijke gegevens. Van KvK-nummers tot BTW-bedragen, alles wordt herkend en omgezet naar een overzichtelijk Excel of CSV bestand.",
        icon: ScanLine,
        status: "live",
        category: "finance",
        featured: true,
        metaTitle: "AI Factuur Scanner | PDF naar Excel & CSV | AIFAIS",
        metaDescription: "Scan facturen met AI. Automatische herkenning van KvK, BTW, bedragen en regels. Export naar Excel/CSV. Gratis te proberen.",
        keywords: ["factuur scanner", "PDF naar Excel", "factuur OCR", "automatische boekhouding", "factuur verwerking"],
        features: [
            "Automatische KvK en BTW herkenning",
            "Bulk verwerking van meerdere facturen",
            "Export naar Excel en CSV",
            "99% nauwkeurigheid",
        ],
        useCases: [
            "Administratie automatiseren",
            "Boekhouding versnellen",
            "Facturen digitaliseren",
        ],
        pricing: {
            type: "paid",
            price: 0.001,
            currency: "SOL",
            priceEur: 0.50,
            stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_SINGLE,
        },
        componentPath: "invoice-extraction/ScannerClient",
    },

    "invoice-creation": {
        id: "invoice-creation",
        slug: "invoice-creation",
        title: "Factuur Maker",
        shortDescription: "Maak professionele facturen in seconden. Gratis, geen account nodig.",
        longDescription: "Genereer professionele facturen met onze gratis factuur maker. Geen account nodig, direct downloaden als PDF. Perfect voor ZZP'ers en kleine ondernemers.",
        icon: FileText,
        status: "live",
        category: "finance",
        featured: true,
        metaTitle: "Gratis Factuur Maken | Professionele PDF Generator | AIFAIS",
        metaDescription: "Maak gratis professionele facturen. Geen account nodig. Direct downloaden als PDF. Perfect voor ZZP en MKB.",
        keywords: ["factuur maken", "gratis factuur", "factuur generator", "PDF factuur", "ZZP factuur"],
        features: [
            "Professioneel design",
            "Direct PDF download",
            "Geen account vereist",
            "100% gratis",
        ],
        useCases: [
            "Facturen versturen naar klanten",
            "Administratie bijhouden",
            "Professionele uitstraling",
        ],
        pricing: {
            type: "free",
        },
        componentPath: "invoice-creation/InvoiceGenerator",
    },

    "price-calculator": {
        id: "price-calculator",
        slug: "price-calculator",
        title: "Prijs Calculator",
        shortDescription: "Bereken de optimale verkoopprijs voor je producten. Inclusief marge, BTW en concurrentie-analyse.",
        longDescription: "Bepaal de perfecte verkoopprijs voor je producten met onze AI-powered calculator. Bereken marges, analyseer concurrentieprijzen en krijg strategische prijsadviezen voor jouw marktpositie.",
        icon: Calculator,
        status: "live",
        category: "finance",
        new: true,
        metaTitle: "Prijs Calculator | Optimale Verkoopprijs Berekenen | AIFAIS",
        metaDescription: "Bereken gratis de optimale verkoopprijs voor je producten. Inclusief marge-analyse, BTW berekening en concurrentie-vergelijking.",
        keywords: ["prijs calculator", "verkoopprijs berekenen", "marge berekenen", "pricing tool", "BTW calculator", "kostprijscalculatie"],
        features: [
            "Automatische marge-berekening",
            "BTW inclusief/exclusief calculator",
            "Concurrentie prijsanalyse",
            "AI-powered prijsadvies",
        ],
        useCases: [
            "Nieuwe producten prijzen",
            "Marges optimaliseren",
            "Concurrentie-analyse",
        ],
        pricing: {
            type: "free",
        },
        componentPath: "price-calculator/PriceCalculatorClient",
    },

    "quote-generator": {
        id: "quote-generator",
        slug: "quote-generator",
        title: "Offerte Generator",
        shortDescription: "Genereer winnende offertes op basis van je input. Direct PDF export.",
        longDescription: "Maak professionele offertes in minuten. Vul het formulier in en download direct je offerte als PDF. Inclusief BTW berekening en professionele opmaak.",
        icon: PenTool,
        status: "live",
        category: "finance",
        new: true,
        metaTitle: "Gratis Offerte Maken | Professionele PDF Generator | AIFAIS",
        metaDescription: "Maak in 2 minuten een professionele offerte. Gratis, geen account nodig. Direct downloaden als PDF. Perfect voor ZZP en MKB.",
        keywords: ["offerte maken", "offerte generator", "gratis offerte", "PDF offerte", "zakelijke offerte"],
        features: [
            "Automatische BTW berekening",
            "Professionele PDF output",
            "Meerdere items toevoegen",
            "Aanpasbare geldigheid",
        ],
        useCases: [
            "Offertes maken voor klanten",
            "Projecten calculeren",
            "Professionele presentatie",
        ],
        pricing: {
            type: "free",
        },
        componentPath: "quote-generator/QuoteGeneratorClient",
    },

    "contract-checker": {
        id: "contract-checker",
        slug: "contract-checker",
        title: "Contract Checker",
        shortDescription: "Upload een contract en krijg direct een analyse van risico's en valkuilen.",
        longDescription: "Laat AI je contract analyseren op juridische risico's, onduidelijke clausules en ontbrekende bescherming. Krijg een professioneel rapport met aanbevelingen.",
        icon: Scale,
        status: "live",
        category: "legal",
        featured: true,
        new: true,
        metaTitle: "Contract Checker AI | Voorkom Juridische Risico's | AIFAIS",
        metaDescription: "Laat AI je contract controleren op risico's en valkuilen. Krijg direct een professioneel rapport. Slechts €0.50.",
        keywords: ["contract checker", "contract analyse", "juridische AI", "contract risico's", "contract review"],
        features: [
            "AI-powered analyse met Claude 3.5",
            "Identificeert juridische risico's",
            "Downloadbaar PDF rapport",
            "Suggesties voor verbetering",
        ],
        useCases: [
            "Contracten controleren voor ondertekening",
            "Risico's identificeren",
            "Juridisch advies krijgen",
        ],
        pricing: {
            type: "paid",
            price: 0.001,
            currency: "SOL",
            priceEur: 0.50,
            stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_CONTRACT,
        },
        componentPath: "contract-checker/ContractCheckerClient",
    },

    "terms-generator": {
        id: "terms-generator",
        slug: "terms-generator",
        title: "Algemene Voorwaarden Generator",
        shortDescription: "Genereer juridisch dichte voorwaarden op maat voor jouw bedrijf.",
        longDescription: "Maak professionele algemene voorwaarden in 3 stappen. AI genereert voorwaarden op basis van Nederlandse wetgeving, specifiek voor jouw bedrijfstype.",
        icon: ShieldCheck,
        status: "live",
        category: "legal",
        metaTitle: "Algemene Voorwaarden Generator (€0.50) | Juridisch Dicht | AIFAIS",
        metaDescription: "Genereer professionele algemene voorwaarden voor je bedrijf in 3 stappen. AI genereert voorwaarden op maat. Kosten: €0.50.",
        keywords: ["algemene voorwaarden", "voorwaarden generator", "juridische voorwaarden", "AVG voorwaarden", "bedrijfsvoorwaarden"],
        features: [
            "Wizard-style formulier (3 stappen)",
            "AI-gegenereerde voorwaarden",
            "Gebaseerd op NL wetgeving",
            "Direct PDF download",
        ],
        useCases: [
            "Voorwaarden voor website",
            "Voorwaarden voor diensten",
            "Juridische bescherming",
        ],
        pricing: {
            type: "paid",
            price: 0.001,
            currency: "SOL",
            priceEur: 0.50,
            stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_TERMS,
        },
        componentPath: "terms-generator/TermsGeneratorClient",
    },

    "roi-calculator": {
        id: "roi-calculator",
        slug: "roi-calculator",
        title: "ROI Calculator",
        shortDescription: "Bereken de ROI van AI automatisering voor jouw bedrijf. Gratis tool.",
        longDescription: "Ontdek hoeveel tijd en geld je bespaart door AI automatisering. Vul je huidige situatie in en zie direct wat de impact is op je bedrijf.",
        icon: Calculator,
        status: "live",
        category: "consulting",
        metaTitle: "ROI Calculator AI Automatisering | Bereken je Besparing | AIFAIS",
        metaDescription: "Bereken gratis de ROI van AI automatisering. Zie direct hoeveel tijd en geld je bespaart. Inclusief benchmark data.",
        keywords: ["ROI calculator", "AI ROI", "automatisering besparing", "business calculator", "efficiency calculator"],
        features: [
            "Realtime ROI berekening",
            "Benchmark met andere bedrijven",
            "Gedetailleerd rapport",
            "Gratis te gebruiken",
        ],
        useCases: [
            "Business case maken voor AI",
            "Besparing berekenen",
            "Investering rechtvaardigen",
        ],
        pricing: {
            type: "free",
        },
        componentPath: "roi-calculator/ROICalculatorPageClient",
    },

    "benchmark": {
        id: "benchmark",
        slug: "benchmark",
        title: "AI Benchmark Tool",
        shortDescription: "Vergelijk je AI gebruik met andere bedrijven in jouw sector.",
        longDescription: "Zie hoe jouw bedrijf scoort op het gebied van AI adoptie vergeleken met andere bedrijven in je sector. Krijg inzichten en aanbevelingen.",
        icon: BarChart3,
        status: "live",
        category: "consulting",
        metaTitle: "AI Benchmark | Vergelijk je AI Gebruik | AIFAIS",
        metaDescription: "Benchmark je AI gebruik tegen andere bedrijven. Gratis tool met sector-specifieke inzichten en aanbevelingen.",
        keywords: ["AI benchmark", "AI adoptie", "sector vergelijking", "AI maturity", "business intelligence"],
        features: [
            "Sector-specifieke benchmarks",
            "Visuele rapportage",
            "Aanbevelingen op maat",
            "Gratis inzichten",
        ],
        useCases: [
            "AI strategie bepalen",
            "Concurrentie analyse",
            "Verbeterpunten identificeren",
        ],
        pricing: {
            type: "free",
        },
        componentPath: "benchmark/BenchmarkTool",
    },

    // ==================== HR TOOLS ====================
    "cv-screener": {
        id: "cv-screener",
        slug: "cv-screener",
        title: "CV Screener",
        shortDescription: "Analyseer en score CVs automatisch tegen je vacature. Bespaar uren op handmatige screening.",
        longDescription: "Upload een CV en vacature-omschrijving. Onze AI analyseert de match en geeft een gedetailleerde score met sterke/zwakke punten.",
        icon: Users,
        status: "live",
        category: "hr",
        new: true,
        metaTitle: "AI CV Screener | Automatische Kandidaat Analyse | AIFAIS",
        metaDescription: "Screen CVs automatisch met AI. Krijg scores, sterke punten en aanbevelingen in seconden.",
        keywords: ["cv screener", "kandidaat analyse", "recruitment AI", "cv beoordelen"],
        features: ["Match score 0-100", "Sterke/zwakke punten", "Skill matching", "Ervaring analyse"],
        useCases: ["Recruitment versnellen", "Objectieve beoordeling", "Bulk CV screening"],
        pricing: { type: "paid", price: 0.001, currency: "SOL", priceEur: 0.50, stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_CV },
        componentPath: "cv-screener/CvScreenerClient",
    },
    "interview-questions": {
        id: "interview-questions",
        slug: "interview-questions",
        title: "Sollicitatievragen Generator",
        shortDescription: "Genereer gepersonaliseerde interviewvragen op basis van functie en niveau.",
        longDescription: "Voer de functietitel en beschrijving in. AI genereert relevante technische, gedrags- en situatievragen.",
        icon: MessageSquare,
        status: "live",
        category: "hr",
        new: true,
        metaTitle: "AI Sollicitatievragen Generator | Interview Prep | AIFAIS",
        metaDescription: "Genereer gepersonaliseerde interviewvragen voor elke functie. Junior tot senior niveau.",
        keywords: ["sollicitatievragen", "interview vragen", "hr tool", "recruitment"],
        features: ["Technische vragen", "Gedragsvragen", "Situatievragen", "Niveau-specifiek"],
        useCases: ["Interview voorbereiding", "Consistente evaluatie", "HR processen"],
        pricing: { type: "paid", price: 0.001, currency: "SOL", priceEur: 0.50, stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_INTERVIEW },
        componentPath: "interview-questions/InterviewQuestionsClient",
    },

    // ==================== MARKETING TOOLS ====================
    "social-planner": {
        id: "social-planner",
        slug: "social-planner",
        title: "Social Media Planner",
        shortDescription: "Genereer social media content voor LinkedIn, Instagram, Twitter en meer.",
        longDescription: "Voer je onderwerp in en krijg platform-specifieke posts met hashtags en optimale post-tijden.",
        icon: Megaphone,
        status: "live",
        category: "marketing",
        new: true,
        metaTitle: "AI Social Media Planner | Content Generator | AIFAIS",
        metaDescription: "Genereer social media posts voor alle platforms. Inclusief hashtags en beste post-tijden.",
        keywords: ["social media", "content planner", "linkedin posts", "instagram content"],
        features: ["Multi-platform", "Hashtag suggesties", "Tone customization", "Post timing"],
        useCases: ["Content strategie", "Marketing automatisering", "Social media management"],
        pricing: { type: "paid", price: 0.001, currency: "SOL", priceEur: 0.50, stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_SOCIAL },
        componentPath: "social-planner/SocialPlannerClient",
    },


    // ==================== SALES TOOLS ====================
    "pitch-deck": {
        id: "pitch-deck",
        slug: "pitch-deck",
        title: "Pitch Deck Generator",
        shortDescription: "Genereer een professionele pitch deck voor investeerders of klanten.",
        longDescription: "Voer je bedrijfsinfo in en krijg een complete slide-by-slide pitch met speaker notes.",
        icon: Briefcase,
        status: "live",
        category: "sales",
        new: true,
        metaTitle: "AI Pitch Deck Generator | Investor Ready | AIFAIS",
        metaDescription: "Genereer professionele pitch decks in minuten. Perfect voor investeerders en klantpresentaties.",
        keywords: ["pitch deck", "investor pitch", "presentatie", "sales deck"],
        features: ["Slide content", "Speaker notes", "Aanpasbaar", "Best practices"],
        useCases: ["Funding rondes", "Sales presentaties", "Startup pitches"],
        pricing: { type: "paid", price: 0.001, currency: "SOL", priceEur: 0.50, stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_PITCH },
        componentPath: "pitch-deck/PitchDeckClient",
    },
    "lead-scorer": {
        id: "lead-scorer",
        slug: "lead-scorer",
        title: "Lead Scorer",
        shortDescription: "Score en prioriteer je leads automatisch op basis van bedrijfsdata en engagement.",
        longDescription: "Analyseer company fit, engagement en timing om de warmste leads te identificeren.",
        icon: Target,
        status: "live",
        category: "sales",
        new: true,
        metaTitle: "AI Lead Scorer | Sales Prioritization | AIFAIS",
        metaDescription: "Score leads automatisch op company fit, engagement en budget. Prioriteer je sales pipeline.",
        keywords: ["lead scoring", "sales tool", "crm", "pipeline management"],
        features: ["Company fit score", "Engagement tracking", "Budget analyse", "Next action"],
        useCases: ["Sales prioritering", "Pipeline management", "Lead qualification"],
        pricing: { type: "paid", price: 0.001, currency: "SOL", priceEur: 0.50, stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_LEAD },
        componentPath: "lead-scorer/LeadScorerClient",
    },

    // ==================== BUSINESS INTELLIGENCE TOOLS ====================
    "kvk-search": {
        id: "kvk-search",
        slug: "kvk-search",
        title: "KVK Bedrijfszoeker",
        shortDescription: "Zoek en analyseer elk Nederlands bedrijf. KVK data, website, socials, tech stack en AI-analyse.",
        longDescription: "De ultieme company intelligence tool. Zoek op bedrijfsnaam of KVK nummer en krijg een compleet bedrijfsprofiel: officiële KVK data, website, social media, technologie stack, recent nieuws, reviews en AI-powered bedrijfsanalyse. Perfect voor sales prospecting, due diligence en marktonderzoek.",
        icon: Building2,
        status: "live",
        category: "business",
        featured: true,
        new: true,
        metaTitle: "KVK Bedrijfszoeker | Company Intelligence Tool | AIFAIS",
        metaDescription: "Zoek elk Nederlands bedrijf op KVK of naam. Krijg volledige bedrijfsinfo: KVK data, website, socials, tech stack, nieuws en AI-analyse.",
        keywords: [
            "kvk zoeken",
            "bedrijf zoeken",
            "company intelligence",
            "kvk api",
            "bedrijfsinformatie",
            "handelsregister",
            "due diligence",
            "sales prospecting",
            "marktonderzoek",
            "bedrijfsanalyse"
        ],
        features: [
            "Officiële KVK Handelsregister data",
            "Website & contact discovery",
            "Social media profielen",
            "Tech stack analyse",
            "Recent nieuws & persberichten",
            "Google Reviews & Trustpilot",
            "AI-powered bedrijfsanalyse",
            "Export naar PDF, Excel, JSON"
        ],
        useCases: [
            "Sales prospecting & lead research",
            "Due diligence bij overnames",
            "Leveranciers doorlichten",
            "Concurrentie analyse",
            "Marktonderzoek"
        ],
        pricing: {
            type: "paid",
            price: 0.001,
            currency: "SOL",
            priceEur: 0.50,
            stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_KVK,
        },
        componentPath: "kvk-search/KvkSearchClient",
    },

    // ==================== NEW TOOLS ====================

    "email-generator": {
        id: "email-generator",
        slug: "email-generator",
        title: "Email Generator",
        shortDescription: "Genereer professionele zakelijke emails in seconden. Van offertes tot follow-ups.",
        longDescription: "Schrijf overtuigende zakelijke emails met AI. Kies je email type, toon en ontvanger en krijg direct een professionele email. Perfect voor proposals, follow-ups, introducties en meer.",
        icon: Mail,
        status: "live",
        category: "marketing",
        new: true,
        metaTitle: "AI Email Generator | Professionele Zakelijke Emails | AIFAIS",
        metaDescription: "Genereer professionele zakelijke emails in seconden. Proposals, follow-ups, introducties. Gratis te gebruiken.",
        keywords: ["email generator", "zakelijke email", "business email", "email schrijven", "professionele email"],
        features: [
            "10+ email types (proposal, follow-up, etc.)",
            "Aanpasbare toon (formeel, vriendelijk)",
            "Nederlands en Engels",
            "A/B varianten genereren",
        ],
        useCases: [
            "Offertes versturen",
            "Follow-up emails",
            "Klant introducties",
            "Meeting requests",
        ],
        pricing: {
            type: "free",
        },
        componentPath: "email-generator/EmailGeneratorClient",
    },

    "business-plan": {
        id: "business-plan",
        slug: "business-plan",
        title: "Business Plan Generator",
        shortDescription: "Genereer een professioneel businessplan voor banken, investeerders of intern gebruik.",
        longDescription: "Maak een volledig businessplan in minuten. Vul je bedrijfsidee, doelmarkt en verdienmodel in en krijg een professioneel plan met financiële projecties, SWOT analyse en milestones. Perfect voor financieringsaanvragen.",
        icon: FileSpreadsheet,
        status: "live",
        category: "consulting",
        new: true,
        metaTitle: "AI Business Plan Generator | Investeerder-Ready | AIFAIS",
        metaDescription: "Genereer een professioneel businessplan voor banken of investeerders. Inclusief financiële projecties en SWOT analyse.",
        keywords: ["business plan", "businessplan", "ondernemingsplan", "financiering", "investeerders", "startup plan"],
        features: [
            "Complete businessplan structuur",
            "Financiële projecties",
            "SWOT analyse inbegrepen",
            "Bank/investeerder-ready format",
        ],
        useCases: [
            "Banklening aanvragen",
            "Investeerders pitchen",
            "Startup plannen",
            "Interne strategie",
        ],
        pricing: {
            type: "paid",
            price: 0.001,
            currency: "SOL",
            priceEur: 0.50,
            stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_BUSINESSPLAN,
        },
        componentPath: "business-plan/BusinessPlanClient",
    },

    "meeting-summarizer": {
        id: "meeting-summarizer",
        slug: "meeting-summarizer",
        title: "Meeting Summarizer",
        shortDescription: "Zet ongestructureerde meeting notities om naar actionable samenvattingen met actiepunten.",
        longDescription: "Plak je meeting notities en krijg direct een gestructureerde samenvatting met kernpunten, actiepunten met eigenaren en deadlines, beslissingen en optioneel een follow-up email.",
        icon: ClipboardList,
        status: "live",
        category: "business",
        new: true,
        metaTitle: "AI Meeting Summarizer | Notities naar Actiepunten | AIFAIS",
        metaDescription: "Zet meeting notities om naar gestructureerde samenvattingen. Automatische actiepunten en beslissingen extractie.",
        keywords: ["meeting summarizer", "vergadering samenvatting", "meeting notes", "actiepunten", "notulen"],
        features: [
            "Automatische actiepunten extractie",
            "Beslissingen identificatie",
            "Follow-up email generator",
            "Prioriteit toekenning",
        ],
        useCases: [
            "Team meetings samenvatten",
            "Klant gesprekken vastleggen",
            "Actiepunten tracken",
            "Follow-up emails sturen",
        ],
        pricing: {
            type: "paid",
            price: 0.001,
            currency: "SOL",
            priceEur: 0.50,
            stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_MEETING,
        },
        componentPath: "meeting-summarizer/MeetingSummarizerClient",
    },

    "competitor-analyzer": {
        id: "competitor-analyzer",
        slug: "competitor-analyzer",
        title: "Competitor Analyzer",
        shortDescription: "Analyseer je concurrenten en ontdek jouw unieke positie in de markt.",
        longDescription: "Vergelijk je bedrijf met tot 5 concurrenten. Krijg inzicht in sterke/zwakke punten, kansen en bedreigingen, plus concrete strategische aanbevelingen om je te onderscheiden.",
        icon: Swords,
        status: "live",
        category: "sales",
        new: true,
        metaTitle: "AI Competitor Analyzer | Concurrentie Analyse | AIFAIS",
        metaDescription: "Analyseer je concurrenten met AI. Ontdek kansen, bedreigingen en strategische aanbevelingen voor jouw marktpositie.",
        keywords: ["competitor analysis", "concurrentie analyse", "marktanalyse", "competitive intelligence", "marktpositie"],
        features: [
            "Tot 5 concurrenten vergelijken",
            "Sterkte/zwakte analyse",
            "Kansen en bedreigingen",
            "Strategische aanbevelingen",
        ],
        useCases: [
            "Marktpositionering bepalen",
            "Prijsstrategie optimaliseren",
            "USP's identificeren",
            "Sales argumenten ontwikkelen",
        ],
        pricing: {
            type: "paid",
            price: 0.001,
            currency: "SOL",
            priceEur: 0.50,
            stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_COMPETITOR,
        },
        componentPath: "competitor-analyzer/CompetitorAnalyzerClient",
    },

    "swot-generator": {
        id: "swot-generator",
        slug: "swot-generator",
        title: "SWOT Generator",
        shortDescription: "Genereer een uitgebreide SWOT analyse voor je bedrijf met concrete aanbevelingen.",
        longDescription: "Krijg een professionele SWOT analyse op basis van je bedrijfsbeschrijving. Inclusief strategische inzichten, prioriteitenmatrix en actieplan met concrete vervolgstappen.",
        icon: Compass,
        status: "live",
        category: "consulting",
        new: true,
        metaTitle: "AI SWOT Generator | Strategische Analyse | AIFAIS",
        metaDescription: "Genereer een professionele SWOT analyse met AI. Sterkte, zwaktes, kansen en bedreigingen plus actieplan.",
        keywords: ["swot analyse", "swot generator", "strategische analyse", "business strategie", "bedrijfsanalyse"],
        features: [
            "Uitgebreide SWOT matrix",
            "Strategische combinatie-analyse (SO/WO/ST/WT)",
            "Prioriteitenmatrix",
            "Concreet actieplan",
        ],
        useCases: [
            "Strategische planning",
            "Jaarplan opstellen",
            "Investeerder presentaties",
            "Business case onderbouwing",
        ],
        pricing: {
            type: "paid",
            price: 0.001,
            currency: "SOL",
            priceEur: 0.50,
            stripeLink: process.env.NEXT_PUBLIC_STRIPE_LINK_SWOT,
        },
        componentPath: "swot-generator/SwotGeneratorClient",
    },
};

// Helper functions
export function getToolBySlug(slug: string): ToolMetadata | undefined {
    return TOOL_REGISTRY[slug];
}

export function getAllTools(): ToolMetadata[] {
    return Object.values(TOOL_REGISTRY);
}

export function getToolsByCategory(category: ToolCategory): ToolMetadata[] {
    return getAllTools().filter(tool => tool.category === category);
}

export function getToolsByStatus(status: ToolStatus): ToolMetadata[] {
    return getAllTools().filter(tool => tool.status === status);
}

export function getFeaturedTools(): ToolMetadata[] {
    return getAllTools().filter(tool => tool.featured);
}

export function getToolSlugs(): string[] {
    return Object.keys(TOOL_REGISTRY);
}