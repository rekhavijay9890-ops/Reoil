import { NextResponse } from "next/server";
import { registerCollector } from "@/lib/collector-store";

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
    const collector = await registerCollector({
      phone: String(body.phone ?? ""),
      name: String(body.name ?? ""),
      password: String(body.password ?? ""),
      city: String(body.city ?? ""),
      vehicleType: String(body.vehicleType ?? ""),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted. Admin will review and approve your account.",
        collector: {
          id: collector.id,
          name: collector.name,
          phone: collector.phone,
          onboardingStatus: collector.onboardingStatus,
        },
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400, headers: corsHeaders });
  }
}
