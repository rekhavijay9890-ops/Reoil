import { NextResponse } from "next/server";
import { getStorageMode } from "@/lib/pickup-store";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    ok: true,
    storage: getStorageMode(),
    supabaseConfigured: isSupabaseConfigured(),
    hasAdminKey: Boolean(process.env.ADMIN_KEY),
  });
}
