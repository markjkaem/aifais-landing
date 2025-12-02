import { NextResponse } from "next/server";

export const GET = async () => {
  const payload = {
    rules: [
      {
        pathPattern: "/tools/factuur-scanner",
        apiPath: "/api/actions/top-up",
      },
    ],
  };

  return NextResponse.json(payload, {
    headers: {
      // ✅ CORS headers
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Encoding, Accept-Encoding",
      // ✅ Solana Action headers
      "X-Action-Version": "2.2.1",
      "X-Blockchain-Ids": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
    },
  });
};

// ✅ Voeg OPTIONS handler toe voor preflight requests
export const OPTIONS = async () => {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Encoding, Accept-Encoding",
    },
  });
};