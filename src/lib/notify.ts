import type { PickupRequest } from "./pickup-store";
import { listPushTokens } from "./push-tokens-store";

export async function notifyPickupCreated(pickup: PickupRequest) {
  await sendWebhook("pickup.created", pickup);
}

export async function notifyPickupStatusChanged(
  pickup: PickupRequest,
  previousStatus: string,
) {
  await sendWebhook("pickup.status_changed", { pickup, previousStatus });

  const contact = process.env.CONTACT_WHATSAPP ?? "919876543210";
  const message = encodeURIComponent(
    `Reoil update: Your pickup is now "${pickup.status}". ${pickup.preferredDate ?? ""} ${pickup.preferredTime ?? ""}`.trim(),
  );
  console.log(
    `[Reoil] Status ${previousStatus} → ${pickup.status} for ${pickup.phone}. WhatsApp: https://wa.me/${contact}?text=${message}`,
  );

  if (pickup.profileId) {
    const title = "Pickup update";
    const body = `Your pickup is now "${pickup.status}".`;
    await sendExpoPush(pickup.profileId, title, body);
  }
}

async function sendExpoPush(profileId: string, title: string, body: string) {
  try {
    const tokens = await listPushTokens(profileId);
    if (tokens.length === 0) return;

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(
        tokens.map((token) => ({
          to: token,
          title,
          body,
          sound: "default",
          channelId: "pickups",
        })),
      ),
    });
  } catch (error) {
    console.error("[Reoil] Expo push failed:", error);
  }
}

async function sendWebhook(event: string, payload: unknown) {
  const webhookUrl = process.env.PICKUP_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log(`[Reoil] ${event} (set PICKUP_WEBHOOK_URL to forward):`, payload);
    return;
  }
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, payload }),
    });
  } catch (error) {
    console.error("[Reoil] Webhook notification failed:", error);
  }
}
