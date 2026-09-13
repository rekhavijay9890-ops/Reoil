import { getSupabase, isSupabaseConfigured } from "./supabase";
import { hashPassword } from "./password";
import { normalizePhone } from "./customer-auth";

export type Collector = {
  id: string;
  phone: string;
  name: string;
  active: boolean;
  createdAt: string;
};

type CollectorRow = {
  id: string;
  phone: string;
  name: string;
  password_hash: string;
  active: boolean;
  created_at: string;
};

function rowToCollector(row: CollectorRow): Collector {
  return {
    id: row.id,
    phone: row.phone,
    name: row.name,
    active: row.active,
    createdAt: row.created_at,
  };
}

export async function listCollectors(): Promise<Collector[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("collectors")
    .select("id, phone, name, active, created_at")
    .eq("active", true)
    .order("name");
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => rowToCollector(row as CollectorRow));
}

export async function createCollector(input: {
  phone: string;
  name: string;
  password: string;
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
    .insert({
      phone,
      name: input.name.trim(),
      password_hash: passwordHash,
    })
    .select("id, phone, name, active, created_at")
    .single();

  if (error) {
    if (error.code === "23505") throw new Error("This phone number is already registered.");
    throw new Error(error.message);
  }
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
    .select("id, phone, name, active, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return rowToCollector(data as CollectorRow);
}
