import { NextResponse } from "next/server";
import { resetPassword } from "@/lib/customer-auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await resetPassword({
      phone: String(body.phone ?? ""),
      email: String(body.email ?? ""),
      newPassword: String(body.newPassword ?? ""),
    });
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reset failed";
    return NextResponse.json({ error: message }, { status: 400, headers: corsHeaders });
  }
}
