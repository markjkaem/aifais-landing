import { addLeadToNotion, LeadSource, LeadTag } from "@/lib/crm/notion";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { newsletterSchema } from "@/lib/security/schemas";
import nodemailer from "nodemailer";

// Map source to Notion source and tags
function getSourceConfig(source: string, resource?: string): { notionSource: LeadSource; tags: LeadTag[]; priority: "Hoog" | "Normaal" | "Laag" } {
    switch (source) {
        case "lead_magnet":
            const leadMagnetTags: LeadTag[] = ["High Intent"];
            if (resource === "ai_checklist") leadMagnetTags.push("AI Checklist");
            if (resource === "roi_template") leadMagnetTags.push("ROI Template");
            return { notionSource: "Lead Magnet", tags: leadMagnetTags, priority: "Hoog" };
        case "article_cta":
            return { notionSource: "Article CTA", tags: ["High Intent"], priority: "Normaal" };
        case "homepage":
            return { notionSource: "Newsletter", tags: ["Newsletter"], priority: "Normaal" };
        default:
            return { notionSource: "Newsletter", tags: ["Newsletter"], priority: "Laag" };
    }
}

export const POST = createToolHandler({
    schema: newsletterSchema,
    rateLimit: { windowMs: 3600000, maxRequests: 5 }, // 5 per uur per IP
    handler: async (data) => {
        const { email, source = "newsletter", resource, name } = data;

        // DEV_BYPASS logic
        if (email === 'newsletter-test@example.com') {
            return { success: true };
        }

        // Get source configuration
        const config = getSourceConfig(source, resource);

        // Store in Notion CRM with proper tags
        await addLeadToNotion({
            name: name || undefined,
            email,
            source: config.notionSource,
            priority: config.priority,
            tags: config.tags,
            metadata: resource ? { resource } : undefined
        });

        // Send email notification to admin for high-priority leads
        const SMTP_HOST = process.env.SMTP_HOST;
        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS;
        const TO_EMAIL = process.env.TO_EMAIL || "contact@aifais.com";

        if (SMTP_HOST && SMTP_USER && SMTP_PASS && config.priority !== "Laag") {
            try {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: { user: SMTP_USER, pass: SMTP_PASS },
                });

                const sourceLabels: Record<string, string> = {
                    lead_magnet: "Lead Magnet Download",
                    article_cta: "Artikel CTA",
                    homepage: "Homepage Newsletter",
                    newsletter: "Newsletter Signup"
                };

                await transporter.sendMail({
                    from: `"AIFAIS Leads" <${SMTP_USER}>`,
                    to: TO_EMAIL,
                    subject: `Nieuwe Lead: ${sourceLabels[source] || source} - ${email}`,
                    text: `Nieuwe lead ontvangen!\n\nEmail: ${email}\nNaam: ${name || "Niet opgegeven"}\nBron: ${sourceLabels[source] || source}\nResource: ${resource || "N/A"}\nPrioriteit: ${config.priority}\nTags: ${config.tags.join(", ")}`
                });
            } catch (error) {
                console.error("Failed to send notification email:", error);
                // Don't fail the request if email fails
            }
        }

        console.log(`--- ${config.notionSource.toUpperCase()}: ${email} [${config.tags.join(", ")}] ---`);

        return { success: true };
    }
});
