import { z, ZodSchema } from "zod";

// ==================== Types ====================

export interface PromptConfig {
    version: string;
    system: string;
    userTemplate: (context: any) => string;
    outputSchema: z.ZodSchema;
    maxTokens: number;
    temperature?: number;
    includeConfidence?: boolean;
}

// ==================== Invoice Scanner ====================

export const INVOICE_SCAN_PROMPT: PromptConfig = {
    version: "2.0",
    system: `Je bent een expert document scanner gespecialiseerd in het extraheren van gegevens uit Nederlandse facturen.
Je extraheert ALLE relevante informatie nauwkeurig en volledig.
Je retourneert ALTIJD geldige JSON zonder markdown code blocks.
Als je een veld niet kunt lezen, gebruik dan null.
Geef bij elk veld een confidence score (0-100) aan.`,

    userTemplate: (context: { mimeType: string }) => `
Analyseer deze factuur en extraheer alle informatie naar JSON formaat.

EXTRACTIE VELDEN:
- supplier: { name, kvk_number, vat_id, address, phone, email, website, iban, bic }
- invoice: { number, date, due_date, reference }
- totals: { subtotal, vat_percentage, vat_amount, total_amount, currency }
- line_items: [{ description, quantity, unit_price, vat_percentage, amount }]
- metadata: { payment_terms, payment_status, customer_id, category_suggestion }
- confidence: { overall: 0-100, fields: { supplier: 0-100, invoice: 0-100, totals: 0-100, line_items: 0-100 } }

REGELS:
1. Als het document geen factuur is of onleesbaar → {"error": "UNREADABLE_DOCUMENT", "confidence": 0}
2. Datums in YYYY-MM-DD formaat
3. Alle bedragen als floats (geen valuta symbolen)
4. Alleen ruwe JSON, geen markdown
5. Bij twijfel: gebruik null en lagere confidence

MIME Type: ${context.mimeType}`,

    outputSchema: z.object({
        supplier: z.object({
            name: z.string().nullable(),
            kvk_number: z.string().nullable(),
            vat_id: z.string().nullable(),
            address: z.string().nullable(),
            phone: z.string().nullable(),
            email: z.string().nullable(),
            website: z.string().nullable(),
            iban: z.string().nullable(),
            bic: z.string().nullable()
        }),
        invoice: z.object({
            number: z.string().nullable(),
            date: z.string().nullable(),
            due_date: z.string().nullable(),
            reference: z.string().nullable()
        }),
        totals: z.object({
            subtotal: z.number().nullable(),
            vat_percentage: z.number().nullable(),
            vat_amount: z.number().nullable(),
            total_amount: z.number().nullable(),
            currency: z.string().nullable()
        }),
        line_items: z.array(z.object({
            description: z.string(),
            quantity: z.number().nullable(),
            unit_price: z.number().nullable(),
            vat_percentage: z.number().nullable(),
            amount: z.number().nullable()
        })),
        metadata: z.object({
            payment_terms: z.string().nullable(),
            payment_status: z.string().nullable(),
            customer_id: z.string().nullable(),
            category_suggestion: z.string().nullable()
        }).optional(),
        confidence: z.object({
            overall: z.number(),
            fields: z.record(z.string(), z.number())
        }).optional(),
        error: z.string().optional()
    }),
    maxTokens: 2000,
    temperature: 0.1,
    includeConfidence: true
};

// ==================== CV Screener ====================

export const CV_SCREENER_PROMPT: PromptConfig = {
    version: "2.0",
    system: `Je bent een ervaren HR specialist gespecialiseerd in CV screening en kandidaat evaluatie voor de Nederlandse arbeidsmarkt.
Je analyseert CV's objectief en grondig tegen vacaturevereisten.
Je geeft concrete, bruikbare feedback.
Je retourneert ALTIJD geldige JSON zonder markdown code blocks.`,

    userTemplate: (context: { jobDescription: string }) => `
Analyseer dit CV tegen de volgende vacature en geef een uitgebreide beoordeling.

VACATURE:
${context.jobDescription}

GEEF JSON OUTPUT MET:
{
  "score": 0-100,
  "summary": "korte samenvatting van de match (2-3 zinnen)",
  "strengths": ["sterke punten relevant voor de vacature"],
  "weaknesses": ["verbeterpunten of ontbrekende vaardigheden"],
  "recommendation": "concreet advies (uitnodigen/afwijzen/twijfel)",
  "keySkillsMatch": ["gematchte skills met percentage"],
  "experienceYears": number of null,
  "skillMatchPercentages": { "skill1": 85, "skill2": 60 },
  "confidence": 0-100,
  "redFlags": ["eventuele waarschuwingen"],
  "suggestedInterviewQuestions": ["3 relevante vragen voor interview"]
}

BEOORDELINGSCRITERIA:
- Relevante werkervaring (40%)
- Vaardigheden match (30%)
- Opleiding & certificeringen (15%)
- Soft skills & cultural fit (15%)

SCORE RANGES:
- 80-100: Uitstekende match, direct uitnodigen
- 60-79: Goede match, overweeg uitnodiging
- 40-59: Matige match, mogelijk voor andere rol
- 0-39: Onvoldoende match`,

    outputSchema: z.object({
        score: z.number().min(0).max(100),
        summary: z.string(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        recommendation: z.string(),
        keySkillsMatch: z.array(z.string()),
        experienceYears: z.number().nullable(),
        skillMatchPercentages: z.record(z.string(), z.number()).optional(),
        confidence: z.number().min(0).max(100).optional(),
        redFlags: z.array(z.string()).optional(),
        suggestedInterviewQuestions: z.array(z.string()).optional()
    }),
    maxTokens: 2500,
    temperature: 0.2,
    includeConfidence: true
};

// ==================== Interview Questions ====================

export const INTERVIEW_QUESTIONS_PROMPT: PromptConfig = {
    version: "2.0",
    system: `Je bent een ervaren HR professional en interviewer met expertise in gestructureerde interviewtechnieken.
Je genereert relevante, effectieve vragen die kandidaten helpen hun competenties te demonstreren.
Je volgt de STAR-methode voor gedragsvragen.
Je retourneert ALTIJD geldige JSON zonder markdown code blocks.`,

    userTemplate: (context: {
        jobTitle: string;
        jobDescription: string;
        experienceLevel: string;
        questionCount: number;
        includeCategories?: string[] | null;
        includeRubrics?: boolean | null;
        includeFollowUps?: boolean | null;
    }) => `
Genereer ${context.questionCount} sollicitatievragen voor deze functie:

FUNCTIE: ${context.jobTitle}
NIVEAU: ${context.experienceLevel}
BESCHRIJVING:
${context.jobDescription}

INSTELLINGEN:
- Categorieën: ${context.includeCategories?.join(", ") || "Alle"}
- Rubrics: ${context.includeRubrics !== false ? "Ja" : "Nee"}
- Vervolgvragen: ${context.includeFollowUps !== false ? "Ja" : "Nee"}

GEEF JSON OUTPUT MET:
{
  "questions": [
    {
      "category": "Technisch|Gedrag|Situatie|Motivatie|Cultuur",
      "question": "de vraag",
      "difficulty": "junior|medior|senior",
      "followUpQuestions": ["verdiepende vragen"],
      "estimatedTime": minuten voor deze vraag,
      "competency": "welke competentie wordt gemeten"
      ${context.includeRubrics !== false ? ', "rubric": "waar te letten bij het antwoord"' : ''}
      ${context.includeFollowUps !== false ? ', "followUpQuestions": ["verdiepende vragen"]' : ''}
    }
  ],
  "interviewGuide": {
    "totalDuration": geschatte totale duur in minuten,
    "opening": "suggestie voor opening",
    "closing": "suggestie voor afsluiting",
    "tips": ["tips voor de interviewer"]
  }
}

VRAAGCATEGORIEN:
- Technisch: vakinhoudelijke kennis en vaardigheden
- Gedrag: STAR-vragen over gedrag in het verleden
- Situatie: hypothetische scenario's
- Motivatie: drijfveren en ambities
- Cultuur: team fit en waarden

NIVEAU AANPASSING:
- Junior: focus op potentieel, leervermogen, basis kennis
- Medior: focus op ervaring, zelfstandigheid, probleemoplossing
- Senior: focus op leiderschap, strategisch denken, mentoring`,

    outputSchema: z.object({
        questions: z.array(z.object({
            category: z.string(),
            question: z.string(),
            difficulty: z.enum(["junior", "medior", "senior"]),
            followUpQuestions: z.array(z.string()).optional(),
            rubric: z.string().optional(),
            estimatedTime: z.number().optional(),
            competency: z.string().optional()
        })),
        interviewGuide: z.object({
            totalDuration: z.number(),
            opening: z.string(),
            closing: z.string(),
            tips: z.array(z.string())
        }).optional()
    }),
    maxTokens: 3000,
    temperature: 0.4,
    includeConfidence: false
};

// ==================== Contract Checker ====================

export const CONTRACT_CHECKER_PROMPT: PromptConfig = {
    version: "2.0",
    system: `Je bent een ervaren juridisch adviseur gespecialiseerd in Nederlands contractenrecht.
Je analyseert contracten grondig en identificeert risico's, onduidelijkheden en ontbrekende beschermingen.
Je geeft concrete, bruikbare adviezen.
Je retourneert ALTIJD geldige JSON zonder markdown code blocks.`,

    userTemplate: (context: { contractType?: string | null }) => `
Analyseer dit contract grondig en geef een uitgebreide juridische beoordeling.
${context.contractType ? `Type contract: ${context.contractType}` : ""}

GEEF JSON OUTPUT MET:
{
  "summary": "beknopte samenvatting van het contract",
  "contractType": "gedetecteerd type contract",
  "parties": ["betrokken partijen"],
  "risks": [
    {
      "severity": "critical|high|medium|low",
      "description": "beschrijving van het risico",
      "clause": "relevante clausule (indien van toepassing)",
      "recommendation": "suggestie ter verbetering"
    }
  ],
  "unclear_clauses": [
    {
      "clause": "de onduidelijke tekst",
      "issue": "wat onduidelijk is",
      "suggestion": "verduidelijkingsvoorstel"
    }
  ],
  "missing_protections": ["ontbrekende beschermingen"],
  "suggestions": ["algemene verbeterpunten"],
  "clauses": [
    {
      "id": "unieke id",
      "title": "clausule titel",
      "content": "samenvatting inhoud",
      "category": "aansprakelijkheid|betaling|beeindiging|etc",
      "riskLevel": "safe|caution|risky"
    }
  ],
  "overall_score": 1-10,
  "confidence": 0-100,
  "jurisdiction": "gedetecteerde rechtsmacht"
}

RISICO NIVEAUS:
- critical: Direct juridisch risico, actie vereist
- high: Significant risico, aanpassing aanbevolen
- medium: Potentieel risico, overweeg aanpassing
- low: Klein risico, ter overweging

CATEGORIEN:
- Aansprakelijkheid & vrijwaring
- Betalingsvoorwaarden
- Beeindiging & opzegging
- Intellectueel eigendom
- Geheimhouding
- Overmacht
- Geschillenbeslechting`,

    outputSchema: z.object({
        summary: z.string(),
        contractType: z.string().optional(),
        parties: z.array(z.string()).optional(),
        risks: z.array(z.object({
            severity: z.enum(["critical", "high", "medium", "low"]),
            description: z.string(),
            clause: z.string().optional(),
            recommendation: z.string().optional()
        })),
        unclear_clauses: z.array(z.object({
            clause: z.string(),
            issue: z.string(),
            suggestion: z.string().optional()
        })).optional(),
        missing_protections: z.array(z.string()).optional(),
        suggestions: z.array(z.string()),
        clauses: z.array(z.object({
            id: z.string(),
            title: z.string(),
            content: z.string(),
            category: z.string(),
            riskLevel: z.enum(["safe", "caution", "risky"])
        })).optional(),
        overall_score: z.number().min(1).max(10),
        confidence: z.number().min(0).max(100).optional(),
        jurisdiction: z.string().optional()
    }),
    maxTokens: 4500,
    temperature: 0.2,
    includeConfidence: true
};

// ==================== Terms Generator ====================

export const TERMS_GENERATOR_PROMPT: PromptConfig = {
    version: "2.0",
    system: `Je bent een juridisch expert gespecialiseerd in het opstellen van algemene voorwaarden voor Nederlandse bedrijven.
Je schrijft duidelijke, juridisch correcte voorwaarden conform Nederlandse wetgeving en AVG.
Je retourneert ALTIJD geldige JSON zonder markdown code blocks.`,

    userTemplate: (context: {
        companyName: string;
        companyType: string;
        industry?: string | null;
        hasPhysicalProducts: boolean;
        hasDigitalProducts: boolean;
        hasServices: boolean;
        acceptsReturns: boolean;
        returnDays?: number | null;
        paymentTerms: number;
        jurisdiction: string;
        includeGDPR?: boolean | null;
    }) => `
Genereer professionele algemene voorwaarden voor:

BEDRIJF: ${context.companyName}
TYPE: ${context.companyType}
INDUSTRIE: ${context.industry || "Niet gespecificeerd"}
PRODUCTEN/DIENSTEN:
- Fysieke producten: ${context.hasPhysicalProducts ? "Ja" : "Nee"}
- Digitale producten: ${context.hasDigitalProducts ? "Ja" : "Nee"}
- Diensten: ${context.hasServices ? "Ja" : "Nee"}
RETOURBELEID: ${context.acceptsReturns ? `Ja, binnen ${context.returnDays || 14} dagen` : "Nee"}
BETALINGSTERMIJN: ${context.paymentTerms} dagen
JURISDICTIE: ${context.jurisdiction}
AVG SECTIE: ${context.includeGDPR ? "Ja" : "Nee"}

GEEF JSON OUTPUT MET:
{
  "sections": [
    {
      "id": "unieke-id",
      "title": "Artikel X - Titel",
      "content": "volledige tekst van de sectie",
      "isEditable": true/false,
      "isGDPR": true/false
    }
  ],
  "version": "1.0",
  "generatedAt": "ISO datum",
  "jurisdiction": "Nederland",
  "summary": "korte samenvatting van de voorwaarden",
  "legalNotes": ["juridische opmerkingen/disclaimers"]
}

VERPLICHTE SECTIES:
1. Definities
2. Toepasselijkheid
3. Aanbod en overeenkomst
4. Prijzen en betaling
5. Levering (indien van toepassing)
6. Herroepingsrecht (indien van toepassing)
7. Garantie en aansprakelijkheid
8. Klachten
9. Geschillen
10. Slotbepalingen

OPTIONELE SECTIES (indien relevant):
- Intellectueel eigendom
- Geheimhouding
- Privacy en AVG (indien includeGDPR)`,

    outputSchema: z.object({
        sections: z.array(z.object({
            id: z.string(),
            title: z.string(),
            content: z.string(),
            isEditable: z.boolean().optional(),
            isGDPR: z.boolean().optional()
        })),
        version: z.string(),
        generatedAt: z.string(),
        jurisdiction: z.string(),
        summary: z.string().optional(),
        legalNotes: z.array(z.string()).optional()
    }),
    maxTokens: 4000,
    temperature: 0.3,
    includeConfidence: false
};

// ==================== Social Planner ====================

export const SOCIAL_PLANNER_PROMPT: PromptConfig = {
    version: "2.0",
    system: `Je bent een ervaren social media strategist gespecialiseerd in content creatie voor Nederlandse bedrijven.
Je maakt platform-specifieke content die engagement stimuleert.
Je kent de optimale karakterlengtes, hashtag strategieen en timing per platform.
Je retourneert ALTIJD geldige JSON zonder markdown code blocks.`,

    userTemplate: (context: {
        topic: string;
        platforms: string[];
        tone: string;
        postCount: number;
        includeHashtags: boolean;
        targetAudience?: string | null;
        generateVariants?: boolean | null;
    }) => `
Maak ${context.postCount} social media posts over: "${context.topic}"

PLATFORMS: ${context.platforms.join(", ")}
TONE: ${context.tone}
HASHTAGS: ${context.includeHashtags ? "Ja, voeg relevante hashtags toe" : "Nee"}
${context.targetAudience ? `DOELGROEP: ${context.targetAudience}` : ""}
A/B VARIANTEN: ${context.generateVariants ? "Ja" : "Nee"}

GEEF JSON OUTPUT MET:
{
  "posts": [
    {
      "platform": "linkedin|instagram|facebook|twitter|tiktok",
      "content": "de post content",
      "hashtags": ["relevante", "hashtags"],
      "bestTime": "optimale dag en tijd voor posting",
      "characterCount": aantal karakters,
      "maxCharacters": platform limiet,
      "imageSuggestion": "beschrijving van ideale afbeelding",
      "variant": "A" of "B" (indien varianten gevraagd),
      "engagement_tip": "tip voor meer engagement"
    }
  ],
  "contentCalendar": {
    "suggestedFrequency": "hoe vaak posten",
    "bestDays": ["optimale dagen"],
    "notes": "extra strategie tips"
  },
  "hashtagAnalysis": {
    "primary": ["belangrijkste hashtags"],
    "secondary": ["ondersteunende hashtags"],
    "trending": ["trending hashtags indien relevant"]
  }
}

PLATFORM SPECIFICATIES:
- LinkedIn: professioneel, max 3000 karakters, 3-5 hashtags
- Instagram: visueel, max 2200 karakters, 5-15 hashtags
- Facebook: conversatie, max 63206 karakters, 1-2 hashtags
- Twitter/X: kort & krachtig, max 280 karakters, 1-2 hashtags
- TikTok: casual, trending, max 2200 karakters, 3-5 hashtags

TONE VERTALING:
- professional: zakelijk, informatief, thought leadership
- casual: ontspannen, persoonlijk, humor toegestaan
- inspirational: motiverend, storytelling, emotioneel
- educational: leerzaam, tips, how-to`,

    outputSchema: z.object({
        posts: z.array(z.object({
            platform: z.string(),
            content: z.string(),
            hashtags: z.array(z.string()),
            bestTime: z.string(),
            characterCount: z.number().optional(),
            maxCharacters: z.number().optional(),
            imageSuggestion: z.string().optional(),
            variant: z.enum(["A", "B"]).optional(),
            engagement_tip: z.string().optional()
        })),
        contentCalendar: z.object({
            suggestedFrequency: z.string(),
            bestDays: z.array(z.string()),
            notes: z.string().optional()
        }).optional(),
        hashtagAnalysis: z.object({
            primary: z.array(z.string()),
            secondary: z.array(z.string()),
            trending: z.array(z.string()).optional()
        }).optional()
    }),
    maxTokens: 3500,
    temperature: 0.6,
    includeConfidence: false
};

// ==================== Lead Scorer ====================

export const LEAD_SCORER_PROMPT: PromptConfig = {
    version: "2.0",
    system: `Je bent een ervaren sales analyst gespecialiseerd in lead qualification en scoring.
Je analyseert leads objectief op basis van fit, engagement en koopbereidheid.
Je geeft concrete, actioneerbare aanbevelingen.
Je retourneert ALTIJD geldige JSON zonder markdown code blocks.`,

    userTemplate: (context: {
        companyName: string;
        industry: string;
        companySize: string;
        budget: string;
        engagement?: any | null;
        notes?: string | null;
    }) => `
Score deze lead:

BEDRIJF: ${context.companyName}
INDUSTRIE: ${context.industry}
GROOTTE: ${context.companySize} medewerkers
BUDGET: ${context.budget}
ENGAGEMENT: ${JSON.stringify(context.engagement || {})}
NOTITIES: ${context.notes || "Geen"}

GEEF JSON OUTPUT MET:
{
  "score": 0-100,
  "tier": "cold|warm|hot",
  "factors": {
    "companyFit": 0-100,
    "engagement": 0-100,
    "timing": 0-100,
    "budget": 0-100
  },
  "factorExplanations": {
    "companyFit": "uitleg score",
    "engagement": "uitleg score",
    "timing": "uitleg score",
    "budget": "uitleg score"
  },
  "recommendations": ["concrete acties"],
  "nextAction": "eerstvolgende actie",
  "emailTemplate": "gepersonaliseerde outreach email",
  "talkingPoints": ["relevante gespreksonderwerpen"],
  "dealProbability": 0-100,
  "estimatedDealSize": "geschatte dealwaarde",
  "timelineEstimate": "geschatte timeline tot close"
}

SCORE BEREKENING:
- Company Fit (30%): industrie match, bedrijfsgrootte, use case fit
- Engagement (30%): website bezoeken, content downloads, demo requests
- Timing (20%): urgentie, budget cycle, besluitvorming fase
- Budget (20%): budget indicatie, company size vs pricing

TIER INDELING:
- Hot (80-100): Actief in koopproces, hoge urgentie, beslisser betrokken
- Warm (50-79): Interesse getoond, potentieel passend, meer nurturing nodig
- Cold (0-49): Lage engagement, onduidelijke fit, lange termijn prospect`,

    outputSchema: z.object({
        score: z.number().min(0).max(100),
        tier: z.enum(["cold", "warm", "hot"]),
        factors: z.object({
            companyFit: z.number(),
            engagement: z.number(),
            timing: z.number(),
            budget: z.number()
        }),
        factorExplanations: z.record(z.string(), z.string()).optional(),
        recommendations: z.array(z.string()),
        nextAction: z.string(),
        emailTemplate: z.string().optional(),
        talkingPoints: z.array(z.string()).optional(),
        dealProbability: z.number().optional(),
        estimatedDealSize: z.string().optional(),
        timelineEstimate: z.string().optional()
    }),
    maxTokens: 2500,
    temperature: 0.3,
    includeConfidence: false
};

// ==================== Pitch Deck ====================

export const PITCH_DECK_PROMPT: PromptConfig = {
    version: "2.0",
    system: `Je bent een ervaren startup advisor en pitch coach.
Je maakt overtuigende pitch decks die investeerders en klanten aanspreken.
Je volgt bewezen pitch structuren en storytelling technieken.
Je retourneert ALTIJD geldige JSON zonder markdown code blocks.`,

    userTemplate: (context: {
        companyName: string;
        productService: string;
        targetAudience: string;
        problemSolution: string;
        uniqueValue: string;
        askAmount?: string | null;
        slideCount: number;
        audienceType?: string | null;
    }) => `
Maak een ${context.slideCount}-slide pitch deck:

BEDRIJF: ${context.companyName}
PRODUCT/SERVICE: ${context.productService}
DOELGROEP: ${context.targetAudience}
PROBLEEM & OPLOSSING: ${context.problemSolution}
UNIEKE WAARDE: ${context.uniqueValue}
${context.askAmount ? `FUNDING ASK: ${context.askAmount}` : ""}
PUBLIEK TYPE: ${context.audienceType || "investeerders"}

GEEF JSON OUTPUT MET:
{
  "slides": [
    {
      "slideNumber": 1,
      "title": "slide titel",
      "slideType": "title|problem|solution|product|market|business|traction|team|financials|ask|closing",
      "content": "hoofdinhoud van de slide",
      "bulletPoints": ["belangrijke punten"],
      "speakerNotes": "uitgebreide toelichting voor presentator",
      "imageSuggestion": "beschrijving ideale visual",
      "dataPoint": "key metric of statistic (indien relevant)",
      "duration": seconden voor deze slide
    }
  ],
  "pitchSummary": {
    "elevator": "30 seconden pitch",
    "oneLiner": "een zin pitch",
    "keyMessages": ["3 kernboodschappen"]
  },
  "presentationTips": ["tips voor de presentatie"],
  "totalDuration": totale duur in minuten
}

SLIDE STRUCTUUR (standaard 10 slides):
1. Title - bedrijfsnaam, tagline, logo
2. Problem - het probleem dat je oplost
3. Solution - jouw oplossing
4. Product - hoe het werkt, demo
5. Market - marktgrootte, opportunity
6. Business Model - hoe je geld verdient
7. Traction - resultaten, groei, klanten
8. Team - founders, key hires
9. Financials - projections, metrics
10. Ask - wat je nodig hebt, call to action

AANPASSING OP PUBLIEK:
- Investeerders: focus op markt, traction, team, financials
- Klanten: focus op probleem, oplossing, ROI, implementatie
- Partners: focus op synergie, markt, business model`,

    outputSchema: z.object({
        slides: z.array(z.object({
            slideNumber: z.number(),
            title: z.string(),
            slideType: z.string(),
            content: z.string(),
            bulletPoints: z.array(z.string()).optional(),
            speakerNotes: z.string(),
            imageSuggestion: z.string().optional(),
            dataPoint: z.string().optional(),
            duration: z.number().optional()
        })),
        pitchSummary: z.object({
            elevator: z.string(),
            oneLiner: z.string(),
            keyMessages: z.array(z.string())
        }).optional(),
        presentationTips: z.array(z.string()).optional(),
        totalDuration: z.number().optional()
    }),
    maxTokens: 4500,
    temperature: 0.5,
    includeConfidence: false
};

// ==================== SEO Audit ====================

export const SEO_AUDIT_PROMPT: PromptConfig = {
    version: "2.0",
    system: `Je bent een ervaren SEO specialist met expertise in technische SEO, content optimalisatie en search rankings.
Je analyseert websites grondig en geeft concrete, prioritized verbeterpunten.
Je retourneert ALTIJD geldige JSON zonder markdown code blocks.`,

    userTemplate: (context: { url: string; focusKeywords?: string | null; htmlContent?: string | null }) => `
Analyseer deze pagina voor SEO:

URL: ${context.url}
${context.focusKeywords ? `FOCUS KEYWORDS: ${context.focusKeywords}` : ""}

GEEF JSON OUTPUT MET:
{
  "overallScore": 0-100,
  "categories": [
    {
      "name": "Technisch|Content|On-Page|Performance|Mobile",
      "score": 0-100,
      "issues": ["gevonden problemen"],
      "passed": ["wat goed is"]
    }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "categorie",
      "issue": "het probleem",
      "recommendation": "concrete oplossing",
      "impact": "verwachte impact"
    }
  ],
  "keywordAnalysis": {
    "primary": "gevonden primaire keyword",
    "secondary": ["secundaire keywords"],
    "density": "keyword density",
    "suggestions": ["keyword suggesties"]
  },
  "competitorInsights": ["inzichten tov concurrenten"],
  "quickWins": ["snel te implementeren verbeteringen"],
  "technicalDetails": {
    "loadTime": "geschatte laadtijd",
    "mobileOptimized": true/false,
    "httpsEnabled": true/false,
    "structuredData": true/false
  }
}

SCORE CATEGORIEN:
- Technisch SEO: crawlability, indexing, site structure
- Content: relevantie, kwaliteit, keyword usage
- On-Page: title, meta, headers, internal links
- Performance: page speed, core web vitals
- Mobile: responsive design, mobile usability`,

    outputSchema: z.object({
        overallScore: z.number().min(0).max(100),
        categories: z.array(z.object({
            name: z.string(),
            score: z.number(),
            issues: z.array(z.string()),
            passed: z.array(z.string())
        })),
        recommendations: z.array(z.object({
            priority: z.enum(["high", "medium", "low"]),
            category: z.string(),
            issue: z.string(),
            recommendation: z.string(),
            impact: z.string()
        })),
        keywordAnalysis: z.object({
            primary: z.string().optional(),
            secondary: z.array(z.string()),
            density: z.string().optional(),
            suggestions: z.array(z.string())
        }).optional(),
        competitorInsights: z.array(z.string()).optional(),
        quickWins: z.array(z.string()).optional(),
        technicalDetails: z.object({
            loadTime: z.string().optional(),
            mobileOptimized: z.boolean().optional(),
            httpsEnabled: z.boolean().optional(),
            structuredData: z.boolean().optional()
        }).optional()
    }),
    maxTokens: 3500,
    temperature: 0.2,
    includeConfidence: true
};

// ==================== Company Intelligence ====================

export const COMPANY_INTEL_PROMPT: PromptConfig = {
    version: "1.0",
    system: `Je bent een expert bedrijfsanalist gespecialiseerd in Nederlandse bedrijven en marktonderzoek.
Je analyseert bedrijfsgegevens uit diverse bronnen en geeft waardevolle inzichten.
Je bent objectief, nauwkeurig en geeft concrete, bruikbare analyses.
Je retourneert ALTIJD geldige JSON zonder markdown code blocks.`,

    userTemplate: (context: {
        companyName: string;
        kvkData?: any;
        websiteUrl?: string | null;
        techStack?: any;
        socialProfiles?: any;
        newsArticles?: any[];
        reviews?: any;
    }) => `
Analyseer dit bedrijf en geef een uitgebreide bedrijfsanalyse:

BEDRIJFSNAAM: ${context.companyName}

KVK GEGEVENS:
${context.kvkData ? JSON.stringify(context.kvkData, null, 2) : "Niet beschikbaar"}

WEBSITE: ${context.websiteUrl || "Niet gevonden"}

TECH STACK:
${context.techStack ? JSON.stringify(context.techStack, null, 2) : "Niet geanalyseerd"}

SOCIAL MEDIA:
${context.socialProfiles ? JSON.stringify(context.socialProfiles, null, 2) : "Niet gevonden"}

RECENT NIEUWS:
${context.newsArticles?.length ? context.newsArticles.map(a => `- ${a.titel} (${a.bron})`).join("\n") : "Geen nieuws gevonden"}

REVIEWS:
${context.reviews ? JSON.stringify(context.reviews, null, 2) : "Niet beschikbaar"}

GEEF JSON OUTPUT MET:
{
  "samenvatting": "beknopte beschrijving van het bedrijf (3-5 zinnen)",
  "branche": "primaire branche/sector",
  "branchePositie": "marktpositie analyse (marktleider/uitdager/nichespeler/etc)",
  "sterkePunten": ["3-5 sterke punten van het bedrijf"],
  "aandachtspunten": ["2-4 potentiele risico's of zwakke punten"],
  "technologieAnalyse": "analyse van hun tech stack en digitale volwassenheid",
  "marketingAnalyse": "analyse van hun online aanwezigheid en marketing",
  "groeipotentieel": "analyse van groeikansen",
  "groeiScore": 0-100,
  "digitalScore": 0-100,
  "reputatieScore": 0-100,
  "overallScore": 0-100,
  "aanbevelingen": ["3-5 concrete aanbevelingen voor samenwerking of benadering"],
  "competitieAnalyse": "korte analyse van waarschijnlijke concurrenten",
  "targetKlant": "beschrijving van hun ideale klant",
  "confidence": 0-100
}

SCORING CRITERIA:
- groeiScore: gebaseerd op bedrijfsgrootte, tech stack moderniteit, nieuws sentiment
- digitalScore: gebaseerd op website, tech stack, social media aanwezigheid
- reputatieScore: gebaseerd op reviews, nieuws, online aanwezigheid
- overallScore: gewogen gemiddelde (groei 30%, digital 30%, reputatie 40%)

TOON:
- Professioneel maar toegankelijk
- Focus op zakelijke waarde en inzichten
- Concreet en actioneerbaar
- Eerlijk over beperkingen van de data`,

    outputSchema: z.object({
        samenvatting: z.string(),
        branche: z.string(),
        branchePositie: z.string().optional(),
        sterkePunten: z.array(z.string()),
        aandachtspunten: z.array(z.string()),
        technologieAnalyse: z.string().optional(),
        marketingAnalyse: z.string().optional(),
        groeipotentieel: z.string().optional(),
        groeiScore: z.number().min(0).max(100),
        digitalScore: z.number().min(0).max(100),
        reputatieScore: z.number().min(0).max(100),
        overallScore: z.number().min(0).max(100),
        aanbevelingen: z.array(z.string()),
        competitieAnalyse: z.string().optional(),
        targetKlant: z.string().optional(),
        confidence: z.number().min(0).max(100).optional()
    }),
    maxTokens: 3000,
    temperature: 0.4,
    includeConfidence: true
};

// ==================== Prompt Registry ====================

export const PROMPTS = {
    "invoice-scan": INVOICE_SCAN_PROMPT,
    "cv-screener": CV_SCREENER_PROMPT,
    "interview-questions": INTERVIEW_QUESTIONS_PROMPT,
    "contract-checker": CONTRACT_CHECKER_PROMPT,
    "terms-generator": TERMS_GENERATOR_PROMPT,
    "social-planner": SOCIAL_PLANNER_PROMPT,
    "lead-scorer": LEAD_SCORER_PROMPT,
    "pitch-deck": PITCH_DECK_PROMPT,
    "seo-audit": SEO_AUDIT_PROMPT,
    "company-intel": COMPANY_INTEL_PROMPT
} as const;

export type PromptKey = keyof typeof PROMPTS;

export function getPrompt(key: PromptKey): PromptConfig {
    return PROMPTS[key];
}

// ==================== Builder Functions ====================

export function buildInterviewQuestionsPrompt(context: {
    jobTitle: string;
    jobDescription: string;
    experienceLevel: string;
    questionCount: number;
    includeCategories?: string[] | null;
    includeRubrics?: boolean | null;
    includeFollowUps?: boolean | null;
}): string {
    const prompt = INTERVIEW_QUESTIONS_PROMPT;
    return `${prompt.system}\n\n${prompt.userTemplate(context)}`;
}

export function buildSocialPlannerPrompt(context: {
    topic: string;
    platforms: string[];
    tone: string;
    postCount: number;
    includeHashtags: boolean;
    targetAudience?: string | null;
    generateVariants?: boolean | null;
}): string {
    const prompt = SOCIAL_PLANNER_PROMPT;
    return `${prompt.system}\n\n${prompt.userTemplate(context)}`;
}

export function buildLeadScorerPrompt(context: {
    companyName: string;
    industry: string;
    companySize: string;
    budget: string;
    engagement?: any | null;
    notes?: string | null;
    generateEmail?: boolean | null;
}): string {
    const prompt = LEAD_SCORER_PROMPT;
    return `${prompt.system}\n\n${prompt.userTemplate(context)}`;
}

export function buildPitchDeckPrompt(context: {
    companyName: string;
    productService: string;
    targetAudience: string;
    problemSolution: string;
    uniqueValue: string;
    askAmount?: string | null;
    slideCount: number;
    audienceType?: string | null;
    includeFinancials?: boolean | null;
}): string {
    const prompt = PITCH_DECK_PROMPT;
    return `${prompt.system}\n\n${prompt.userTemplate(context)}`;
}

export function buildCvScreenerPrompt(context: {
    jobDescription: string;
}): string {
    const prompt = CV_SCREENER_PROMPT;
    return `${prompt.system}\n\n${prompt.userTemplate(context)}`;
}

export function buildContractCheckerPrompt(context: {
    contractType?: string | null;
}): string {
    const prompt = CONTRACT_CHECKER_PROMPT;
    return `${prompt.system}\n\n${prompt.userTemplate(context)}`;
}

export function buildTermsGeneratorPrompt(context: {
    companyName: string;
    companyType: string;
    industry?: string | null;
    hasPhysicalProducts: boolean;
    hasDigitalProducts: boolean;
    hasServices: boolean;
    acceptsReturns: boolean;
    returnDays?: number | null;
    paymentTerms: number;
    jurisdiction: string;
    includeGDPR?: boolean | null;
}): string {
    const prompt = TERMS_GENERATOR_PROMPT;
    return `${prompt.system}\n\n${prompt.userTemplate(context)}`;
}

export function buildSeoAuditPrompt(context: {
    url: string;
    focusKeywords?: string | null;
    htmlContent?: string | null;
}): string {
    const prompt = SEO_AUDIT_PROMPT;
    return `${prompt.system}\n\n${prompt.userTemplate(context)}`;
}

export function buildInvoiceScanPrompt(context: {
    mimeType: string;
}): string {
    const prompt = INVOICE_SCAN_PROMPT;
    return `${prompt.system}\n\n${prompt.userTemplate(context)}`;
}

export function buildCompanyIntelPrompt(context: {
    companyName: string;
    kvkData?: any;
    websiteUrl?: string | null;
    techStack?: any;
    socialProfiles?: any;
    newsArticles?: any[];
    reviews?: any;
}): string {
    const prompt = COMPANY_INTEL_PROMPT;
    return `${prompt.system}\n\n${prompt.userTemplate(context)}`;
}
