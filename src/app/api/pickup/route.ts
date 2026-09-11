import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { name, email, phone, address, type, quantity } = body;

  if (!name || !email || !phone || !address || !type || !quantity) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  // Mock persistence — replace with email service or database in production
  console.log("[Reoil pickup request]", {
    name,
    email,
    phone,
    address,
    type,
    quantity,
    notes: body.notes ?? "",
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
