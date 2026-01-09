import { createToolHandler } from "@/lib/tools/createToolHandler";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const priceCalculatorSchema = z.object({
    productName: z.string().min(1, "Productnaam is verplicht"),
    costPrice: z.number().min(0, "Kostprijs moet positief zijn"),
    targetMargin: z.number().min(0).max(100).optional().default(30),
    competitorPrices: z.array(z.number()).optional(),
    marketPosition: z.enum(["budget", "mid-range", "premium"]).optional().default("mid-range"),
    includeVAT: z.boolean().optional().default(true),
    vatRate: z.number().min(0).max(100).optional().default(21),
    quantity: z.number().min(1).optional().default(1),
    additionalCosts: z.object({
        shipping: z.number().optional().default(0),
        packaging: z.number().optional().default(0),
        marketing: z.number().optional().default(0),
        overhead: z.number().optional().default(0),
    }).optional(),
    // Free tool - no payment required
    signature: z.string().optional(),
    stripeSessionId: z.string().optional(),
});

export const POST = createToolHandler({
    schema: priceCalculatorSchema,
    // No pricing = FREE tool
    rateLimit: { maxRequests: 30, windowMs: 60000 },
    handler: async (body) => {
        // Calculate total costs
        const additionalCosts = body.additionalCosts ?? { shipping: 0, packaging: 0, marketing: 0, overhead: 0 };
        const totalAdditionalCosts =
            (additionalCosts.shipping ?? 0) +
            (additionalCosts.packaging ?? 0) +
            (additionalCosts.marketing ?? 0) +
            (additionalCosts.overhead ?? 0);

        const totalCostPerUnit = body.costPrice + totalAdditionalCosts;

        // Calculate prices based on margin
        const targetMarginDecimal = body.targetMargin / 100;
        const recommendedPriceExVAT = totalCostPerUnit / (1 - targetMarginDecimal);
        const vatAmount = body.includeVAT ? recommendedPriceExVAT * (body.vatRate / 100) : 0;
        const recommendedPriceInclVAT = recommendedPriceExVAT + vatAmount;

        // Calculate profit
        const profitPerUnit = recommendedPriceExVAT - totalCostPerUnit;
        const profitTotal = profitPerUnit * body.quantity;

        // Competitor analysis
        let competitorAnalysis = null;
        if (body.competitorPrices && body.competitorPrices.length > 0) {
            const avgCompetitorPrice = body.competitorPrices.reduce((a, b) => a + b, 0) / body.competitorPrices.length;
            const minCompetitorPrice = Math.min(...body.competitorPrices);
            const maxCompetitorPrice = Math.max(...body.competitorPrices);

            competitorAnalysis = {
                average: Math.round(avgCompetitorPrice * 100) / 100,
                min: minCompetitorPrice,
                max: maxCompetitorPrice,
                yourPosition: recommendedPriceExVAT < avgCompetitorPrice ? "onder gemiddelde" :
                             recommendedPriceExVAT > avgCompetitorPrice ? "boven gemiddelde" : "gemiddeld",
                priceDifferencePercent: Math.round(((recommendedPriceExVAT - avgCompetitorPrice) / avgCompetitorPrice) * 100),
            };
        }

        // Calculate price ranges based on market position
        const priceRanges = {
            budget: {
                min: Math.round(totalCostPerUnit * 1.15 * 100) / 100,
                max: Math.round(totalCostPerUnit * 1.25 * 100) / 100,
                margin: "15-25%",
            },
            "mid-range": {
                min: Math.round(totalCostPerUnit * 1.30 * 100) / 100,
                max: Math.round(totalCostPerUnit * 1.50 * 100) / 100,
                margin: "30-50%",
            },
            premium: {
                min: Math.round(totalCostPerUnit * 1.50 * 100) / 100,
                max: Math.round(totalCostPerUnit * 2.50 * 100) / 100,
                margin: "50-150%",
            },
        };

        // Break-even analysis
        const breakEvenUnits = body.quantity > 0 ? Math.ceil(totalCostPerUnit * body.quantity / profitPerUnit) : 0;

        // Generate AI insights using Claude
        let aiInsights = null;
        try {
            const anthropic = new Anthropic();
            const prompt = `Je bent een pricing expert voor Nederlandse MKB bedrijven. Analyseer deze prijscalculatie en geef 3-4 korte, concrete tips.

Product: ${body.productName}
Kostprijs: €${totalCostPerUnit.toFixed(2)}
Berekende verkoopprijs: €${recommendedPriceExVAT.toFixed(2)} (ex BTW)
Doelmarge: ${body.targetMargin}%
Marktpositie: ${body.marketPosition}
${competitorAnalysis ? `Gemiddelde concurrentieprijs: €${competitorAnalysis.average}` : ''}

Geef JSON output:
{
  "insights": ["tip 1", "tip 2", "tip 3"],
  "riskLevel": "low|medium|high",
  "recommendation": "korte aanbeveling"
}`;

            const response = await anthropic.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 500,
                messages: [{ role: "user", content: prompt }],
            });

            const textContent = response.content.find(c => c.type === 'text');
            if (textContent && textContent.type === 'text') {
                try {
                    aiInsights = JSON.parse(textContent.text);
                } catch {
                    // If JSON parsing fails, use the raw text
                    aiInsights = { insights: [textContent.text], riskLevel: "medium", recommendation: "Zie analyse" };
                }
            }
        } catch (error) {
            console.error("AI insights error:", error);
            // Continue without AI insights
        }

        return {
            productName: body.productName,
            calculation: {
                costPrice: Math.round(body.costPrice * 100) / 100,
                additionalCosts: {
                    shipping: additionalCosts.shipping ?? 0,
                    packaging: additionalCosts.packaging ?? 0,
                    marketing: additionalCosts.marketing ?? 0,
                    overhead: additionalCosts.overhead ?? 0,
                    total: Math.round(totalAdditionalCosts * 100) / 100,
                },
                totalCostPerUnit: Math.round(totalCostPerUnit * 100) / 100,
            },
            pricing: {
                recommendedPriceExVAT: Math.round(recommendedPriceExVAT * 100) / 100,
                vatRate: body.vatRate,
                vatAmount: Math.round(vatAmount * 100) / 100,
                recommendedPriceInclVAT: Math.round(recommendedPriceInclVAT * 100) / 100,
                targetMargin: body.targetMargin,
                actualMargin: Math.round((profitPerUnit / recommendedPriceExVAT) * 100 * 100) / 100,
            },
            profit: {
                perUnit: Math.round(profitPerUnit * 100) / 100,
                total: Math.round(profitTotal * 100) / 100,
                quantity: body.quantity,
            },
            marketAnalysis: {
                position: body.marketPosition,
                priceRanges,
                competitorAnalysis,
            },
            breakEven: {
                unitsNeeded: breakEvenUnits,
                revenueNeeded: Math.round(breakEvenUnits * recommendedPriceExVAT * 100) / 100,
            },
            aiInsights,
            generatedAt: new Date().toISOString(),
        };
    }
});
