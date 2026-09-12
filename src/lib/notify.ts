import type { PickupRequest } from "./pickup-store";

export async function notifyPickupCreated(pickup: PickupRequest) {
  const webhookUrl = process.env.PICKUP_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("[Reoil] New pickup (set PICKUP_WEBHOOK_URL to forward):", pickup.id);
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "pickup.created",
        pickup,
      }),
    });
  } catch (error) {
    console.error("[Reoil] Webhook notification failed:", error);
  }
}
