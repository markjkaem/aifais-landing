import { NextRequest, NextResponse } from "next/server";
import { addLeadToNotion } from "@/lib/crm/notion";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { email, sector, score, benchmark } = data;

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // Capture benchmark lead in Notion CRM
        await addLeadToNotion({
            email: email,
            source: "Tool Landing Page", // Specifically the Benchmark tool
            priority: "Normaal",
            message: `Benchmark Resultaten:\n- Sector: ${sector}\n- Score: ${score}%\n- Sectorgemiddelde: ${benchmark}%`,
            metadata: {
                tool: "Digital Benchmark",
                sector,
                score,
                benchmark
            }
        });

        console.log(`✅ Benchmark lead captured: ${email}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Benchmark capture error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
