const API_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://10.0.2.2:4318";

export type PickupPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  quantity: string;
  notes?: string;
};

export async function submitPickup(payload: PickupPayload) {
  const response = await fetch(`${API_URL}/api/pickup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error ?? "Failed to submit pickup request");
  }

  return body;
}
