import { NextRequest, NextResponse } from "next/server";
import { addLeadToNotion } from "@/lib/crm/notion";
import { withApiGuard } from "@/lib/security/api-guard";
import { newsletterSchema } from "@/lib/security/schemas";

export const POST = withApiGuard(async (req, { email }: { email: string }) => {
    try {
        // Store in Notion CRM
        await addLeadToNotion({
            email,
            source: "Newsletter",
            priority: "Laag"
        });

        console.log(`--- NEWSLETTER SIGNUP: ${email} ---`);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}, {
    schema: newsletterSchema,
    rateLimit: { windowMs: 3600000, maxRequests: 5 }, // 5 per uur per IP
    requireOrigin: true
});
