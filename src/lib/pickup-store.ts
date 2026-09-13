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
  lat?: number;
  lng?: number;
  proposedRatePerLitre?: number;
  agreedRatePerLitre?: number;
  negotiable?: boolean;
  collectorId?: string;
  litersCollected?: number;
  collectorVerifiedAt?: string;
  collectorCheckLat?: number;
  collectorCheckLng?: number;
  proximityMeters?: number;
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
  lat?: number | null;
  lng?: number | null;
  proposed_rate_per_litre?: number | null;
  agreed_rate_per_litre?: number | null;
  negotiable?: boolean | null;
  collector_id?: string | null;
  liters_collected?: number | null;
  collector_verified_at?: string | null;
  collector_check_lat?: number | null;
  collector_check_lng?: number | null;
  proximity_meters?: number | null;
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
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    proposedRatePerLitre: row.proposed_rate_per_litre ?? undefined,
    agreedRatePerLitre: row.agreed_rate_per_litre ?? undefined,
    negotiable: row.negotiable ?? undefined,
    collectorId: row.collector_id ?? undefined,
    litersCollected: row.liters_collected ?? undefined,
    collectorVerifiedAt: row.collector_verified_at ?? undefined,
    collectorCheckLat: row.collector_check_lat ?? undefined,
    collectorCheckLng: row.collector_check_lng ?? undefined,
    proximityMeters: row.proximity_meters ?? undefined,
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

  const insertRow: Record<string, unknown> = {
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
  };

  // Only send optional columns when set — works even if phase 3/4 SQL not yet run
  if (data.lat != null) insertRow.lat = data.lat;
  if (data.lng != null) insertRow.lng = data.lng;
  if (data.proposedRatePerLitre != null) insertRow.proposed_rate_per_litre = data.proposedRatePerLitre;
  if (data.negotiable) insertRow.negotiable = true;
  if (data.agreedRatePerLitre != null) insertRow.agreed_rate_per_litre = data.agreedRatePerLitre;

  const { data: row, error } = await supabase
    .from("pickups")
    .insert(insertRow)
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
    lat: body.lat != null ? Number(body.lat) : undefined,
    lng: body.lng != null ? Number(body.lng) : undefined,
    proposedRatePerLitre: body.proposedRatePerLitre != null
      ? Number(body.proposedRatePerLitre)
      : undefined,
    agreedRatePerLitre: body.agreedRatePerLitre != null
      ? Number(body.agreedRatePerLitre)
      : undefined,
    negotiable: Boolean(body.negotiable),
  };
}

export async function updatePickup(
  id: string,
  updates: Partial<
    Pick<
      PickupRequest,
      | "status"
      | "earningsInr"
      | "litersEstimated"
      | "agreedRatePerLitre"
      | "collectorId"
      | "litersCollected"
      | "collectorVerifiedAt"
      | "collectorCheckLat"
      | "collectorCheckLng"
      | "proximityMeters"
    >
  >,
): Promise<PickupRequest> {
  if (!isSupabaseConfigured()) {
    throw new Error("Pickup updates require Supabase");
  }
  const supabase = getSupabase();
  const payload: Record<string, unknown> = {};
  if (updates.status) payload.status = updates.status;
  if (updates.earningsInr != null) payload.earnings_inr = updates.earningsInr;
  if (updates.litersEstimated != null) payload.liters_estimated = updates.litersEstimated;
  if (updates.agreedRatePerLitre != null) payload.agreed_rate_per_litre = updates.agreedRatePerLitre;
  if (updates.collectorId !== undefined) payload.collector_id = updates.collectorId || null;
  if (updates.litersCollected != null) payload.liters_collected = updates.litersCollected;
  if (updates.collectorVerifiedAt) payload.collector_verified_at = updates.collectorVerifiedAt;
  if (updates.collectorCheckLat != null) payload.collector_check_lat = updates.collectorCheckLat;
  if (updates.collectorCheckLng != null) payload.collector_check_lng = updates.collectorCheckLng;
  if (updates.proximityMeters != null) payload.proximity_meters = updates.proximityMeters;

  const { data, error } = await supabase
    .from("pickups")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to update pickup");
  return rowToPickup(data as PickupRow);
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
    const d = new Date(pickup.receivedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-IN", { month: "short", year: "2-digit" });
    monthlyMap.set(label, (monthlyMap.get(label) ?? 0) + pickup.earningsInr);
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

export type MonthlyReport = {
  month: string;
  pickups: number;
  liters: number;
  earnings: number;
  completed: number;
};

export async function getMonthlyReport(profileId: string, month?: string): Promise<MonthlyReport> {
  const pickups = await listPickups(profileId);
  const now = new Date();
  const targetMonth = month ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const inMonth = pickups.filter((p) => p.receivedAt.startsWith(targetMonth));
  const completed = inMonth.filter((p) => p.status === "completed");

  return {
    month: targetMonth,
    pickups: inMonth.length,
    liters: completed.reduce((s, p) => s + p.litersEstimated, 0),
    earnings: completed.reduce((s, p) => s + p.earningsInr, 0),
    completed: completed.length,
  };
}

export async function getBusinessStats(profileId: string) {
  const pickups = await listPickups(profileId);
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonth = pickups.filter((p) => p.receivedAt.startsWith(monthPrefix));
  const completedMonth = thisMonth.filter((p) => p.status === "completed");

  return {
    thisMonthLiters: completedMonth.reduce((s, p) => s + p.litersEstimated, 0),
    thisMonthPickups: thisMonth.length,
    thisMonthEarnings: completedMonth.reduce((s, p) => s + p.earningsInr, 0),
    totalLiters: pickups
      .filter((p) => p.status === "completed")
      .reduce((s, p) => s + p.litersEstimated, 0),
  };
}

const COLLECTOR_ACTIVE_STATUSES: PickupStatus[] = [
  "assigned",
  "on_the_way",
  "collected",
];

export async function listPickupsForCollector(collectorId: string): Promise<PickupRequest[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("pickups")
    .select("*")
    .eq("collector_id", collectorId)
    .in("status", COLLECTOR_ACTIVE_STATUSES)
    .order("received_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as PickupRow[]).map(rowToPickup);
}
