import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { withApiGuard } from "@/lib/security/api-guard";
import { gatekeepPayment } from "@/lib/payment-gatekeeper";
import { ToolContext, ToolResponse } from "./types";
import { RateLimitConfig } from "../security/rate-limiter";

interface CreateToolHandlerOptions<TInput, TOutput> {
    schema: ZodSchema<TInput>;
    pricing?: {
        price: number;
        currency: string;
    };
    rateLimit?: RateLimitConfig;
    handler: (input: TInput, context: ToolContext) => Promise<TOutput>;
}

export function createToolHandler<TInput, TOutput>(
    options: CreateToolHandlerOptions<TInput, TOutput>
) {
    return withApiGuard(async (req: NextRequest, validatedData: TInput) => {
        try {
            // 1. Payment Gatekeeping (if pricing is defined)
            let paymentContext: ToolContext["payment"] = { success: true, method: "free" };

            if (options.pricing) {
                const payment = await gatekeepPayment(validatedData, options.pricing.price);

                if (!payment.success) {
                    return NextResponse.json(
                        { error: payment.error, ...payment.details },
                        // @ts-ignore
                        { status: payment.status }
                    );
                }

                paymentContext = {
                    success: true,
                    method: payment.method,
                    status: (payment as any).status
                };
            }

            // 2. Execute Business Logic
            const result = await options.handler(validatedData, { payment: paymentContext });

            // Check if handler returned a custom Response (e.g. for CSV download)
            if (result instanceof Response || result instanceof NextResponse) {
                return result;
            }

            // 3. Standardized Success Response
            return NextResponse.json({
                success: true,
                data: result,
                meta: {
                    method: paymentContext.method,
                    timestamp: new Date().toISOString(),
                }
            } as ToolResponse<TOutput>);

        } catch (error: any) {
            console.error("Tool API Error:", error);
            return NextResponse.json(
                {
                    success: false,
                    error: error.message || "Internal Server Error"
                } as ToolResponse,
                { status: 500 }
            );
        }
    }, {
        schema: options.schema,
        rateLimit: options.rateLimit,
        requireOrigin: true // Default to true for protection
    });
}
