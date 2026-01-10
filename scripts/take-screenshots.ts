import { chromium } from "playwright";
import path from "path";

const SCREENSHOT_DIR = path.join(process.cwd(), "marketing/screenshots");

async function takeScreenshots() {
    console.log("Starting screenshot capture...");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 2, // Retina quality
    });
    const page = await context.newPage();

    // Helper to dismiss cookie banner
    const dismissCookieBanner = async () => {
        try {
            const acceptButton = page.locator('button:has-text("Accepteer alles")');
            if (await acceptButton.isVisible({ timeout: 2000 })) {
                await acceptButton.click();
                await page.waitForTimeout(500);
            }
        } catch {
            // Cookie banner not present, continue
        }
    };

    try {
        // 1. Homepage
        console.log("1. Capturing homepage...");
        await page.goto("https://aifais.com/nl", { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await dismissCookieBanner();
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "01-homepage.png"),
            fullPage: false,
        });
        console.log("   ✓ Homepage captured");

        // 2. Tools overview (scroll to tools section)
        console.log("2. Capturing tools section...");
        await page.evaluate(() => {
            const toolsSection = document.querySelector('[id*="tools"]') ||
                                 document.querySelector('section:has(h2)');
            if (toolsSection) {
                toolsSection.scrollIntoView({ behavior: 'instant' });
            }
        });
        await page.waitForTimeout(500);
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "02-tools-overview.png"),
            fullPage: false,
        });
        console.log("   ✓ Tools section captured");

        // 3. Free tool - BTW Calculator
        console.log("3. Capturing BTW Calculator...");
        await page.goto("https://aifais.com/nl/tools/btw-calculator", { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "03-btw-calculator.png"),
            fullPage: false,
        });
        console.log("   ✓ BTW Calculator captured");

        // 4. Fill in BTW calculator and show result
        console.log("4. Capturing BTW Calculator with result...");
        const amountInput = page.locator('input[type="number"]').first();
        if (await amountInput.isVisible()) {
            await amountInput.fill("1000");
            await page.waitForTimeout(500);
            await page.screenshot({
                path: path.join(SCREENSHOT_DIR, "04-btw-calculator-result.png"),
                fullPage: false,
            });
            console.log("   ✓ BTW Calculator result captured");
        }

        // 5. Quote Generator (free tool)
        console.log("5. Capturing Quote Generator...");
        await page.goto("https://aifais.com/nl/tools/quote-generator", { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "05-quote-generator.png"),
            fullPage: false,
        });
        console.log("   ✓ Quote Generator captured");

        // 6. CV Screener (paid tool - shows paywall)
        console.log("6. Capturing CV Screener (paid tool)...");
        await page.goto("https://aifais.com/nl/tools/cv-screener", { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "06-cv-screener.png"),
            fullPage: false,
        });
        console.log("   ✓ CV Screener captured");

        // 7. Invoice Scanner
        console.log("7. Capturing Invoice Scanner...");
        await page.goto("https://aifais.com/nl/tools/invoice-extraction", { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "07-invoice-scanner.png"),
            fullPage: false,
        });
        console.log("   ✓ Invoice Scanner captured");

        // 8. Mobile view - Homepage
        console.log("8. Capturing mobile view...");
        await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14 Pro
        await page.goto("https://aifais.com/nl", { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "08-mobile-homepage.png"),
            fullPage: false,
        });
        console.log("   ✓ Mobile homepage captured");

        // 9. Mobile - Tool page
        console.log("9. Capturing mobile tool page...");
        await page.goto("https://aifais.com/nl/tools/btw-calculator", { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "09-mobile-tool.png"),
            fullPage: false,
        });
        console.log("   ✓ Mobile tool page captured");

        // 10. Wide format for Product Hunt (1270x760)
        console.log("10. Capturing Product Hunt gallery images...");
        await page.setViewportSize({ width: 1270, height: 760 });
        await page.goto("https://aifais.com/nl", { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "10-ph-homepage.png"),
            fullPage: false,
        });

        await page.goto("https://aifais.com/nl/tools/btw-calculator", { waitUntil: "networkidle" });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: path.join(SCREENSHOT_DIR, "11-ph-tool.png"),
            fullPage: false,
        });
        console.log("   ✓ Product Hunt images captured");

        console.log("\n✅ All screenshots saved to marketing/screenshots/");

    } catch (error) {
        console.error("Error taking screenshots:", error);
    } finally {
        await browser.close();
    }
}

takeScreenshots();
