/** Must match server default in COLLECTOR_PROXIMITY_METERS (300 m) */
export const COLLECTOR_PROXIMITY_METERS = 300;

const R = 6371000;

export function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(meters: number) {
  const rounded = Math.round(meters);
  if (rounded < 1000) return `${rounded} m`;
  return `${(rounded / 1000).toFixed(1)} km`;
}

export function isNearPickup(
  collectorLat: number,
  collectorLng: number,
  pickupLat: number,
  pickupLng: number,
  radiusMeters = COLLECTOR_PROXIMITY_METERS,
) {
  const distance = distanceMeters(collectorLat, collectorLng, pickupLat, pickupLng);
  return { withinRange: distance <= radiusMeters, distanceMeters: Math.round(distance) };
}
