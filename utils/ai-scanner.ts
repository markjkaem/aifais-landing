import Anthropic from "@anthropic-ai/sdk";

// Initialiseer Claude
const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY || "" });

/**
 * De Core Logic: Stuurt een bestand naar Claude en geeft schone JSON terug.
 * Nu met ondersteuning voor zowel PDF als Afbeeldingen.
 */
export async function scanInvoiceWithClaude(invoiceBase64: string, mimeType: string) {
  
  // 1. Bepaal het type content blok op basis van de mimeType
  let contentBlock;

  if (mimeType === "application/pdf") {
    // 📄 PDF LOGICA (Document Block)
    contentBlock = {
      type: "document" as const,
      source: {
        type: "base64" as const,
        media_type: "application/pdf" as const,
        data: invoiceBase64,
      },
    };
  } else {
    // 🖼️ AFBEELDING LOGICA (Image Block)
    // Claude accepteert alleen specifieke image types, dus we checken het even
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(mimeType)) {
        throw new Error(`Niet-ondersteund bestandstype: ${mimeType}. Gebruik PDF, JPG of PNG.`);
    }

    contentBlock = {
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data: invoiceBase64,
      },
    };
  }

  // 2. Stuur naar Claude
  const msg = await anthropic.messages.create({
    model: "claude-4-sonnet-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          contentBlock, // Hier gaat het dynamische blok in (PDF of Image)
          {
            type: "text",
            text: "Extract invoice data to pure JSON. Fields: supplier_name, invoice_date (YYYY-MM-DD), invoice_number, total_amount, vat_amount, currency. Do not include markdown formatting or explanations, just the raw JSON object."
          }
        ],
      }
    ],
  });

  // 3. Verwerk het antwoord
  let text = msg.content[0].type === 'text' ? msg.content[0].text : "";
  
  // Zoek naar de JSON (soms kletst Claude eromheen)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) {
    console.error("Claude Response was:", text);
    throw new Error("AI kon geen geldige JSON vinden in het document.");
  }

  return JSON.parse(jsonMatch[0]);
}