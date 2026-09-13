export const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ?? "https://reoil-ten.vercel.app";

export type CollectorUser = {
  id: string;
  phone: string;
  name: string;
  active: boolean;
};

export type Job = {
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

function authHeaders(token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function parseJson(response: Response) {
  return response.json().catch(() => ({}));
}

export async function loginCollector(phone: string, password: string) {
  const response = await fetch(`${API_URL}/api/collector/auth/login`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ phone, password }),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Login failed");
  return body as { token: string; collector: CollectorUser };
}

export async function fetchJobs(token: string) {
  const response = await fetch(`${API_URL}/api/collector/pickups`, {
    headers: authHeaders(token),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load jobs");
  return (body.pickups ?? []) as Job[];
}

export async function fetchJob(id: string, token: string) {
  const response = await fetch(`${API_URL}/api/collector/pickup/${id}`, {
    headers: authHeaders(token),
  });
  const body = await parseJson(response);
  if (!response.ok) throw new Error(body.error ?? "Failed to load job");
  return body.job as Job ?? body.pickup as Job;
}

export async function updateJob(
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
  return body.pickup as Job;
}
