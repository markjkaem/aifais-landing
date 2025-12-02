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
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};