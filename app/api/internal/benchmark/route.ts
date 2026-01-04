import { NextRequest, NextResponse } from "next/server";
import { addLeadToNotion } from "@/lib/crm/notion";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { email, sector, score, benchmark } = data;

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // 1. Capture benchmark lead in Notion CRM
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

        // 2. SMTP setup
        const SMTP_HOST = process.env.SMTP_HOST;
        const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
        const SMTP_USER = process.env.SMTP_USER;
        const SMTP_PASS = process.env.SMTP_PASS;
        const TO_EMAIL = process.env.TO_EMAIL || "contact@aifais.com";

        if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: SMTP_USER, pass: SMTP_PASS },
            });

            const isAbove = score > benchmark;

            // Email to User
            const userMailOptions = {
                from: `"AIFAIS Automatisering" <${SMTP_USER}>`,
                to: email,
                subject: `Uw AI Benchmark Resultaten - ${sector}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
                        <h2 style="color: #3066be;">Uw AI Benchmark Score: ${score}%</h2>
                        <p>Bedankt voor het gebruiken van de AIFAIS Benchmark Tool. Hier zijn uw resultaten voor de sector <strong>${sector}</strong>:</p>
                        
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Uw Score:</strong> ${score}%</p>
                            <p style="margin: 5px 0;"><strong>Sector Gemiddelde:</strong> ${benchmark}%</p>
                            <p style="margin: 5px 0;"><strong>Status:</strong> ${isAbove ? "Boven gemiddeld 🚀" : "Groeipotentieel 📈"}</p>
                        </div>

                        <p>${isAbove
                        ? "Gefeliciteerd! U loopt voorop in uw sector. Er zijn echter altijd kansen om nog verder te optimaliseren met AI Agents."
                        : "U scoort momenteel onder het sectorgemiddelde. Dit betekent dat er veel laaghangend fruit is voor automatisering binnen uw bedrijf."
                    }</p>

                        <h3 style="color: #3066be; margin-top: 30px;">Wat is de volgende stap?</h3>
                        <p>We hebben op basis van uw score 3 specifieke verbeterpunten geïdentificeerd. Wilt u deze in detail bespreken?</p>
                        
                        <a href="https://aifais.com/contact" style="display: inline-block; background-color: #3066be; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Plan een gratis adviesgesprek</a>
                        
                        <p style="margin-top: 30px; font-size: 12px; color: #666;">
                            Met vriendelijke groet,<br>
                            Het team van AIFAIS
                        </p>
                    </div>
                `
            };

            // Email to Admin
            const adminMailOptions = {
                from: `"AIFAIS Tool" <${SMTP_USER}>`,
                to: TO_EMAIL,
                subject: `Nieuwe Benchmark Lead: ${email}`,
                text: `Er is een nieuwe benchmark lead binnengekomen.\n\nEmail: ${email}\nSector: ${sector}\nScore: ${score}%\nBenchmark: ${benchmark}%\n\nHet lead is ook toegevoegd aan Notion.`
            };

            // Send both emails
            await Promise.all([
                transporter.sendMail(userMailOptions),
                transporter.sendMail(adminMailOptions)
            ]);

            console.log(`✅ Benchmark emails sent: ${email}`);
        } else {
            console.warn("⚠️ SMTP not configured, skipping benchmark emails.");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Benchmark capture/email error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
