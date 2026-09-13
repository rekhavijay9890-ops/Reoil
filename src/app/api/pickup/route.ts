import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/auth";
import { getBearerToken, verifyCustomerToken } from "@/lib/customer-auth";
import { notifyPickupCreated } from "@/lib/notify";
import { buildPickupInput, listPickups, savePickup } from "@/lib/pickup-store";

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
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders },
    );
  }

  try {
    const pickups = await listPickups();
    return NextResponse.json({ pickups }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load pickups";
    console.error("[Reoil] GET /api/pickup failed:", message);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, type, quantity } = body;

    if (!name || !email || !phone || !address || !type || !quantity) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400, headers: corsHeaders },
      );
    }

    const token = getBearerToken(request);
    const session = token ? verifyCustomerToken(token) : null;

    const pickup = await savePickup(
      buildPickupInput(body, session?.profileId),
    );

    await notifyPickupCreated(pickup);

    return NextResponse.json({ success: true, pickup }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit pickup request";
    console.error("[Reoil] POST /api/pickup failed:", message);
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
