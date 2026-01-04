import { NextRequest, NextResponse } from "next/server";
import { addLeadToNotion } from "@/lib/crm/notion";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

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
}
