import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/auth";
import { createCollector, listCollectorsForAdmin } from "@/lib/collector-store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }
  try {
    const collectors = await listCollectorsForAdmin();
    const pending = collectors.filter((c) => c.onboardingStatus === "pending");
    const active = collectors.filter((c) => c.onboardingStatus === "approved");
    return NextResponse.json({ collectors: active, pending, all: collectors }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load collectors";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }
  try {
    const body = await request.json();
    const collector = await createCollector({
      phone: String(body.phone ?? ""),
      name: String(body.name ?? ""),
      password: String(body.password ?? ""),
    });
    return NextResponse.json({ collector }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create collector";
    return NextResponse.json({ error: message }, { status: 400, headers: corsHeaders });
  }
}
