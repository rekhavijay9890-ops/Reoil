import { promises as fs } from "fs";
import path from "path";
import { getSupabase, isSupabaseConfigured } from "./supabase";

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
  return JSON.parse(raw) as PickupRequest[];
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
    })
    .select()
    .single();

  if (error || !row) {
    throw new Error(error?.message ?? "Failed to save pickup");
  }

  return rowToPickup(row as PickupRow);
}

async function listPickupsFromSupabase(): Promise<PickupRequest[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("pickups")
    .select("*")
    .order("received_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as PickupRow[]).map(rowToPickup);
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

export async function listPickups(): Promise<PickupRequest[]> {
  if (isSupabaseConfigured()) {
    return listPickupsFromSupabase();
  }
  return listPickupsFromFile();
}
