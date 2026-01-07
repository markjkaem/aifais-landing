import { NextResponse } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { PDFGenerator } from "@/lib/pdf/generator";
import { rgb } from "pdf-lib";
import { TERMS_GENERATOR_PROMPT, buildTermsGeneratorPrompt } from "@/lib/ai/prompts";
import { withRetryAndTimeout, extractJSON } from "@/lib/ai/retry";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const termsSchema = z.object({
    companyName: z.string().min(1),
    companyType: z.string(),
    industry: z.string().nullable().optional(),
    hasPhysicalProducts: z.boolean(),
    hasDigitalProducts: z.boolean(),
    hasServices: z.boolean(),
    acceptsReturns: z.boolean(),
    returnDays: z.number().nullable().optional(),
    paymentTerms: z.number(),
    jurisdiction: z.string(),
    includeGDPR: z.boolean().optional().default(true),
    signature: z.string().nullable().optional(),
});

interface TermsSection {
    id: string;
    title: string;
    content: string;
    isEditable?: boolean;
    isGDPR?: boolean;
}

interface TermsResponse {
    sections: TermsSection[];
    version: string;
    generatedAt: string;
    jurisdiction: string;
    summary?: string;
    legalNotes?: string[];
}

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || "dummy-key",
});

export const POST = createToolHandler({
    schema: termsSchema,
    pricing: { price: 0.001, currency: "SOL" },
    rateLimit: { maxRequests: 10, windowMs: 60000 },
    handler: async (body, context) => {
        const startTime = Date.now();
        console.log(`Payment authorized via ${context.payment.method}. Starting terms generation...`);

        let termsData: TermsResponse;

        // DEV_BYPASS logic
        if (context.payment.method === 'dev_bypass') {
            termsData = {
                sections: [
                    {
                        id: "definities",
                        title: "Artikel 1 - Definities",
                        content: `In deze algemene voorwaarden wordt verstaan onder:\n\n1.1 Opdrachtnemer: ${body.companyName}, gevestigd en kantoorhoudende te Nederland.\n\n1.2 Opdrachtgever: de natuurlijke persoon of rechtspersoon die met Opdrachtnemer een overeenkomst aangaat of wenst aan te gaan.\n\n1.3 Overeenkomst: de overeenkomst tussen Opdrachtnemer en Opdrachtgever.\n\n1.4 Diensten: alle werkzaamheden die Opdrachtnemer voor Opdrachtgever verricht.\n\n1.5 Schriftelijk: per brief, e-mail of enig ander digitaal communicatiemiddel.`,
                        isEditable: true,
                        isGDPR: false
                    },
                    {
                        id: "toepasselijkheid",
                        title: "Artikel 2 - Toepasselijkheid",
                        content: `2.1 Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes, overeenkomsten en leveringen van diensten of producten door ${body.companyName}.\n\n2.2 Afwijkingen van deze voorwaarden zijn slechts geldig indien deze uitdrukkelijk schriftelijk zijn overeengekomen.\n\n2.3 De toepasselijkheid van eventuele inkoop- of andere voorwaarden van Opdrachtgever wordt uitdrukkelijk van de hand gewezen.\n\n2.4 Indien een of meerdere bepalingen in deze algemene voorwaarden nietig zijn of vernietigd worden, blijven de overige bepalingen volledig van toepassing.`,
                        isEditable: true,
                        isGDPR: false
                    },
                    {
                        id: "aanbod",
                        title: "Artikel 3 - Aanbod en Overeenkomst",
                        content: `3.1 Alle aanbiedingen en offertes van ${body.companyName} zijn vrijblijvend, tenzij uitdrukkelijk anders is vermeld.\n\n3.2 Een overeenkomst komt tot stand op het moment dat Opdrachtgever het aanbod aanvaardt en voldoet aan de daarbij gestelde voorwaarden.\n\n3.3 ${body.companyName} behoudt zich het recht voor om opdrachten zonder opgave van redenen te weigeren.\n\n3.4 Wijzigingen in de overeenkomst zijn slechts geldig indien deze schriftelijk zijn vastgelegd.`,
                        isEditable: true,
                        isGDPR: false
                    },
                    {
                        id: "prijzen",
                        title: "Artikel 4 - Prijzen en Betaling",
                        content: `4.1 Alle prijzen zijn exclusief BTW en andere heffingen van overheidswege, tenzij anders vermeld.\n\n4.2 Betaling dient te geschieden binnen ${body.paymentTerms} dagen na factuurdatum, op een door ${body.companyName} aangewezen rekening.\n\n4.3 Bij niet-tijdige betaling is Opdrachtgever van rechtswege in verzuim en is een rente verschuldigd van 1% per maand over het openstaande bedrag.\n\n4.4 Alle kosten van invordering, zowel gerechtelijk als buitengerechtelijk, komen voor rekening van Opdrachtgever.`,
                        isEditable: true,
                        isGDPR: false
                    },
                    ...(body.hasPhysicalProducts || body.hasDigitalProducts ? [{
                        id: "levering",
                        title: "Artikel 5 - Levering",
                        content: `5.1 Levering geschiedt op de wijze zoals is overeengekomen en op het door Opdrachtgever opgegeven adres.\n\n5.2 Opgegeven levertijden zijn indicatief en gelden nimmer als fatale termijn.\n\n5.3 Het risico van beschadiging en/of vermissing van producten berust bij ${body.companyName} tot het moment van bezorging aan Opdrachtgever.\n\n5.4 ${body.companyName} is gerechtigd om in gedeelten te leveren.`,
                        isEditable: true,
                        isGDPR: false
                    }] : []),
                    ...(body.acceptsReturns ? [{
                        id: "herroeping",
                        title: "Artikel 6 - Herroepingsrecht",
                        content: `6.1 Opdrachtgever heeft het recht om binnen ${body.returnDays || 14} dagen na ontvangst van het product de overeenkomst te ontbinden zonder opgave van redenen (herroepingsrecht).\n\n6.2 De herroepingstermijn verstrijkt ${body.returnDays || 14} dagen na de dag waarop Opdrachtgever of een door hem aangewezen derde het product fysiek in bezit krijgt.\n\n6.3 Om het herroepingsrecht uit te oefenen, moet Opdrachtgever ${body.companyName} informeren via een ondubbelzinnige verklaring.\n\n6.4 De kosten voor het terugzenden van producten zijn voor rekening van Opdrachtgever.`,
                        isEditable: true,
                        isGDPR: false
                    }] : []),
                    {
                        id: "aansprakelijkheid",
                        title: "Artikel 7 - Garantie en Aansprakelijkheid",
                        content: `7.1 ${body.companyName} garandeert dat de geleverde diensten en producten voldoen aan de in de overeenkomst vastgelegde specificaties.\n\n7.2 De totale aansprakelijkheid van ${body.companyName} is beperkt tot het bedrag dat in het desbetreffende geval door de aansprakelijkheidsverzekering wordt uitbetaald, dan wel tot maximaal het factuurbedrag.\n\n7.3 ${body.companyName} is niet aansprakelijk voor indirecte schade, waaronder gevolgschade, gederfde winst en gemiste besparingen.\n\n7.4 Opdrachtgever vrijwaart ${body.companyName} voor alle aanspraken van derden.`,
                        isEditable: true,
                        isGDPR: false
                    },
                    {
                        id: "klachten",
                        title: "Artikel 8 - Klachten",
                        content: `8.1 Klachten over de uitvoering van de overeenkomst moeten binnen 14 dagen volledig en duidelijk omschreven worden ingediend bij ${body.companyName}.\n\n8.2 Bij ${body.companyName} ingediende klachten worden binnen een termijn van 14 dagen gerekend vanaf de datum van ontvangst beantwoord.\n\n8.3 Indien een klacht gegrond is, zal ${body.companyName} de werkzaamheden alsnog verrichten zoals overeengekomen.`,
                        isEditable: true,
                        isGDPR: false
                    },
                    {
                        id: "geschillen",
                        title: "Artikel 9 - Geschillen",
                        content: `9.1 Op alle overeenkomsten tussen ${body.companyName} en Opdrachtgever is uitsluitend ${body.jurisdiction}s recht van toepassing.\n\n9.2 Alle geschillen die ontstaan naar aanleiding van de overeenkomst zullen worden voorgelegd aan de bevoegde rechter in het arrondissement waar ${body.companyName} is gevestigd.\n\n9.3 Partijen zullen pas een beroep op de rechter doen nadat zij zich tot het uiterste hebben ingespannen een geschil in onderling overleg te beslechten.`,
                        isEditable: true,
                        isGDPR: false
                    },
                    {
                        id: "privacy",
                        title: "Artikel 10 - Privacy en Gegevensbescherming (AVG)",
                        content: `10.1 ${body.companyName} verwerkt persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).\n\n10.2 Persoonsgegevens worden uitsluitend verwerkt voor het doel waarvoor ze zijn verstrekt en worden niet langer bewaard dan noodzakelijk.\n\n10.3 Opdrachtgever heeft recht op inzage, correctie en verwijdering van zijn persoonsgegevens.\n\n10.4 ${body.companyName} treft passende technische en organisatorische maatregelen om persoonsgegevens te beveiligen tegen verlies of onrechtmatige verwerking.\n\n10.5 Bij een datalek zal ${body.companyName} de betrokkenen en de Autoriteit Persoonsgegevens informeren conform de wettelijke vereisten.`,
                        isEditable: true,
                        isGDPR: true
                    },
                    {
                        id: "slotbepalingen",
                        title: "Artikel 11 - Slotbepalingen",
                        content: `11.1 Deze algemene voorwaarden treden in werking op ${new Date().toLocaleDateString("nl-NL")}.\n\n11.2 ${body.companyName} is gerechtigd deze algemene voorwaarden te wijzigen. Wijzigingen treden in werking 30 dagen na bekendmaking.\n\n11.3 De Nederlandse tekst van deze algemene voorwaarden prevaleert boven vertalingen daarvan.`,
                        isEditable: true,
                        isGDPR: false
                    }
                ],
                version: "1.0",
                generatedAt: new Date().toISOString(),
                jurisdiction: body.jurisdiction,
                summary: `Deze algemene voorwaarden zijn opgesteld voor ${body.companyName}, een ${body.companyType} actief in ${body.industry || "diverse sectoren"}. De voorwaarden omvatten bepalingen voor ${body.hasServices ? "dienstverlening" : ""}${body.hasPhysicalProducts ? ", fysieke producten" : ""}${body.hasDigitalProducts ? ", digitale producten" : ""} met een betalingstermijn van ${body.paymentTerms} dagen.`,
                legalNotes: [
                    "Deze voorwaarden zijn automatisch gegenereerd en dienen als basis. Raadpleeg een juridisch adviseur voor uw specifieke situatie.",
                    "Conform Nederlandse wetgeving en AVG-regelgeving.",
                    "Aanpassingen kunnen nodig zijn afhankelijk van uw specifieke bedrijfsvoering."
                ]
            };
        } else {
            // Call AI with retry logic
            const response = await withRetryAndTimeout(
                async () => {
                    const message = await anthropic.messages.create({
                        model: "claude-4-sonnet-20250514",
                        max_tokens: 4000,
                        messages: [
                            {
                                role: "user",
                                content: buildTermsGeneratorPrompt({
                                    ...body,
                                    includeGDPR: body.includeGDPR ?? true
                                }),
                            },
                        ],
                    });

                    const responseText = message.content[0].type === "text" ? message.content[0].text : "";
                    return responseText;
                },
                {
                    maxRetries: 2,
                    timeoutMs: 90000,
                    onRetry: (error, attempt) => {
                        console.log(`Terms Generator retry ${attempt}:`, error.message);
                    }
                }
            );

            try {
                termsData = extractJSON<TermsResponse>(response);
            } catch (e) {
                console.error("Terms Generator Parsing Error:", e, response);
                throw new Error("Kon de voorwaarden niet verwerken. Probeer het opnieuw.");
            }
        }

        // Generate PDF
        const pdfBuffer = await generateTermsPDF(termsData, body.companyName);

        return {
            ...termsData,
            pdfBase64: pdfBuffer.toString("base64"),
            processingTime: Date.now() - startTime,
            promptVersion: TERMS_GENERATOR_PROMPT.version
        };
    }
});

async function generateTermsPDF(data: TermsResponse, companyName: string): Promise<Buffer> {
    const gen = await PDFGenerator.create();
    const { width } = gen.page.getSize();

    // AIFAIS Logo
    try {
        const path = await import("path");
        const fs = await import("fs");
        const logoPath = path.join(process.cwd(), "public", "og-image.jpg");
        if (fs.existsSync(logoPath)) {
            const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
            await gen.drawLogo(logoBase64, 120);
        }
    } catch (e) {
        console.error("Failed to load logo in API", e);
    }

    // Header
    gen.drawText("ALGEMENE VOORWAARDEN", { size: 20, bold: true, align: 'center' });
    gen.y -= 10;
    gen.drawText(companyName, { size: 14, bold: true, align: 'center', color: gen.config.primaryColor });
    gen.y -= 10;
    gen.drawText(`Versie: ${data.version} | ${new Date(data.generatedAt).toLocaleDateString("nl-NL")}`, {
        size: 10,
        align: 'center',
        color: gen.config.mutedColor
    });
    gen.y -= 30;

    // Summary if present
    if (data.summary) {
        gen.drawSectionHeader("Samenvatting");
        gen.drawText(data.summary, { size: 9 });
        gen.y -= 10;
    }

    // Sections/Articles
    for (const section of data.sections) {
        gen.drawSectionHeader(section.title);
        gen.drawText(section.content, { size: 10 });
        gen.y -= 5;
    }

    // Legal notes
    if (data.legalNotes && data.legalNotes.length > 0) {
        gen.drawSectionHeader("Juridische Opmerkingen");
        data.legalNotes.forEach(note => {
            gen.drawText(`• ${note}`, { size: 8, color: gen.config.mutedColor });
        });
    }

    // Footer
    gen.y -= 20;
    gen.drawText(`Gegenereerd door AIFAIS | ${data.jurisdiction}`, {
        size: 8,
        align: 'center',
        color: gen.config.mutedColor
    });

    const pdfBytes = await gen.save();
    return Buffer.from(pdfBytes);
}
