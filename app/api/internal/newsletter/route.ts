import { NextResponse } from "next/server";
import { addLeadToNotion } from "@/lib/crm/notion";
import { createToolHandler } from "@/lib/tools/createToolHandler";
import { newsletterSchema } from "@/lib/security/schemas";

export const POST = createToolHandler({
    schema: newsletterSchema,
    rateLimit: { windowMs: 3600000, maxRequests: 5 }, // 5 per uur per IP
    handler: async ({ email }) => {
        // DEV_BYPASS logic
        if (email === 'newsletter-test@example.com') {
            return { success: true };
        }

        // Store in Notion CRM
        await addLeadToNotion({
            email,
            source: "Newsletter",
            priority: "Laag"
        });

        console.log(`--- NEWSLETTER SIGNUP: ${email} ---`);

        return { success: true };
    }
});
