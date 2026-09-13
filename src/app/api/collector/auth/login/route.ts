import { NextResponse } from "next/server";
import { createCollectorToken, loginCollector } from "@/lib/collector-auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const collector = await loginCollector(String(body.phone ?? ""), String(body.password ?? ""));
    const token = createCollectorToken(collector);
    return NextResponse.json({ token, collector }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 400, headers: corsHeaders });
  }
}
