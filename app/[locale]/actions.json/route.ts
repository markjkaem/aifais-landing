import { NextResponse } from "next/server";

export const GET = async () => {
  const payload = {
    rules: [
      {
        // Als een agent/wallet op deze pagina komt...
        pathPattern: "/tools/factuur-scanner", 
        // ...dan moet hij deze API aanroepen voor de interactie:
        apiPath: "https://aifais.com/api/actions/top-up",
      },
    ],
  };

  return NextResponse.json(payload, {
    headers: {
      "Access-Control-Allow-Origin": "*", // Cruciaal: Iedereen mag dit lezen
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};