import { getSupabase, isSupabaseConfigured } from "./supabase";
import { hashPassword } from "./password";
import { normalizePhone } from "./customer-auth";

export type OnboardingStatus = "pending" | "approved" | "rejected";

export type Collector = {
  id: string;
  phone: string;
  name: string;
  active: boolean;
  onboardingStatus: OnboardingStatus;
  city?: string;
  vehicleType?: string;
  createdAt: string;
  approvedAt?: string;
};

type CollectorRow = {
  id: string;
  phone: string;
  name: string;
  password_hash: string;
  active: boolean;
  onboarding_status?: string | null;
  city?: string | null;
  vehicle_type?: string | null;
  created_at: string;
  approved_at?: string | null;
};

function rowToCollector(row: CollectorRow): Collector {
  const status = (row.onboarding_status as OnboardingStatus) ?? "approved";
  return {
    id: row.id,
    phone: row.phone,
    name: row.name,
    active: row.active,
    onboardingStatus: status,
    city: row.city ?? undefined,
    vehicleType: row.vehicle_type ?? undefined,
    createdAt: row.created_at,
    approvedAt: row.approved_at ?? undefined,
  };
}

function buildInsertRow(input: {
  phone: string;
  name: string;
  passwordHash: string;
  onboardingStatus: OnboardingStatus;
  active: boolean;
  city?: string;
  vehicleType?: string;
  approvedAt?: string;
}) {
  const row: Record<string, unknown> = {
    phone: input.phone,
    name: input.name.trim(),
    password_hash: input.passwordHash,
    active: input.active,
  };
  row.onboarding_status = input.onboardingStatus;
  if (input.city) row.city = input.city.trim();
  if (input.vehicleType) row.vehicle_type = input.vehicleType;
  if (input.approvedAt) row.approved_at = input.approvedAt;
  return row;
}

export async function listCollectors(): Promise<Collector[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("collectors")
    .select("id, phone, name, active, onboarding_status, city, vehicle_type, created_at, approved_at")
    .eq("active", true)
    .eq("onboarding_status", "approved")
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => rowToCollector(row as CollectorRow));
}

export async function listCollectorsForAdmin(): Promise<Collector[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("collectors")
    .select("id, phone, name, active, onboarding_status, city, vehicle_type, created_at, approved_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => rowToCollector(row as CollectorRow));
}

export async function createCollector(input: {
  phone: string;
  name: string;
  password: string;
  city?: string;
  vehicleType?: string;
}): Promise<Collector> {
  if (!isSupabaseConfigured()) {
    throw new Error("Collectors require Supabase");
  }
  const phone = normalizePhone(input.phone);
  if (phone.length < 10) throw new Error("Enter a valid 10-digit mobile number.");
  if (input.password.length < 6) throw new Error("Password must be at least 6 characters.");

  const supabase = getSupabase();
  const passwordHash = await hashPassword(input.password);
  const { data, error } = await supabase
    .from("collectors")
    .insert(
      buildInsertRow({
        phone,
        name: input.name,
        passwordHash,
        onboardingStatus: "approved",
        active: true,
        city: input.city,
        vehicleType: input.vehicleType,
        approvedAt: new Date().toISOString(),
      }),
    )
    .select("id, phone, name, active, onboarding_status, city, vehicle_type, created_at, approved_at")
    .single();

  if (error) {
    if (error.code === "23505") throw new Error("This phone number is already registered.");
    throw new Error(error.message);
  }
  return rowToCollector(data as CollectorRow);
}

export async function registerCollector(input: {
  phone: string;
  name: string;
  password: string;
  city: string;
  vehicleType: string;
}): Promise<Collector> {
  if (!isSupabaseConfigured()) {
    throw new Error("Registration requires Supabase.");
  }
  const phone = normalizePhone(input.phone);
  if (phone.length < 10) throw new Error("Enter a valid 10-digit mobile number.");
  if (input.password.length < 6) throw new Error("Password must be at least 6 characters.");
  if (!input.city.trim()) throw new Error("Enter your city.");
  if (!input.vehicleType) throw new Error("Select your vehicle type.");

  const existing = await getCollectorByPhone(phone);
  if (existing) {
    if (existing.onboarding_status === "pending") {
      throw new Error("You already applied. Waiting for admin approval.");
    }
    throw new Error("This phone number is already registered.");
  }

  const supabase = getSupabase();
  const passwordHash = await hashPassword(input.password);
  const { data, error } = await supabase
    .from("collectors")
    .insert(
      buildInsertRow({
        phone,
        name: input.name,
        passwordHash,
        onboardingStatus: "pending",
        active: false,
        city: input.city,
        vehicleType: input.vehicleType,
      }),
    )
    .select("id, phone, name, active, onboarding_status, city, vehicle_type, created_at, approved_at")
    .single();

  if (error) {
    if (error.code === "23505") throw new Error("This phone number is already registered.");
    throw new Error(error.message);
  }
  return rowToCollector(data as CollectorRow);
}

export async function updateCollectorOnboarding(
  id: string,
  action: "approve" | "reject",
): Promise<Collector> {
  if (!isSupabaseConfigured()) {
    throw new Error("Collectors require Supabase");
  }
  const supabase = getSupabase();
  const payload =
    action === "approve"
      ? {
          onboarding_status: "approved",
          active: true,
          approved_at: new Date().toISOString(),
        }
      : {
          onboarding_status: "rejected",
          active: false,
        };

  const { data, error } = await supabase
    .from("collectors")
    .update(payload)
    .eq("id", id)
    .select("id, phone, name, active, onboarding_status, city, vehicle_type, created_at, approved_at")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to update collector");
  return rowToCollector(data as CollectorRow);
}

export async function getCollectorByPhone(phone: string): Promise<CollectorRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("collectors")
    .select("*")
    .eq("phone", normalizePhone(phone))
    .maybeSingle();
  if (error || !data) return null;
  return data as CollectorRow;
}

export async function getCollectorById(id: string): Promise<Collector | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("collectors")
    .select("id, phone, name, active, onboarding_status, city, vehicle_type, created_at, approved_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToCollector(data as CollectorRow);
}
