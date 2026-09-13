import { NextResponse } from "next/server";
import { deleteAddress, listAddresses, saveAddress } from "@/lib/addresses-store";
import { getBearerToken, verifyCustomerToken } from "@/lib/customer-auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function getSession(request: Request) {
  const token = getBearerToken(request);
  return token ? verifyCustomerToken(token) : null;
}

export async function GET(request: Request) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }
  try {
    const addresses = await listAddresses(session.profileId);
    return NextResponse.json({ addresses }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load addresses";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }
  try {
    const body = await request.json();
    const address = await saveAddress(session.profileId, {
      label: String(body.label ?? "Home"),
      address: String(body.address ?? ""),
      lat: body.lat != null ? Number(body.lat) : undefined,
      lng: body.lng != null ? Number(body.lng) : undefined,
    });
    return NextResponse.json({ address }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save address";
    return NextResponse.json({ error: message }, { status: 400, headers: corsHeaders });
  }
}

export async function DELETE(request: Request) {
  const session = getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing address id" }, { status: 400, headers: corsHeaders });
  }
  try {
    await deleteAddress(session.profileId, id);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete address";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
