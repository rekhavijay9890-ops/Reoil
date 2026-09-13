const QUANTITY_LITERS: Record<string, number> = {
  "under-5": 4,
  "5-10": 8,
  "10-25": 15,
  "25+": 30,
  "5": 5,
  "10": 10,
  "20": 20,
  "50+": 50,
};

const RATE_BY_TYPE: Record<string, number> = {
  home: 12,
  hotel: 14,
  restaurant: 15,
  commercial: 14,
};

export const PICKUP_STATUSES = [
  "pending",
  "confirmed",
  "assigned",
  "on_the_way",
  "collected",
  "completed",
  "cancelled",
] as const;

export function estimateLiters(quantity: string) {
  return QUANTITY_LITERS[quantity] ?? 10;
}

export function estimateEarnings(type: string, quantity: string) {
  const liters = estimateLiters(quantity);
  const rate = RATE_BY_TYPE[type] ?? RATE_BY_TYPE.home;
  return liters * rate;
}

export function formatPickupType(type: string) {
  const map: Record<string, string> = {
    home: "Home",
    hotel: "Hotel",
    restaurant: "Restaurant",
    commercial: "Commercial",
  };
  return map[type] ?? type;
}
