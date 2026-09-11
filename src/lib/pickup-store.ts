import { promises as fs } from "fs";
import path from "path";

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

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function savePickup(
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

export async function listPickups(): Promise<PickupRequest[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as PickupRequest[];
}
