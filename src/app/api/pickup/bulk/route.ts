import { NextResponse } from "next/server";
import { getBearerToken, verifyCustomerToken } from "@/lib/customer-auth";
import { notifyPickupCreated } from "@/lib/notify";
import { buildPickupInput, savePickup } from "@/lib/pickup-store";

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
  const items = Array.isArray(body.pickups) ? body.pickups : [];
  if (items.length === 0 || items.length > 10) {
    return NextResponse.json(
      { error: "Submit 1–10 pickups in bulk." },
      { status: 400, headers: corsHeaders },
    );
  }

  try {
    const created = [];
    for (const item of items) {
      const pickup = await savePickup(buildPickupInput(item, session.profileId));
      await notifyPickupCreated(pickup);
      created.push(pickup);
    }
    return NextResponse.json({ success: true, pickups: created }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bulk booking failed";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
