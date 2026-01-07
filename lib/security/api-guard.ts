import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { isRateLimited, RateLimitConfig } from "./rate-limiter";

interface ApiGuardOptions<T> {
    schema?: ZodSchema<T>;
    rateLimit?: RateLimitConfig;
    requireOrigin?: boolean;
    allowedOrigins?: string[];
}

export function withApiGuard<T>(
    handler: (req: NextRequest, validatedData: T) => Promise<Response | NextResponse>,
    options: ApiGuardOptions<T> = {}
) {
    return async (req: NextRequest) => {
        try {
            // 1. Origin Check (CSRF Protection for internal APIs)
            if (options.requireOrigin) {
                const origin = req.headers.get("origin");
                const host = req.headers.get("host");
                const referer = req.headers.get("referer");

                const checkOrigin = (urlStr: string | null, hostHeader: string | null) => {
                    if (!urlStr || !hostHeader) return false;
                    try {
                        // If urlStr is just a path (which referer shouldn't be, but good to be safe)
                        if (!urlStr.startsWith('http')) return false;

                        const url = new URL(urlStr);
                        // Strict check: protocol must be http/https and host must match exactly
                        return (url.protocol === 'https:' || url.protocol === 'http:') &&
                               url.host === hostHeader;
                    } catch {
                        return false;
                    }
                };

                const isSelf = checkOrigin(origin, host);
                const isSelfReferer = checkOrigin(referer, host);

                if (!isSelf && !isSelfReferer) {
                    console.warn("❌ Suspicious origin blocked:", { origin, referer, host });
                    return NextResponse.json({ error: "Forbidden: Origin not allowed" }, { status: 403 });
                }
            }

            // 2. Rate Limiting (Skip in development)
            if (options.rateLimit && process.env.NODE_ENV !== 'development') {
                const storeName = req.nextUrl.pathname;
                if (isRateLimited(req, options.rateLimit, storeName)) {
                    return NextResponse.json(
                        { error: "Too many requests. Please try again later." },
                        { status: 429 }
                    );
                }
            }

            // 3. Input Validation
            let validatedData: any = {};
            if (options.schema) {
                let body;
                try {
                    body = await req.json();
                } catch (e) {
                    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
                }

                const result = options.schema.safeParse(body);
                if (!result.success) {
                    console.error("❌ Validation Failed for", req.nextUrl.pathname, result.error.format());
                    return NextResponse.json(
                        { error: "Validation failed", details: result.error.format() },
                        { status: 400 }
                    );
                }
                validatedData = result.data;
            }

            // 4. Call original handler
            return await handler(req, validatedData);
        } catch (error: any) {
            console.error("❌ API Guard error:", error);
            return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
            );
        }
    };
}
