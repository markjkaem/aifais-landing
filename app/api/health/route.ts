import { NextResponse } from "next/server";

/**
 * Health check endpoint for deployment verification
 * Used by Claude to verify Vercel deployments are successful
 */
export async function GET() {
    return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
    });
}
