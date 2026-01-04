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
} from "lucide-react";

export type ToolStatus = "live" | "beta" | "soon";
export type ToolCategory = "finance" | "legal" | "hr" | "marketing" | "sales" | "ecommerce" | "technology" | "support" | "creative" | "consulting";

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
    };

    // Component
    componentPath: string; // Path to the client component
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
        metaDescription: "Laat AI je contract controleren op risico's en valkuilen. Krijg direct een professioneel rapport. Vanaf 0.01 SOL.",
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
            price: 0.01,
            currency: "SOL",
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
        metaTitle: "Algemene Voorwaarden Generator (0.005 SOL) | Juridisch Dicht | AIFAIS",
        metaDescription: "Genereer professionele algemene voorwaarden voor je bedrijf in 3 stappen. AI genereert voorwaarden op maat. Kosten: 0.005 SOL.",
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
            price: 0.005,
            currency: "SOL",
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