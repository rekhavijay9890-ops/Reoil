import { NextResponse } from "next/server";
import { getBearerToken, verifyCustomerToken } from "@/lib/customer-auth";
import { savePushToken } from "@/lib/push-tokens-store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  const token = getBearerToken(request);
  const session = token ? verifyCustomerToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  const body = await request.json();
  const pushToken = String(body.token ?? "").trim();
  if (!pushToken) {
    return NextResponse.json({ error: "Missing push token" }, { status: 400, headers: corsHeaders });
  }

  try {
    await savePushToken(session.profileId, pushToken, String(body.platform ?? "android"));
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save push token";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
