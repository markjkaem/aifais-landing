"use client";

import { useSearchParams } from "next/navigation";

/**
 * Hook to detect development mode for browser testing.
 *
 * In development, tools can be tested without payment using:
 * - URL parameter: ?dev=true
 * - Keyboard shortcut: Ctrl+Shift+D (toggles dev mode)
 *
 * This only works in NODE_ENV=development (client-side check via env var).
 */
export function useDevMode(): {
    isDevMode: boolean;
    devBypassSignature: string | null;
} {
    const searchParams = useSearchParams();

    // Only allow in development
    const isDevelopment = process.env.NODE_ENV === "development";

    if (!isDevelopment) {
        return {
            isDevMode: false,
            devBypassSignature: null,
        };
    }

    // Check for ?dev=true in URL
    const devParam = searchParams.get("dev");
    const isDevMode = devParam === "true" || devParam === "1";

    return {
        isDevMode,
        devBypassSignature: isDevMode ? "DEV_BYPASS" : null,
    };
}
