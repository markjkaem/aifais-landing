import { NextRequest } from "next/server";

interface RateLimitEntry {
    count: number;
    startTime: number;
}

const stores: Map<string, Map<string, RateLimitEntry>> = new Map();

export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    keyGenerator?: (req: NextRequest) => string;
}

/**
 * Simple in-memory rate limiter (sliding window)
 * Note: Resets on server restart. For production with multiple instances, use Redis.
 */
export function isRateLimited(req: NextRequest, config: RateLimitConfig, storeName: string): boolean {
    const now = Date.now();

    // Default key is IP address
    const key = config.keyGenerator
        ? config.keyGenerator(req)
        : req.headers.get("x-forwarded-for") || (req as any).ip || "anonymous";

    if (!stores.has(storeName)) {
        stores.set(storeName, new Map());
    }

    const store = stores.get(storeName)!;
    const entry = store.get(key);

    if (!entry) {
        store.set(key, { count: 1, startTime: now });
        return false;
    }

    // If window has passed, reset
    if (now - entry.startTime > config.windowMs) {
        store.set(key, { count: 1, startTime: now });
        return false;
    }

    // If count exceeds max, block
    if (entry.count >= config.maxRequests) {
        return true;
    }

    // Increment count
    entry.count += 1;
    return false;
}
