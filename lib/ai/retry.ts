/**
 * Retry Logic Wrapper for API Calls
 * Implements exponential backoff with configurable options
 */

export interface RetryOptions {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: Error, attempt: number) => boolean;
    onRetry?: (error: Error, attempt: number, delayMs: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    shouldRetry: (error: Error) => {
        // Retry on network errors and 5xx server errors
        const message = error.message.toLowerCase();
        return (
            message.includes("network") ||
            message.includes("timeout") ||
            message.includes("fetch failed") ||
            message.includes("500") ||
            message.includes("502") ||
            message.includes("503") ||
            message.includes("504") ||
            message.includes("rate limit") ||
            message.includes("overloaded")
        );
    },
    onRetry: () => { }
};

/**
 * Execute a function with automatic retry and exponential backoff
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    let lastError: Error | null = null;
    let delay = opts.initialDelayMs;

    for (let attempt = 1; attempt <= opts.maxRetries + 1; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            if (attempt > opts.maxRetries) {
                break;
            }

            if (!opts.shouldRetry(lastError, attempt)) {
                break;
            }

            opts.onRetry(lastError, attempt, delay);
            await sleep(delay);

            // Calculate next delay with exponential backoff
            delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
        }
    }

    throw lastError;
}

/**
 * Execute a function with timeout
 */
export async function withTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number,
    timeoutMessage = "Operation timed out"
): Promise<T> {
    return Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
        )
    ]);
}

/**
 * Combined retry with timeout
 */
export async function withRetryAndTimeout<T>(
    fn: () => Promise<T>,
    options: RetryOptions & { timeoutMs?: number } = {}
): Promise<T> {
    const { timeoutMs = 60000, ...retryOptions } = options;

    return withRetry(
        () => withTimeout(fn, timeoutMs),
        retryOptions
    );
}

/**
 * Batch execute with concurrency control
 */
export async function batchExecute<T, R>(
    items: T[],
    fn: (item: T, index: number) => Promise<R>,
    options: {
        concurrency?: number;
        onProgress?: (completed: number, total: number, result: R | Error) => void;
        stopOnError?: boolean;
    } = {}
): Promise<{ results: (R | Error)[]; successCount: number; errorCount: number }> {
    const { concurrency = 3, onProgress, stopOnError = false } = options;

    const results: (R | Error)[] = new Array(items.length);
    let successCount = 0;
    let errorCount = 0;
    let currentIndex = 0;
    let stopped = false;

    async function worker(): Promise<void> {
        while (!stopped && currentIndex < items.length) {
            const index = currentIndex++;
            const item = items[index];

            try {
                const result = await fn(item, index);
                results[index] = result;
                successCount++;
                onProgress?.(successCount + errorCount, items.length, result);
            } catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));
                results[index] = err;
                errorCount++;
                onProgress?.(successCount + errorCount, items.length, err);

                if (stopOnError) {
                    stopped = true;
                }
            }
        }
    }

    // Start workers up to concurrency limit
    const workers = Array.from(
        { length: Math.min(concurrency, items.length) },
        () => worker()
    );

    await Promise.all(workers);

    return { results, successCount, errorCount };
}

/**
 * Circuit breaker pattern
 */
export class CircuitBreaker {
    private failures = 0;
    private lastFailureTime = 0;
    private state: "closed" | "open" | "half-open" = "closed";

    constructor(
        private readonly threshold: number = 5,
        private readonly resetTimeoutMs: number = 60000
    ) { }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === "open") {
            if (Date.now() - this.lastFailureTime >= this.resetTimeoutMs) {
                this.state = "half-open";
            } else {
                throw new Error("Circuit breaker is open");
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess(): void {
        this.failures = 0;
        this.state = "closed";
    }

    private onFailure(): void {
        this.failures++;
        this.lastFailureTime = Date.now();

        if (this.failures >= this.threshold) {
            this.state = "open";
        }
    }

    getState(): string {
        return this.state;
    }

    reset(): void {
        this.failures = 0;
        this.state = "closed";
    }
}

/**
 * Rate limiter for API calls
 */
export class RateLimiter {
    private tokens: number;
    private lastRefill: number;

    constructor(
        private readonly maxTokens: number = 10,
        private readonly refillRateMs: number = 1000,
        private readonly tokensPerRefill: number = 1
    ) {
        this.tokens = maxTokens;
        this.lastRefill = Date.now();
    }

    async acquire(): Promise<void> {
        this.refill();

        if (this.tokens <= 0) {
            const waitTime = this.refillRateMs - (Date.now() - this.lastRefill);
            if (waitTime > 0) {
                await sleep(waitTime);
                this.refill();
            }
        }

        this.tokens--;
    }

    private refill(): void {
        const now = Date.now();
        const elapsed = now - this.lastRefill;
        const refills = Math.floor(elapsed / this.refillRateMs);

        if (refills > 0) {
            this.tokens = Math.min(
                this.maxTokens,
                this.tokens + refills * this.tokensPerRefill
            );
            this.lastRefill = now;
        }
    }

    getAvailableTokens(): number {
        this.refill();
        return this.tokens;
    }
}

/**
 * Helper: Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract JSON from AI response text
 * Handles various formats including markdown code blocks
 */
export function extractJSON<T>(responseText: string): T {
    // Remove markdown code blocks if present
    let cleaned = responseText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

    // Try to find JSON object or array
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
    }

    try {
        return JSON.parse(jsonMatch[1]);
    } catch (e) {
        // Try to fix common JSON issues
        const fixed = jsonMatch[1]
            .replace(/,\s*([\]}])/g, "$1") // Remove trailing commas
            .replace(/'/g, '"') // Replace single quotes
            .replace(/(\w+):/g, '"$1":'); // Quote unquoted keys

        try {
            return JSON.parse(fixed);
        } catch {
            throw new Error(`Failed to parse JSON: ${(e as Error).message}`);
        }
    }
}

import { z, ZodSchema } from "zod";

/**
 * Validate extracted data against a Zod schema
 */
export function validateWithSchema<T>(data: unknown, schema: ZodSchema<T>): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errors = result.error.issues.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
        throw new Error(`Validation failed: ${errors}`);
    }
    return result.data;
}
