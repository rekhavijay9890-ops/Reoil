import { NextResponse } from "next/server";
import { listPickups, savePickup } from "@/lib/pickup-store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  const pickups = await listPickups();
  return NextResponse.json({ pickups }, { headers: corsHeaders });
}

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, phone, address, type, quantity } = body;

  if (!name || !email || !phone || !address || !type || !quantity) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400, headers: corsHeaders },
    );
  }

  const pickup = await savePickup({
    name: String(name),
    email: String(email),
    phone: String(phone),
    address: String(address),
    type: String(type),
    quantity: String(quantity),
    notes: body.notes ? String(body.notes) : "",
  });

  console.log("[Reoil pickup request]", pickup);

  return NextResponse.json({ success: true, pickup }, { headers: corsHeaders });
}
