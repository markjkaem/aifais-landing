
export type APIParam = {
    name: string;
    type: string;
    required: boolean;
    description: string;
};

export type APIEndpoint = {
    id: string; // URL slug style
    name: string; // Function name style (snake_case)
    title: string; // Human readable title
    description: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    category: "finance" | "legal" | "hr" | "marketing" | "sales";
    price: string; // Display price
    isFree?: boolean;
    status: "live" | "beta" | "coming";
    isNew?: boolean;
    params: APIParam[];
    responseExample?: string;
};

export const API_CATEGORIES = [
    { id: "finance", name: "Finance", icon: "💰", description: "Facturen, offertes & financiële documenten", color: "emerald" },
    { id: "legal", name: "Legal", icon: "⚖️", description: "Contracten, voorwaarden & compliance", color: "violet" },
    { id: "hr", name: "HR", icon: "👥", description: "Personeelszaken & recruitment", color: "amber" },
    { id: "marketing", name: "Marketing", icon: "📢", description: "Content, SEO & campagnes", color: "rose" },
    { id: "sales", name: "Sales", icon: "🤝", description: "Leads, pipeline & deals", color: "blue" },
] as const;

export const API_ENDPOINTS: APIEndpoint[] = [
    // FINANCE
    {
        id: "scan-invoice",
        name: "scan_invoice",
        title: "Scan Invoice",
        description: "Extract structured data from invoices and receipts using AI vision. Supports PDF, JPG, and PNG.",
        method: "POST",
        path: "/api/v1/finance/scan",
        category: "finance",
        price: "0.001 SOL",
        status: "live",
        params: [
            { name: "invoiceBase64", type: "string", required: true, description: "Base64 encoded document" },
            { name: "mimeType", type: "string", required: true, description: "image/jpeg, image/png, or application/pdf" },
            { name: "signature", type: "string", required: false, description: "X402 payment signature (required for paid requests)" },
        ],
        responseExample: `{
  "success": true,
  "data": {
    "vendor": "Bol.com B.V.",
    "invoiceNumber": "INV-2024-001",
    "date": "2024-01-15",
    "total": 149.99,
    "vat": 26.03,
    "currency": "EUR",
    "lineItems": [...]
  }
}`
    },
    {
        id: "create-invoice",
        name: "create_invoice",
        title: "Create Invoice",
        description: "Generate a professional PDF invoice from structured data.",
        method: "POST",
        path: "/api/v1/finance/create-invoice",
        category: "finance",
        price: "Free",
        isFree: true,
        status: "live",
        isNew: true,
        params: [
            { name: "ownName", type: "string", required: true, description: "Your company name" },
            { name: "ownAddress", type: "string", required: false, description: "Your company address" },
            { name: "clientName", type: "string", required: true, description: "Client company name" },
            { name: "items", type: "array", required: true, description: "Array of invoice line items" },
            { name: "invoiceNumber", type: "string", required: false, description: "Custom invoice number" },
        ],
        responseExample: `{
  "success": true,
  "data": {
    "pdfBase64": "JVBERi0xLjQK...",
    "invoiceNumber": "2024-001"
  }
}`
    },
    {
        id: "generate-quote",
        name: "generate_quote",
        title: "Generate Quote",
        description: "Generate a professional PDF quote/proposal from structured data.",
        method: "POST",
        path: "/api/v1/finance/generate-quote",
        category: "finance",
        price: "Free",
        isFree: true,
        status: "live",
        isNew: true,
        params: [
            { name: "companyName", type: "string", required: true, description: "Your company name" },
            { name: "clientName", type: "string", required: true, description: "Client name" },
            { name: "projectTitle", type: "string", required: true, description: "Project or quote title" },
            { name: "items", type: "array", required: true, description: "Array of quote line items" },
            { name: "validUntil", type: "number", required: false, description: "Validity in days (default: 30)" },
        ]
    },
    {
        id: "price-calculator",
        name: "price_calculator",
        title: "Price Calculator",
        description: "Calculate optimal product pricing based on costs, margins, and market analysis with AI-powered insights.",
        method: "POST",
        path: "/api/v1/finance/price-calculator",
        category: "finance",
        price: "Free",
        isFree: true,
        status: "live",
        isNew: true,
        params: [
            { name: "productName", type: "string", required: true, description: "Name of the product" },
            { name: "costPrice", type: "number", required: true, description: "Cost price per unit" },
            { name: "targetMargin", type: "number", required: false, description: "Target profit margin percentage (0-100, default: 30)" },
            { name: "competitorPrices", type: "array", required: false, description: "Array of competitor prices for analysis" },
            { name: "marketPosition", type: "string", required: false, description: "'budget', 'mid-range', or 'premium' (default: mid-range)" },
            { name: "includeVAT", type: "boolean", required: false, description: "Include VAT in calculations (default: true)" },
            { name: "vatRate", type: "number", required: false, description: "VAT percentage (default: 21)" },
            { name: "quantity", type: "number", required: false, description: "Quantity for bulk calculations" },
            { name: "additionalCosts", type: "object", required: false, description: "Additional costs: shipping, packaging, marketing, overhead" },
        ],
        responseExample: `{
  "productName": "Premium Widget",
  "pricing": {
    "recommendedPriceExVAT": 142.86,
    "vatAmount": 30.00,
    "recommendedPriceInclVAT": 172.86,
    "targetMargin": 30,
    "actualMargin": 30
  },
  "profit": {
    "perUnit": 42.86,
    "total": 428.60,
    "quantity": 10
  },
  "aiInsights": {
    "insights": ["Tip 1", "Tip 2"],
    "riskLevel": "low",
    "recommendation": "..."
  }
}`
    },

    // LEGAL
    {
        id: "check-contract",
        name: "check_contract",
        title: "Check Contract",
        description: "AI-powered contract analysis. Identifies risks, unfavorable clauses, and compliance issues based on Dutch law.",
        method: "POST",
        path: "/api/v1/legal/check-contract",
        category: "legal",
        price: "0.001 SOL",
        status: "live",
        params: [
            { name: "contractBase64", type: "string", required: true, description: "Base64 encoded PDF contract" },
            { name: "signature", type: "string", required: true, description: "X402 payment signature" },
            { name: "focusAreas", type: "array", required: false, description: "Specific areas to analyze" },
        ]
    },
    {
        id: "generate-terms",
        name: "generate_terms",
        title: "Generate Terms",
        description: "Generate custom terms & conditions tailored to your business type and Dutch regulations.",
        method: "POST",
        path: "/api/v1/legal/generate-terms",
        category: "legal",
        price: "0.001 SOL",
        status: "live",
        params: [
            { name: "companyName", type: "string", required: true, description: "Your company name" },
            { name: "companyType", type: "string", required: true, description: "Business type (BV, VOF, ZZP, etc.)" },
            { name: "industry", type: "string", required: false, description: "Your industry for specific clauses" },
            { name: "signature", type: "string", required: true, description: "X402 payment signature" },
        ]
    },

    // HR
    {
        id: "cv-screener",
        name: "cv_screener",
        title: "CV Screener",
        description: "Analyze and score CVs against job descriptions automatically.",
        method: "POST",
        path: "/api/v1/hr/cv-screener",
        category: "hr",
        price: "0.001 SOL",
        status: "live",
        isNew: true,
        params: [
            { name: "cvBase64", type: "string", required: true, description: "Base64 encoded CV (PDF/DOCX)" },
            { name: "mimeType", type: "string", required: true, description: "MIME type of the CV" },
            { name: "jobDescription", type: "string", required: true, description: "Job description text" },
            { name: "signature", type: "string", required: true, description: "X402 payment signature" },
        ]
    },
    {
        id: "interview-questions",
        name: "interview_questions",
        title: "Interview Questions",
        description: "Generate personalized interview questions based on job role and experience.",
        method: "POST",
        path: "/api/v1/hr/interview-questions",
        category: "hr",
        price: "0.001 SOL",
        status: "live",
        isNew: true,
        params: [
            { name: "jobTitle", type: "string", required: true, description: "Job title" },
            { name: "jobDescription", type: "string", required: true, description: "Job description or context" },
            { name: "experienceLevel", type: "string", required: true, description: "'junior', 'medior', or 'senior'" },
            { name: "questionCount", type: "number", required: false, description: "Number of questions (default: 8)" },
            { name: "signature", type: "string", required: true, description: "X402 payment signature" },
        ]
    },

    // MARKETING
    {
        id: "social-planner",
        name: "social_planner",
        title: "Social Media Planner",
        description: "Generate platform-specific social media content plans with hashtags and timing.",
        method: "POST",
        path: "/api/v1/marketing/social-planner",
        category: "marketing",
        price: "0.001 SOL",
        status: "live",
        isNew: true,
        params: [
            { name: "topic", type: "string", required: true, description: "Topic or campaign theme" },
            { name: "platforms", type: "array", required: true, description: "Array of platforms (e.g. ['linkedin', 'instagram'])" },
            { name: "postCount", type: "number", required: false, description: "Number of posts to generate" },
            { name: "tone", type: "string", required: false, description: "Tone of voice (default: professional)" },
            { name: "signature", type: "string", required: true, description: "X402 payment signature" },
        ]
    },

    // SALES
    {
        id: "lead-scorer",
        name: "lead_scorer",
        title: "Lead Scorer",
        description: "Score and prioritize leads based on company data and engagement signals.",
        method: "POST",
        path: "/api/v1/sales/lead-scorer",
        category: "sales",
        price: "0.001 SOL",
        status: "live",
        isNew: true,
        params: [
            { name: "companyName", type: "string", required: true, description: "Lead company name" },
            { name: "industry", type: "string", required: true, description: "Industry sector" },
            { name: "companySize", type: "string", required: true, description: "Number of employees range" },
            { name: "engagement", type: "object", required: false, description: "Engagement metrics object" },
            { name: "signature", type: "string", required: true, description: "X402 payment signature" },
        ]
    },
    {
        id: "pitch-deck",
        name: "pitch_deck",
        title: "Pitch Deck Generator",
        description: "Generate structured content for investor or sales pitch decks.",
        method: "POST",
        path: "/api/v1/sales/pitch-deck",
        category: "sales",
        price: "0.001 SOL",
        status: "live",
        isNew: true,
        params: [
            { name: "companyName", type: "string", required: true, description: "Company name" },
            { name: "productService", type: "string", required: true, description: "Product or service description" },
            { name: "targetAudience", type: "string", required: true, description: "Target audience definition" },
            { name: "problemSolution", type: "string", required: true, description: "Problem and solution statement" },
            { name: "signature", type: "string", required: true, description: "X402 payment signature" },
        ]
    },

    // COMING SOON EXAMPLES (for UI purposes)
    {
        id: "extract-clauses",
        name: "extract_clauses",
        title: "Extract Clauses",
        description: "Extract specific clauses from contracts",
        method: "POST",
        path: "/api/v1/legal/extract",
        category: "legal",
        price: "0.001 SOL",
        status: "coming",
        params: []
    },
    {
        id: "generate-job-post",
        name: "generate_job_post",
        title: "Generate Job Post",
        description: "AI-generated job postings",
        method: "POST",
        path: "/api/v1/hr/job-post",
        category: "hr",
        price: "0.001 SOL",
        status: "coming",
        params: []
    }
];
