import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email en naam zijn verplicht" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ongeldig emailadres" },
        { status: 400 }
      );
    }

    // Add to Mailchimp
    const memberHash = crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");

    const mailchimpData = {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: name.split(" ")[0] || name,
        LNAME: name.split(" ").slice(1).join(" ") || "",
      },
      tags: ["Chatbot Lead", "Website Chat"],
    };

    const mailchimpResponse = await fetch(
      `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members/${memberHash}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mailchimpData),
      }
    );

    const mailchimpResult = await mailchimpResponse.json();

    if (!mailchimpResponse.ok) {
      console.error("Mailchimp error:", mailchimpResult);
      // Don't fail the request if Mailchimp fails
      // Still allow user to continue chatting
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Chatbot email API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}