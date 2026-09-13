import { NextResponse } from "next/server";
import { createCustomerToken, loginCustomer } from "@/lib/customer-auth";

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
    const profile = await loginCustomer(
      String(body.phone ?? ""),
      String(body.password ?? ""),
    );
    const token = createCustomerToken(profile);

    return NextResponse.json(
      { token, user: profile },
      { headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401, headers: corsHeaders });
  }
}
