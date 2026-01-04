import { NextRequest, NextResponse } from "next/server";
import { addLeadToNotion } from "@/lib/crm/notion";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { email, results, formData } = data;

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // Capture high-intent lead in Notion CRM
        await addLeadToNotion({
            name: formData?.name || "QuickScan User",
            email: email,
            source: "ROI Calculator",
            priority: "Hoog",
            message: `QuickScan ROI Resultaten:\n- Besparing: ${results?.totalSavings}\n- Uren: ${results?.hoursReclaimed}\n- FTE: ${results?.fteRecovered}`,
            metadata: {
                calculationResults: results,
                inputData: formData
            }
        });

        console.log(`✅ QuickScan lead captured: ${email}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ QuickScan capture error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
