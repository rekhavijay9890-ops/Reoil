import { formatDistance, getProximityRadiusMeters, isWithinProximity } from "./geo";
import type { PickupRequest } from "./pickup-store";

export class ProximityError extends Error {
  distanceMeters: number;
  radiusMeters: number;

  constructor(distanceMeters: number, radiusMeters: number) {
    super(
      `You must be within ${radiusMeters} m of the pickup. You are ${formatDistance(distanceMeters)} away.`,
    );
    this.distanceMeters = distanceMeters;
    this.radiusMeters = radiusMeters;
  }
}

export function verifyCollectorAtPickup(
  pickup: PickupRequest,
  collectorLat: number,
  collectorLng: number,
) {
  if (pickup.lat == null || pickup.lng == null) {
    throw new Error(
      "Customer location is not pinned on this booking. Ask admin to add GPS or re-book with location enabled.",
    );
  }

  const radiusMeters = getProximityRadiusMeters();
  const { withinRange, distanceMeters } = isWithinProximity(
    collectorLat,
    collectorLng,
    pickup.lat,
    pickup.lng,
    radiusMeters,
  );

  if (!withinRange) {
    throw new ProximityError(distanceMeters, radiusMeters);
  }

  return { distanceMeters, radiusMeters };
}
