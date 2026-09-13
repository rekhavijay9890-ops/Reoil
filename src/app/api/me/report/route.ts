import { NextResponse } from "next/server";
import { getBearerToken, verifyCustomerToken } from "@/lib/customer-auth";
import { getBusinessStats, getMonthlyReport } from "@/lib/pickup-store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  const token = getBearerToken(request);
  const session = token ? verifyCustomerToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") ?? undefined;

  try {
    const report = await getMonthlyReport(session.profileId, month);
    const business = await getBusinessStats(session.profileId);
    return NextResponse.json({ report, business }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load report";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
