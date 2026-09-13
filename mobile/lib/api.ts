import type { AuthUser } from "./auth-storage";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ?? "https://reoil-ten.vercel.app";

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
  lat?: number;
  lng?: number;
  negotiable?: boolean;
  proposedRatePerLitre?: number;
};

export type PickupSubmitResult = {
  success: boolean;
  pickup?: PickupRecord;
  pickups?: PickupRecord[];
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
  lat?: number;
  lng?: number;
  proposedRatePerLitre?: number;
  agreedRatePerLitre?: number;
  negotiable?: boolean;
};

export type CustomerStats = {
  litersCollected: number;
  totalPickups: number;
  totalEarnings: number;
  monthlyEarnings: { month: string; amount: number }[];
  upcoming: PickupRecord | null;
};

export type AddressRecord = {
  id: string;
  profileId: string;
  label: string;
  address: string;
  lat?: number;
  lng?: number;
  createdAt: string;
};

export type MonthlyReport = {
  month: string;
  pickups: number;
  liters: number;
  earnings: number;
  completed: number;
};

export type BusinessStats = {
  thisMonthLiters: number;
  thisMonthPickups: number;
  thisMonthEarnings: number;
  totalLiters: number;
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
  accountType?: "home" | "business";
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

export async function resetPassword(input: {
  phone: string;
  email: string;
  newPassword: string;
}) {
  const response = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Reset failed");
}

export async function submitPickup(payload: PickupPayload, token?: string) {
  const response = await fetch(`${API_URL}/api/pickup`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to submit pickup request");
  return body as PickupSubmitResult;
}

export async function submitBulkPickups(pickups: PickupPayload[], token: string) {
  const response = await fetch(`${API_URL}/api/pickup/bulk`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ pickups }),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Bulk booking failed");
  return body as PickupSubmitResult;
}

export async function registerPushToken(authToken: string, pushToken: string) {
  const response = await fetch(`${API_URL}/api/me/push-token`, {
    method: "POST",
    headers: authHeaders(authToken),
    body: JSON.stringify({ token: pushToken, platform: "android" }),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to register push token");
}

export async function fetchMyPickups(token: string) {
  const response = await fetch(`${API_URL}/api/me/pickups`, { headers: authHeaders(token) });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load pickups");
  return (body.pickups ?? []) as PickupRecord[];
}

export async function fetchMyStats(token: string) {
  const response = await fetch(`${API_URL}/api/me/stats`, { headers: authHeaders(token) });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load stats");
  return body.stats as CustomerStats;
}

export async function fetchMonthlyReport(token: string, month?: string) {
  const url = month
    ? `${API_URL}/api/me/report?month=${month}`
    : `${API_URL}/api/me/report`;
  const response = await fetch(url, { headers: authHeaders(token) });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load report");
  return body as { report: MonthlyReport; business: BusinessStats };
}

export async function fetchPickupById(id: string, token: string) {
  const response = await fetch(`${API_URL}/api/pickup/${id}`, { headers: authHeaders(token) });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load pickup");
  return body.pickup as PickupRecord;
}

export async function fetchAddresses(token: string) {
  const response = await fetch(`${API_URL}/api/me/addresses`, { headers: authHeaders(token) });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load addresses");
  return (body.addresses ?? []) as AddressRecord[];
}

export async function saveAddress(
  token: string,
  input: { label: string; address: string; lat?: number; lng?: number },
) {
  const response = await fetch(`${API_URL}/api/me/addresses`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to save address");
  return body.address as AddressRecord;
}

export async function deleteAddress(token: string, id: string) {
  const response = await fetch(`${API_URL}/api/me/addresses?id=${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to delete address");
}

// --- Collector (delivery staff) APIs ---

export type CollectorJob = {
  id: string;
  name: string;
  phone: string;
  address: string;
  type: string;
  quantity: string;
  notes: string;
  status: string;
  preferredDate?: string;
  preferredTime?: string;
  litersEstimated: number;
  lat?: number;
  lng?: number;
};

export async function loginCollector(phone: string, password: string) {
  const response = await fetch(`${API_URL}/api/collector/auth/login`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ phone, password }),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Login failed");
  return body as { token: string; collector: { id: string; phone: string; name: string } };
}

export async function fetchCollectorJobs(token: string) {
  const response = await fetch(`${API_URL}/api/collector/pickups`, {
    headers: authHeaders(token),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load jobs");
  return (body.pickups ?? []) as CollectorJob[];
}

export async function updateCollectorJob(
  id: string,
  token: string,
  action: "start_trip" | "mark_collected",
  litersCollected?: number,
) {
  const response = await fetch(`${API_URL}/api/collector/pickup/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ action, litersCollected }),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Update failed");
  return body.pickup as CollectorJob;
}
