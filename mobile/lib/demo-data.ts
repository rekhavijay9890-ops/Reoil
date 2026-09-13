export const demoUser = {
  name: "Rekha",
  phone: "+91 98765 43210",
  email: "rekha@example.com",
};

export const demoImpact = {
  litersCollected: 48,
  totalPickups: 6,
};

export const demoUpcomingPickup = {
  id: "upcoming-1",
  status: "Confirmed",
  date: "Mon, 15 Sep",
  time: "10:00 AM – 12:00 PM",
  quantity: "10 L",
  type: "Home",
  address: "12 Green Park, New Delhi",
};

export type PickupHistoryItem = {
  id: string;
  date: string;
  type: "Home" | "Hotel" | "Restaurant";
  quantity: string;
  status: "Completed" | "Pending" | "Cancelled";
  earnings: number;
};

export const demoPickupHistory: PickupHistoryItem[] = [
  { id: "1", date: "8 Sep 2026", type: "Home", quantity: "8 L", status: "Completed", earnings: 96 },
  { id: "2", date: "22 Aug 2026", type: "Restaurant", quantity: "20 L", status: "Completed", earnings: 300 },
  { id: "3", date: "5 Aug 2026", type: "Hotel", quantity: "15 L", status: "Completed", earnings: 210 },
  { id: "4", date: "18 Jul 2026", type: "Home", quantity: "5 L", status: "Completed", earnings: 60 },
];

export const demoEarnings = {
  total: 6850,
  totalCollections: 48,
  totalPickups: 6,
  monthly: [
    { month: "Apr", amount: 420 },
    { month: "May", amount: 680 },
    { month: "Jun", amount: 920 },
    { month: "Jul", amount: 1100 },
    { month: "Aug", amount: 1450 },
    { month: "Sep", amount: 1280 },
  ],
};

export const sourceTypes = [
  { label: "Home", value: "home", icon: "🏠", description: "Household used cooking oil" },
  { label: "Hotel", value: "hotel", icon: "🏨", description: "Hotels & lodges" },
  { label: "Restaurant", value: "restaurant", icon: "🍽️", description: "Restaurants & cafés" },
];

export const quantityOptions = [
  { label: "5 L", value: "5", liters: 5 },
  { label: "10 L", value: "10", liters: 10 },
  { label: "20 L", value: "20", liters: 20 },
  { label: "50 L+", value: "50+", liters: 50 },
];

export const timeSlots = [
  "9:00 AM – 11:00 AM",
  "11:00 AM – 1:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];
