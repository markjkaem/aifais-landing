export interface BenchmarkSector {
    slug: string;
    name: string;
    avgDigitalScore: number;
    avgFTEAdmin: string;
    commonTools: string[];
    topChallenge: string;
    potentialSaving: string;
}

export const benchmarkData: Record<string, BenchmarkSector> = {
    accountants: {
        slug: "accountants",
        name: "Accountancy",
        avgDigitalScore: 52,
        avgFTEAdmin: "2.5 FTE",
        commonTools: ["Exact Online", "Excel", "Outlook"],
        topChallenge: "Handmatige factuurverwerking & Reconciliatie",
        potentialSaving: "€24.000 / jaar"
    },
    advocaten: {
        slug: "advocaten",
        name: "Advocatuur",
        avgDigitalScore: 38,
        avgFTEAdmin: "1.2 FTE",
        commonTools: ["Word", "Outlook", "Dossierbeheer"],
        topChallenge: "Contract review & Dossier management",
        potentialSaving: "€18.500 / jaar"
    },
    "e-commerce": {
        slug: "e-commerce",
        name: "E-commerce",
        avgDigitalScore: 65,
        avgFTEAdmin: "3.5 FTE",
        commonTools: ["Shopify", "Klantenservice software", "Excel"],
        topChallenge: "Orderflow & Klantenservice tickets",
        potentialSaving: "€32.000 / jaar"
    },
    overig: {
        slug: "overig",
        name: "Overig MKB",
        avgDigitalScore: 45,
        avgFTEAdmin: "2.0 FTE",
        commonTools: ["Diverse SaaS", "Excel", "E-mail"],
        topChallenge: "Gefragmenteerde processen & Handmatig werk",
        potentialSaving: "€15.000 / jaar"
    }
};

export const questions = [
    {
        id: 1,
        question: "Hoeveel van uw administratieve tijd gaat naar repetitief werk?",
        options: [
            { label: "Minder dan 20%", score: 80 },
            { label: "Tussen 20% en 50%", score: 50 },
            { label: "Meer dan 50%", score: 20 }
        ]
    },
    {
        id: 2,
        question: "Hoe verwerkt u momenteel inkomende facturen of documenten?",
        options: [
            { label: "Volledig handmatig (overtypen)", score: 10 },
            { label: "Deels via software met handmatige controle", score: 50 },
            { label: "Volledig geautomatiseerd via AI/API", score: 100 }
        ]
    },
    {
        id: 3,
        question: "Gebruikt u al AI tools in uw dagelijkse workflow?",
        options: [
            { label: "Niet of nauwelijks", score: 10 },
            { label: "Alleen ChatGPT voor teksten", score: 40 },
            { label: "AI is geïntegreerd in onze kernprocessen", score: 90 }
        ]
    },
    {
        id: 4,
        question: "Hoe snel worden klantvragen of tickets afgehandeld?",
        options: [
            { label: "Binnen een uur (24/7)", score: 100 },
            { label: "Binnen een werkdag", score: 60 },
            { label: "Langer dan een werkdag", score: 30 }
        ]
    },
    {
        id: 5,
        question: "Zijn uw huidige softwaresystemen met elkaar gekoppeld?",
        options: [
            { label: "Nee, veel handmatig knip- en plakwerk", score: 10 },
            { label: "Deels, via standaard koppelingen", score: 60 },
            { label: "Ja, alle systemen communiceren via APIs/Webhooks", score: 100 }
        ]
    }
];
