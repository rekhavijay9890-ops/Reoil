import { NextResponse } from "next/server";
import { verifyCollectorToken } from "@/lib/collector-auth";
import { getBearerToken } from "@/lib/customer-auth";
import { listPickupsForCollector } from "@/lib/pickup-store";

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
  const session = token ? verifyCollectorToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const pickups = await listPickupsForCollector(session.collectorId);
    return NextResponse.json({ pickups }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load jobs";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
