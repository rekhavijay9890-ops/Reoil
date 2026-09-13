import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/auth";
import { getBearerToken, verifyCustomerToken } from "@/lib/customer-auth";
import { PICKUP_STATUSES } from "@/lib/pickup-utils";
import { notifyPickupStatusChanged } from "@/lib/notify";
import { getPickupById, updatePickup } from "@/lib/pickup-store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const existing = await getPickupById(id);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
    }

    const status = body.status ? String(body.status) : undefined;
    if (status && !PICKUP_STATUSES.includes(status as typeof PICKUP_STATUSES[number])) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400, headers: corsHeaders });
    }

    const pickup = await updatePickup(id, {
      status: status as typeof existing.status | undefined,
      earningsInr: body.earningsInr != null ? Number(body.earningsInr) : undefined,
      litersEstimated: body.litersEstimated != null ? Number(body.litersEstimated) : undefined,
      agreedRatePerLitre: body.agreedRatePerLitre != null
        ? Number(body.agreedRatePerLitre)
        : undefined,
      collectorId: body.collectorId !== undefined ? String(body.collectorId) : undefined,
    });

    if (status && status !== existing.status) {
      await notifyPickupStatusChanged(pickup, existing.status);
    }

    return NextResponse.json({ pickup }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update pickup";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
