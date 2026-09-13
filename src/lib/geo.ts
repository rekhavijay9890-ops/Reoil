/** Earth radius in meters */
const R = 6371000;

export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getProximityRadiusMeters() {
  const raw = process.env.COLLECTOR_PROXIMITY_METERS;
  const parsed = raw ? Number(raw) : 300;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 300;
}

export function isWithinProximity(
  collectorLat: number,
  collectorLng: number,
  pickupLat: number,
  pickupLng: number,
  radiusMeters = getProximityRadiusMeters(),
) {
  const distance = distanceMeters(collectorLat, collectorLng, pickupLat, pickupLng);
  return { withinRange: distance <= radiusMeters, distanceMeters: Math.round(distance) };
}

export function formatDistance(meters: number) {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
