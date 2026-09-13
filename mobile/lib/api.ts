import type { AuthUser } from "./auth-storage";

export const API_URL = "https://reoil-ten.vercel.app";

export type PickupPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  quantity: string;
  notes?: string;
  preferredDate?: string;
  preferredTime?: string;
};

export type PickupRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  quantity: string;
  notes: string;
  receivedAt: string;
  status: string;
  preferredDate?: string;
  preferredTime?: string;
  litersEstimated: number;
  earningsInr: number;
};

export type CustomerStats = {
  litersCollected: number;
  totalPickups: number;
  totalEarnings: number;
  monthlyEarnings: { month: string; amount: number }[];
  upcoming: PickupRecord | null;
};

async function parseJson(response: Response) {
  return response.json().catch(() => ({}));
}

function authHeaders(token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function login(phone: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ phone, password }),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Login failed");
  return body as { token: string; user: AuthUser };
}

export async function register(input: {
  phone: string;
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Registration failed");
  return body as { token: string; user: AuthUser };
}

export async function submitPickup(payload: PickupPayload, token?: string) {
  const response = await fetch(`${API_URL}/api/pickup`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to submit pickup request");
  return body;
}

export async function fetchMyPickups(token: string) {
  const response = await fetch(`${API_URL}/api/me/pickups`, {
    headers: authHeaders(token),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load pickups");
  return (body.pickups ?? []) as PickupRecord[];
}

export async function fetchMyStats(token: string) {
  const response = await fetch(`${API_URL}/api/me/stats`, {
    headers: authHeaders(token),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load stats");
  return body.stats as CustomerStats;
}

export async function fetchPickupById(id: string, token: string) {
  const response = await fetch(`${API_URL}/api/pickup/${id}`, {
    headers: authHeaders(token),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load pickup");
  return body.pickup as PickupRecord;
}
