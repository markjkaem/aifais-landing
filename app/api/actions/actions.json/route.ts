import { NextResponse } from "next/server";
import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/tools/factuur-scanner",
        apiPath: "/api/actions/top-up",
      },
    ],
  };

  return NextResponse.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

// ✅ CRITICAL: OPTIONS must return same headers as GET
export const OPTIONS = GET;