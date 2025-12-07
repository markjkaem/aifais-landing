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
  // Tip: Gebruik "claude-3-5-sonnet-20240620" (huidige model) ipv "claude-4-sonnet" (bestaat soms niet of is duurder/trager)
  // Ik laat jouw model staan, maar als je errors krijgt over model names, gebruik de 3.5 sonnet.
  const msg = await anthropic.messages.create({
    model: "claude-4-sonnet-20250514", // AANBEVOLEN voor documenten!
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          contentBlock,
          {
            type: "text",
            text: "Extract invoice data to pure JSON. Fields: supplier_name, invoice_date (YYYY-MM-DD), invoice_number, total_amount, vat_amount, currency. If the image is blank, unreadable, or not an invoice, respond with exactly: {\"error\": \"UNREADABLE_DOCUMENT\"}. Do not include markdown formatting or explanations."
          }
        ],
      }
    ],
  });

  // 3. Verwerk het antwoord
  let text = msg.content[0].type === 'text' ? msg.content[0].text : "";
  console.log("DEBUG: Claude Raw Response:", text); // Zie wat Claude echt zegt

  // Zoek naar de JSON (soms kletst Claude eromheen)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  
  // ... (in scanInvoiceWithClaude, na de const jsonMatch = text.match(/\{[\s\S]*\}/);)

// Dit stukje is nu kritiek:
if (!jsonMatch) {
    // Voeg gedetailleerde logging toe als de regex faalt
    console.error("AI DEBUG: Regex kon geen JSON vinden. Volledige response:", text);
    throw new Error("AI kon geen JSON-structuur vinden in de response. Controleer of de prompt duidelijk is en de afbeelding leesbaar.");
}

try {
    const rawJsonText = jsonMatch[0];
    console.log("AI DEBUG: Poging tot parsen van:", rawJsonText); // <-- BELANGRIJKE NIEUWE LOG

    // Binnen scanInvoiceWithClaude, in het try blok
// ...
    const data = JSON.parse(rawJsonText); 
    
    // Check of Claude onze error instructie heeft gevolgd
    if (data.error === "UNREADABLE_DOCUMENT") {
        // 🚨 NIET THROWEN, MAAR DIRECT HET RESULTAAT GEVEN!
        return { error: "UNREADABLE_DOCUMENT", message: "Het document is onleesbaar of geen factuur." };
    }
    
    return data;

} catch (e: any) {
    // Dit vangt alleen ECHTE JSON parse errors af
    console.error("AI DEBUG: JSON Parse Failed op tekst:", jsonMatch[0]);
    console.error("AI DEBUG: JSON Parse Error:", e.message);
    // Hier moet je nog steeds een fout throwen, maar één die de API als 500 ziet.
    throw new Error("Ongeldig JSON formaat ontvangen van AI."); 
}

// ... (rest van de functie)
}