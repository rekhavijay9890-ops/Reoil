import { NextResponse } from "next/server";
import { getBearerToken, verifyCustomerToken } from "@/lib/customer-auth";
import { getPickupById } from "@/lib/pickup-store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = getBearerToken(request);
  const session = token ? verifyCustomerToken(token) : null;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const pickup = await getPickupById(id);
    if (!pickup || pickup.profileId !== session.profileId) {
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json({ pickup }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load pickup";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
