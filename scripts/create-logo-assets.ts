import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";

const OUTPUT_DIR = path.join(process.cwd(), "marketing/screenshots");

async function createLogoAssets() {
    console.log("Creating logo assets...");

    // Create square logos with AIFAIS text
    const sizes = [
        { size: 400, name: "logo-400x400.png" },
        { size: 240, name: "logo-240x240.png" },
        { size: 512, name: "logo-512x512.png" },
    ];

    for (const { size, name } of sizes) {
        // Dark background version
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext("2d");

        // Background gradient (dark blue to darker blue)
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, "#1a1a2e");
        gradient.addColorStop(1, "#16213e");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        // Add subtle accent
        ctx.fillStyle = "#3b82f6";
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.arc(size * 0.8, size * 0.2, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Text settings
        const fontSize = size * 0.22;
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw AIFAIS text
        ctx.fillText("AIFAIS", size / 2, size / 2);

        // Add tagline for larger sizes
        if (size >= 400) {
            const taglineSize = size * 0.06;
            ctx.font = `${taglineSize}px Arial, sans-serif`;
            ctx.fillStyle = "#94a3b8";
            ctx.fillText("AI Business Tools", size / 2, size / 2 + fontSize * 0.7);
        }

        // Save
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync(path.join(OUTPUT_DIR, name), buffer);
        console.log(`   ✓ ${name} created`);

        // White background version (for some directories)
        const canvasWhite = createCanvas(size, size);
        const ctxWhite = canvasWhite.getContext("2d");

        ctxWhite.fillStyle = "#ffffff";
        ctxWhite.fillRect(0, 0, size, size);

        ctxWhite.font = `bold ${fontSize}px Arial, sans-serif`;
        ctxWhite.fillStyle = "#1a1a2e";
        ctxWhite.textAlign = "center";
        ctxWhite.textBaseline = "middle";
        ctxWhite.fillText("AIFAIS", size / 2, size / 2);

        if (size >= 400) {
            const taglineSize = size * 0.06;
            ctxWhite.font = `${taglineSize}px Arial, sans-serif`;
            ctxWhite.fillStyle = "#64748b";
            ctxWhite.fillText("AI Business Tools", size / 2, size / 2 + fontSize * 0.7);
        }

        const bufferWhite = canvasWhite.toBuffer("image/png");
        fs.writeFileSync(path.join(OUTPUT_DIR, name.replace(".png", "-white.png")), bufferWhite);
        console.log(`   ✓ ${name.replace(".png", "-white.png")} created`);
    }

    console.log("\n✅ All logo assets saved to marketing/screenshots/");
}

createLogoAssets().catch(console.error);
