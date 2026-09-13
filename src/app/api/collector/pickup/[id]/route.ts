import { NextResponse } from "next/server";
import { verifyCollectorToken } from "@/lib/collector-auth";
import { getBearerToken } from "@/lib/customer-auth";
import { notifyPickupStatusChanged } from "@/lib/notify";
import { getPickupById, updatePickup } from "@/lib/pickup-store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const COLLECTOR_STATUS_FLOW: Record<string, string> = {
  assigned: "on_the_way",
  on_the_way: "collected",
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
  const session = token ? verifyCollectorToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const pickup = await getPickupById(id);
    if (!pickup || pickup.collectorId !== session.collectorId) {
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
  const { id } = await params;
  const token = getBearerToken(request);
  const session = token ? verifyCollectorToken(token) : null;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }

  try {
    const existing = await getPickupById(id);
    if (!existing || existing.collectorId !== session.collectorId) {
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: corsHeaders });
    }

    const body = await request.json();
    const action = String(body.action ?? "");

    let newStatus = existing.status;
    let litersCollected: number | undefined;

    if (action === "start_trip") {
      if (existing.status !== "assigned") {
        return NextResponse.json({ error: "Pickup is not ready to start." }, { status: 400, headers: corsHeaders });
      }
      newStatus = "on_the_way";
    } else if (action === "mark_collected") {
      if (existing.status !== "on_the_way") {
        return NextResponse.json({ error: "Start the trip first." }, { status: 400, headers: corsHeaders });
      }
      litersCollected = Number(body.litersCollected);
      if (!litersCollected || litersCollected <= 0) {
        return NextResponse.json({ error: "Enter liters collected." }, { status: 400, headers: corsHeaders });
      }
      newStatus = "collected";
    } else if (body.status && COLLECTOR_STATUS_FLOW[existing.status] === body.status) {
      newStatus = body.status;
      if (body.status === "collected") {
        litersCollected = Number(body.litersCollected);
      }
    } else {
      return NextResponse.json({ error: "Invalid action." }, { status: 400, headers: corsHeaders });
    }

    const pickup = await updatePickup(id, {
      status: newStatus,
      litersCollected,
      litersEstimated: litersCollected ?? existing.litersEstimated,
    });

    if (newStatus !== existing.status) {
      await notifyPickupStatusChanged(pickup, existing.status);
    }

    return NextResponse.json({ pickup }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update pickup";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
