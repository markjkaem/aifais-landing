import { NextResponse } from "next/server";
import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

// ✅ Override met correcte headers voor Actions spec 2.2.1
const CORS_HEADERS = {
  ...ACTIONS_CORS_HEADERS,
  "X-Action-Version": "2.2.1",
  "X-Blockchain-Ids": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
};

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/tools/invoice-extraction",
        apiPath: "/api/blinks/top-up",
      },
    ],
  };

  return NextResponse.json(payload, {
    headers: CORS_HEADERS,
  });
};

// ✅ CRITICAL: OPTIONS must return same headers as GET
export const OPTIONS = GET;