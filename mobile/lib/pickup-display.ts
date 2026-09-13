import type { PickupRecord } from "./api";

export function formatPickupType(type: string) {
  const map: Record<string, string> = {
    home: "Home",
    hotel: "Hotel",
    restaurant: "Restaurant",
    commercial: "Commercial",
  };
  return map[type] ?? type;
}

export function formatStatus(status: string) {
  const map: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    assigned: "Assigned",
    on_the_way: "On the way",
    collected: "Collected",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[status] ?? status;
}

export function formatQuantity(quantity: string) {
  const map: Record<string, string> = {
    "under-5": "Under 5 L",
    "5-10": "5–10 L",
    "10-25": "10–25 L",
    "25+": "25+ L",
  };
  return map[quantity] ?? quantity;
}

export function pickupDateLabel(pickup: PickupRecord) {
  if (pickup.preferredDate) return pickup.preferredDate;
  return new Date(pickup.receivedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const TRACKING_STEPS = [
  { key: "pending", label: "Booking confirmed" },
  { key: "confirmed", label: "Booking confirmed" },
  { key: "assigned", label: "Collector assigned" },
  { key: "on_the_way", label: "On the way" },
  { key: "collected", label: "Oil collected" },
  { key: "completed", label: "Completed" },
];

export function trackingProgress(status: string) {
  const order = ["pending", "confirmed", "assigned", "on_the_way", "collected", "completed"];
  const idx = order.indexOf(status);
  return idx >= 0 ? idx : 0;
}
