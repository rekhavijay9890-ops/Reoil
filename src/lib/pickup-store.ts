import { promises as fs } from "fs";
import path from "path";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import { estimateEarnings, estimateLiters } from "./pickup-utils";

export type PickupStatus =
  | "pending"
  | "confirmed"
  | "assigned"
  | "on_the_way"
  | "collected"
  | "completed"
  | "cancelled";

export type PickupRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  quantity: string;
  notes: string;
  receivedAt: string;
  profileId?: string;
  status: PickupStatus;
  preferredDate?: string;
  preferredTime?: string;
  litersEstimated: number;
  earningsInr: number;
};

const DATA_FILE = path.join(process.cwd(), "data", "pickups.json");

type PickupRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  quantity: string;
  notes: string | null;
  received_at: string;
  profile_id?: string | null;
  status?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  liters_estimated?: number | null;
  earnings_inr?: number | null;
};

function rowToPickup(row: PickupRow): PickupRequest {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    type: row.type,
    quantity: row.quantity,
    notes: row.notes ?? "",
    receivedAt: row.received_at,
    profileId: row.profile_id ?? undefined,
    status: (row.status as PickupStatus) ?? "pending",
    preferredDate: row.preferred_date ?? undefined,
    preferredTime: row.preferred_time ?? undefined,
    litersEstimated: row.liters_estimated ?? estimateLiters(row.quantity),
    earningsInr: row.earnings_inr ?? 0,
  };
}

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function savePickupToFile(
  data: Omit<PickupRequest, "id" | "receivedAt">,
): Promise<PickupRequest> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const pickups = JSON.parse(raw) as PickupRequest[];

  const pickup: PickupRequest = {
    ...data,
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
  };

  pickups.unshift(pickup);
  await fs.writeFile(DATA_FILE, JSON.stringify(pickups, null, 2), "utf-8");

  return pickup;
}

async function listPickupsFromFile(): Promise<PickupRequest[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const pickups = JSON.parse(raw) as PickupRequest[];
  return pickups.map((p) => ({
    ...p,
    status: p.status ?? "pending",
    litersEstimated: p.litersEstimated ?? estimateLiters(p.quantity),
    earningsInr: p.earningsInr ?? 0,
  }));
}

async function savePickupToSupabase(
  data: Omit<PickupRequest, "id" | "receivedAt">,
): Promise<PickupRequest> {
  const supabase = getSupabase();

  const { data: row, error } = await supabase
    .from("pickups")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      type: data.type,
      quantity: data.quantity,
      notes: data.notes,
      profile_id: data.profileId ?? null,
      status: data.status,
      preferred_date: data.preferredDate ?? null,
      preferred_time: data.preferredTime ?? null,
      liters_estimated: data.litersEstimated,
      earnings_inr: data.earningsInr,
    })
    .select()
    .single();

  if (error || !row) {
    throw new Error(error?.message ?? "Failed to save pickup");
  }

  return rowToPickup(row as PickupRow);
}

async function listPickupsFromSupabase(profileId?: string): Promise<PickupRequest[]> {
  const supabase = getSupabase();

  let query = supabase.from("pickups").select("*").order("received_at", { ascending: false });
  if (profileId) {
    query = query.eq("profile_id", profileId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data as PickupRow[]).map(rowToPickup);
}

async function getPickupFromSupabase(id: string): Promise<PickupRequest | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("pickups").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToPickup(data as PickupRow);
}

export function getStorageMode(): "supabase" | "file" {
  return isSupabaseConfigured() ? "supabase" : "file";
}

export async function savePickup(
  data: Omit<PickupRequest, "id" | "receivedAt">,
): Promise<PickupRequest> {
  if (isSupabaseConfigured()) {
    return savePickupToSupabase(data);
  }
  return savePickupToFile(data);
}

export async function listPickups(profileId?: string): Promise<PickupRequest[]> {
  if (isSupabaseConfigured()) {
    return listPickupsFromSupabase(profileId);
  }
  const all = await listPickupsFromFile();
  if (!profileId) return all;
  return all.filter((p) => p.profileId === profileId);
}

export async function getPickupById(id: string): Promise<PickupRequest | null> {
  if (isSupabaseConfigured()) {
    return getPickupFromSupabase(id);
  }
  const all = await listPickupsFromFile();
  return all.find((p) => p.id === id) ?? null;
}

export function buildPickupInput(body: Record<string, unknown>, profileId?: string) {
  const type = String(body.type);
  const quantity = String(body.quantity);
  const litersEstimated = body.litersEstimated
    ? Number(body.litersEstimated)
    : estimateLiters(quantity);
  const earningsInr = body.earningsInr
    ? Number(body.earningsInr)
    : estimateEarnings(type, quantity);

  return {
    name: String(body.name).trim(),
    email: String(body.email).trim(),
    phone: String(body.phone).trim(),
    address: String(body.address).trim(),
    type,
    quantity,
    notes: body.notes ? String(body.notes).trim() : "",
    profileId,
    status: "pending" as PickupStatus,
    preferredDate: body.preferredDate ? String(body.preferredDate) : undefined,
    preferredTime: body.preferredTime ? String(body.preferredTime) : undefined,
    litersEstimated,
    earningsInr,
  };
}

export type CustomerStats = {
  litersCollected: number;
  totalPickups: number;
  totalEarnings: number;
  monthlyEarnings: { month: string; amount: number }[];
  upcoming: PickupRequest | null;
};

export async function getCustomerStats(profileId: string): Promise<CustomerStats> {
  const pickups = await listPickups(profileId);
  const completed = pickups.filter((p) => p.status === "completed");
  const litersCollected = completed.reduce((sum, p) => sum + (p.litersEstimated || 0), 0);
  const totalEarnings = completed.reduce((sum, p) => sum + (p.earningsInr || 0), 0);

  const monthlyMap = new Map<string, number>();
  for (const pickup of completed) {
    const month = new Date(pickup.receivedAt).toLocaleString("en-IN", { month: "short" });
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + pickup.earningsInr);
  }

  const monthlyEarnings = Array.from(monthlyMap.entries()).map(([month, amount]) => ({
    month,
    amount,
  }));

  const upcoming =
    pickups.find((p) => ["pending", "confirmed", "assigned", "on_the_way"].includes(p.status)) ??
    null;

  return {
    litersCollected,
    totalPickups: pickups.length,
    totalEarnings,
    monthlyEarnings,
    upcoming,
  };
}
