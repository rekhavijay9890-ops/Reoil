import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/auth";
import { updateCollectorOnboarding } from "@/lib/collector-store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  const { id } = await params;
  const body = await request.json();
  const action = body.action === "reject" ? "reject" : "approve";

  try {
    const collector = await updateCollectorOnboarding(id, action);
    return NextResponse.json({ collector }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update collector";
    return NextResponse.json({ error: message }, { status: 400, headers: corsHeaders });
  }
}
