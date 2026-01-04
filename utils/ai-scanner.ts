import Anthropic from "@anthropic-ai/sdk";

// Initialiseer Claude
const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY || "" });

/**
 * De Core Logic: Stuurt een bestand naar Claude en geeft schone JSON terug.
 * Nu met robuuste error handling voor lege/witte afbeeldingen.
 */
export async function scanInvoiceWithClaude(invoiceBase64: string, mimeType: string) {

  // 1. Bepaal het type content blok op basis van de mimeType
  let contentBlock;

  // ... (Deze logica was goed, laten we zo) ...
  if (mimeType === "application/pdf") {
    contentBlock = {
      type: "document" as const,
      source: { type: "base64" as const, media_type: "application/pdf" as const, data: invoiceBase64 },
    };
  } else {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(mimeType)) {
      throw new Error(`Niet-ondersteund bestandstype: ${mimeType}. Gebruik PDF, JPG of PNG.`);
    }
    contentBlock = {
      type: "image" as const,
      source: { type: "base64" as const, media_type: mimeType as any, data: invoiceBase64 },
    };
  }

  // 2. Stuur naar Claude
  const prompt = `Extract all relevant information from this invoice into a highly detailed JSON structure. 
  Include the following fields if present:
  - supplier: { name, kvk_number, vat_id, address, phone, email, website, iban, bic }
  - invoice: { number, date, due_date, reference }
  - totals: { subtotal, vat_percentage, vat_amount, total_amount, currency }
  - line_items: [{ description, quantity, unit_price, vat_percentage, amount }]
  - metadata: { payment_terms, payment_status, customer_id, category_suggestion }

  Rules:
  1. If the image is blank, unreadable, or not an invoice, respond with exactly: {"error": "UNREADABLE_DOCUMENT"}.
  2. Use YYYY-MM-DD for dates.
  3. Ensure all numbers are floats.
  4. Do not include markdown formatting or explanations, only raw JSON.`;

  const msg = await anthropic.messages.create({
    model: "claude-4-sonnet-20250514", // AANBEVOLEN voo"
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          contentBlock,
          {
            type: "text",
            text: prompt
          }
        ],
      }
    ],
  });

  // 3. Verwerk het antwoord
  let text = msg.content[0].type === 'text' ? msg.content[0].text : "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("AI kon geen JSON-structuur vinden in de response.");
  }

  try {
    const data = JSON.parse(jsonMatch[0]);

    if (data.error === "UNREADABLE_DOCUMENT") {
      return { error: "UNREADABLE_DOCUMENT", message: "Het document is onleesbaar of geen factuur." };
    }

    return data;

  } catch (e: any) {
    throw new Error("Ongeldig JSON formaat ontvangen van AI.");
  }
}