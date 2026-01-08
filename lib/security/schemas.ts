import { z } from "zod";

// ==================== Constants ====================

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_BASE64_LENGTH = Math.ceil(MAX_FILE_SIZE_BYTES * 1.37); // Base64 adds ~37%
export const MAX_BULK_FILES = 10;
export const MAX_TEXT_LENGTH = 10000;
export const MAX_DESCRIPTION_LENGTH = 5000;

// ==================== Helper Validators ====================

// Base64 string with size limit
const base64String = (maxLength = MAX_BASE64_LENGTH) =>
    z.string()
        .min(1, "Bestand is verplicht")
        .max(maxLength, `Bestand is te groot (max ${Math.round(maxLength / 1024 / 1024)}MB)`);

// Mime type validators
const imageMimeType = z.enum(["image/jpeg", "image/png", "image/webp"]);
const pdfMimeType = z.enum(["application/pdf"]);
const documentMimeType = z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

// ==================== Payment Schema ====================

export const paymentSchema = z.object({
    signature: z.string().nullable().optional(),
    stripeSessionId: z.string().nullable().optional(),
});

// ==================== Internal Schemas ====================

export const newsletterSchema = z.object({
    email: z.string().email("Ongeldig emailadres"),
    source: z.enum(["newsletter", "lead_magnet", "article_cta", "homepage"]).optional().default("newsletter"),
    resource: z.string().max(100).optional(), // e.g., "ai_checklist", "roi_template"
    name: z.string().max(100).optional(),
}).merge(paymentSchema);

export const contactSchema = z.object({
    name: z.string().min(2, "Naam is te kort").max(100, "Naam is te lang"),
    email: z.string().email("Ongeldig emailadres"),
    phone: z.string().max(20).optional(),
    message: z.string().min(5, "Bericht is te kort").max(MAX_TEXT_LENGTH, "Bericht is te lang"),
}).merge(paymentSchema);

export const benchmarkSchema = z.object({
    email: z.string().email("Ongeldig emailadres"),
    sector: z.string().min(1, "Sector is verplicht"),
    score: z.number().min(0).max(100),
    benchmark: z.number().min(0).max(100),
}).merge(paymentSchema);

export const quickscanSchema = z.object({
    email: z.string().email("Ongeldig emailadres"),
    results: z.object({
        totalSavings: z.string().nullable().optional(),
        hoursReclaimed: z.union([z.string(), z.number()]).nullable().optional(),
        fteRecovered: z.union([z.string(), z.number()]).nullable().optional(),
    }).nullable().optional(),
    formData: z.object({
        name: z.string().nullable().optional(),
        company: z.string().nullable().optional(),
        process: z.string().nullable().optional(),
    }).nullable().optional(),
}).merge(paymentSchema);

// ==================== Finance Schemas ====================

export const scanSchema = z.object({
    // Single file mode (legacy)
    invoiceBase64: base64String().optional(),
    mimeType: documentMimeType.optional(),

    // Bulk mode
    invoices: z.array(z.object({
        base64: base64String(),
        mimeType: documentMimeType,
        filename: z.string().max(255).optional()
    })).max(MAX_BULK_FILES, `Maximaal ${MAX_BULK_FILES} bestanden tegelijk`).optional(),

    signature: z.string().nullable().optional(),
    stripeSessionId: z.string().nullable().optional(),
    format: z.enum(["json", "csv", "xlsx"]).nullable().optional().default("json"),
}).refine(
    data => data.invoiceBase64 || (data.invoices && data.invoices.length > 0),
    { message: "Minimaal 1 factuur is verplicht" }
);

export const createInvoiceSchema = z.object({
    ownName: z.string().min(1, "Bedrijfsnaam is verplicht").max(200),
    ownAddress: z.string().max(500).optional(),
    ownKvk: z.string().max(20).optional(),
    ownIban: z.string().max(50).optional(),
    ownLogo: z.string().max(MAX_BASE64_LENGTH).nullable().optional(),

    clientName: z.string().min(1, "Klantnaam is verplicht").max(200),
    clientAddress: z.string().max(500).optional(),

    invoiceNumber: z.string().min(1, "Factuurnummer is verplicht").max(50),
    invoiceDate: z.string().min(1, "Factuurdatum is verplicht"),
    expiryDate: z.string().min(1, "Vervaldatum is verplicht"),

    discountPercentage: z.number().min(0).max(100).default(0),
    notes: z.string().max(2000).optional(),

    items: z.array(z.object({
        id: z.string().optional(),
        description: z.string().min(1, "Omschrijving is verplicht").max(500),
        quantity: z.number().min(0.01, "Aantal moet groter dan 0 zijn").max(1000000),
        price: z.number().min(0, "Prijs moet 0 of hoger zijn").max(10000000),
        vatRate: z.number().min(0).max(100)
    })).min(1, "Minimaal 1 regel is verplicht").max(100),
}).merge(paymentSchema);

export const generateQuoteSchema = z.object({
    companyName: z.string().min(1, "Bedrijfsnaam is verplicht").max(200),
    companyAddress: z.string().max(500).optional(),
    companyKvk: z.string().max(20).optional(),
    companyVat: z.string().max(30).optional(),
    companyLogo: z.string().max(MAX_BASE64_LENGTH).optional(),

    clientName: z.string().min(1, "Klantnaam is verplicht").max(200),
    clientAddress: z.string().max(500).optional(),

    projectTitle: z.string().min(1, "Projecttitel is verplicht").max(200),
    projectDescription: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),

    items: z.array(z.object({
        description: z.string().min(1).max(500),
        quantity: z.number().min(0.01).max(1000000),
        price: z.number().min(0).max(10000000)
    })).min(1).max(100),

    validUntil: z.number().min(1).max(365).optional().default(30),
}).merge(paymentSchema);

// ==================== Legal Schemas ====================

export const checkContractSchema = z.object({
    contractBase64: base64String(),
    mimeType: pdfMimeType,
    contractType: z.string().max(100).optional(), // Optional: helps with better analysis
}).merge(paymentSchema);

export const generateTermsSchema = z.object({
    companyName: z.string().min(1, "Bedrijfsnaam is verplicht").max(200),
    companyType: z.enum([
        "webshop", "saas", "consultancy", "agency", "retail", "wholesale",
        "manufacturing", "services", "freelance", "other"
    ]),
    industry: z.string().max(100).optional(),

    hasPhysicalProducts: z.boolean(),
    hasDigitalProducts: z.boolean(),
    hasServices: z.boolean(),

    acceptsReturns: z.boolean(),
    returnDays: z.number().min(0).max(365).optional(),

    paymentTerms: z.number().min(0).max(365),
    jurisdiction: z.enum(["Nederland", "Belgie", "EU"]).default("Nederland"),

    includeGDPR: z.boolean().optional().default(true),
}).merge(paymentSchema).refine(
    data => !data.acceptsReturns || (data.returnDays && data.returnDays > 0),
    { message: "Retourperiode is verplicht als retouren worden geaccepteerd", path: ["returnDays"] }
);

// ==================== HR Schemas ====================

export const cvScreenerSchema = z.object({
    cvBase64: base64String(),
    mimeType: documentMimeType,
    jobDescription: z.string().min(20, "Vacaturebeschrijving is te kort").max(MAX_DESCRIPTION_LENGTH),
    filename: z.string().max(255).optional(),
}).merge(paymentSchema);

export const cvScreenerBulkSchema = z.object({
    cvs: z.array(z.object({
        base64: base64String(),
        mimeType: documentMimeType,
        filename: z.string().max(255).optional()
    })).min(1).max(MAX_BULK_FILES),
    jobDescription: z.string().min(20).max(MAX_DESCRIPTION_LENGTH),
}).merge(paymentSchema);

export const interviewQuestionsSchema = z.object({
    jobTitle: z.string().min(1, "Functietitel is verplicht").max(100),
    jobDescription: z.string().min(10, "Functiebeschrijving is te kort").max(MAX_DESCRIPTION_LENGTH),
    experienceLevel: z.enum(["junior", "medior", "senior"]),
    questionCount: z.number().min(3).max(15).default(8),
    includeCategories: z.array(
        z.enum(["Technisch", "Gedrag", "Situatie", "Motivatie", "Cultuur"])
    ).optional(),
    includeRubrics: z.boolean().optional().default(true),
    includeFollowUps: z.boolean().optional().default(true),
}).merge(paymentSchema);

// ==================== Marketing Schemas ====================

export const socialPlannerSchema = z.object({
    topic: z.string().min(1, "Onderwerp is verplicht").max(500),
    platforms: z.array(
        z.enum(["linkedin", "instagram", "facebook", "twitter", "tiktok"])
    ).min(1, "Kies minimaal 1 platform"),
    postCount: z.number().min(1).max(10).default(5),
    tone: z.enum(["professional", "casual", "inspirational", "educational"]).default("professional"),
    includeHashtags: z.boolean().default(true),
    targetAudience: z.string().max(500).optional(),
    generateVariants: z.boolean().optional().default(false),
}).merge(paymentSchema);

export const seoAuditSchema = z.object({
    url: z.string().url("Ongeldige URL").max(2000),
    focusKeywords: z.string().max(500).optional(),
    competitorUrls: z.array(z.string().url()).max(3).optional(),
}).merge(paymentSchema);

// ==================== Sales Schemas ====================

export const leadScorerSchema = z.object({
    companyName: z.string().min(1, "Bedrijfsnaam is verplicht").max(200),
    industry: z.string().min(1, "Industrie is verplicht").max(100),
    companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
    budget: z.enum(["unknown", "low", "medium", "high"]).default("unknown"),
    engagement: z.object({
        websiteVisits: z.number().min(0).max(10000).optional(),
        emailOpens: z.number().min(0).max(1000).optional(),
        demoRequested: z.boolean().optional(),
        downloadedContent: z.boolean().optional(),
        lastActivity: z.string().optional(),
    }).optional(),
    notes: z.string().max(2000).optional(),
    generateEmail: z.boolean().optional().default(true),
}).merge(paymentSchema);

export const leadScorerBulkSchema = z.object({
    leads: z.array(z.object({
        companyName: z.string().min(1).max(200),
        industry: z.string().max(100).optional(),
        companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]).optional(),
        budget: z.enum(["unknown", "low", "medium", "high"]).optional(),
        engagement: z.object({
            websiteVisits: z.number().optional(),
            demoRequested: z.boolean().optional(),
        }).optional(),
        notes: z.string().max(500).optional(),
    })).min(1).max(50),
}).merge(paymentSchema);

export const pitchDeckSchema = z.object({
    companyName: z.string().min(1, "Bedrijfsnaam is verplicht").max(200),
    productService: z.string().min(10, "Beschrijving is te kort").max(MAX_DESCRIPTION_LENGTH),
    targetAudience: z.string().min(5, "Doelgroep is te kort").max(1000),
    problemSolution: z.string().min(10, "Probleem/oplossing is te kort").max(MAX_DESCRIPTION_LENGTH),
    uniqueValue: z.string().min(10, "Unieke waarde is te kort").max(1000),
    askAmount: z.string().max(100).optional(),
    slideCount: z.number().min(5).max(15).default(10),
    audienceType: z.enum(["investors", "customers", "partners"]).optional().default("investors"),
    includeFinancials: z.boolean().optional().default(false),
}).merge(paymentSchema);

// ==================== Business Intelligence Schemas ====================

// Dutch provinces for filtering
const dutchProvinces = [
    "Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen",
    "Limburg", "Noord-Brabant", "Noord-Holland", "Overijssel",
    "Utrecht", "Zeeland", "Zuid-Holland"
] as const;

export const kvkSearchSchema = z.object({
    // Search query - required for name search, optional for postcode/sbi
    query: z.string().max(200).optional(),

    // Search type - expanded with postcode and SBI code
    type: z.enum(["naam", "kvkNummer", "postcode", "sbiCode"]).default("naam"),

    // Location filters
    plaats: z.string().max(100).optional(),
    postcode: z.string().regex(/^\d{4}[A-Z]{2}$/, "Ongeldige postcode (bijv. 1234AB)").optional(),
    provincie: z.enum(dutchProvinces).optional(),

    // SBI code filter (CBS business classification)
    sbiCode: z.string().regex(/^\d{2,5}$/, "Ongeldige SBI code (2-5 cijfers)").optional(),

    // Include inactive companies
    inclusiefInactief: z.boolean().optional().default(false),

    // For detailed lookup after search
    getFullProfile: z.boolean().optional().default(false),

    // NEW: Data inclusion options (for full profile)
    include: z.object({
        directors: z.boolean().default(true),       // Bestuurders
        relations: z.boolean().default(false),      // Company relations (expensive)
        legalStatus: z.boolean().default(true),     // Bankruptcy, dissolution
        financial: z.boolean().default(true),       // Financial indicators
    }).optional(),

    // Enrichment options (external data)
    enrichments: z.object({
        website: z.boolean().default(true),
        socials: z.boolean().default(true),
        techStack: z.boolean().default(true),
        news: z.boolean().default(true),
        reviews: z.boolean().default(true),
        aiAnalysis: z.boolean().default(true),
    }).optional(),
}).merge(paymentSchema).refine(
    // Validate that required fields are present based on search type
    (data) => {
        if (data.type === "naam" && !data.query) {
            return false;
        }
        if (data.type === "kvkNummer" && !data.query) {
            return false;
        }
        if (data.type === "postcode" && !data.postcode && !data.query) {
            return false;
        }
        if (data.type === "sbiCode" && !data.sbiCode && !data.query) {
            return false;
        }
        return true;
    },
    {
        message: "Zoekterm is verplicht voor dit zoektype",
        path: ["query"],
    }
);

// ==================== Consulting Schemas ====================

export const roiCalculatorSchema = z.object({
    currentCosts: z.object({
        laborHours: z.number().min(0).max(100000),
        hourlyRate: z.number().min(0).max(10000),
        toolsCost: z.number().min(0).max(10000000).optional(),
        otherCosts: z.number().min(0).max(10000000).optional(),
    }),
    projectedSavings: z.object({
        automationPercentage: z.number().min(0).max(100),
        implementationCost: z.number().min(0).max(10000000),
        monthlyToolCost: z.number().min(0).max(100000).optional(),
    }),
    timeframe: z.number().min(1).max(60).default(12), // months
}).merge(paymentSchema);

// ==================== Type Exports ====================

export type ScanInput = z.infer<typeof scanSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type GenerateQuoteInput = z.infer<typeof generateQuoteSchema>;
export type CheckContractInput = z.infer<typeof checkContractSchema>;
export type GenerateTermsInput = z.infer<typeof generateTermsSchema>;
export type CvScreenerInput = z.infer<typeof cvScreenerSchema>;
export type InterviewQuestionsInput = z.infer<typeof interviewQuestionsSchema>;
export type SocialPlannerInput = z.infer<typeof socialPlannerSchema>;
export type SeoAuditInput = z.infer<typeof seoAuditSchema>;
export type LeadScorerInput = z.infer<typeof leadScorerSchema>;
export type PitchDeckInput = z.infer<typeof pitchDeckSchema>;
export type RoiCalculatorInput = z.infer<typeof roiCalculatorSchema>;
export type KvkSearchInput = z.infer<typeof kvkSearchSchema>;

