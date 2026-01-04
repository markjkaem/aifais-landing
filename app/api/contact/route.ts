import { NextRequest, NextResponse } from "next/server";
import { withApiGuard } from "@/lib/security/api-guard";
import { contactSchema } from "@/lib/security/schemas";

export const POST = withApiGuard(async (req, body: any) => {
    // Proxy to internal contact route
    const res = await fetch(`${req.nextUrl.origin}/api/internal/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}, {
    schema: contactSchema,
    rateLimit: { windowMs: 60000, maxRequests: 5 }, // 5 per minuut per IP voor proxy
    requireOrigin: true
});
