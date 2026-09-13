import * as Location from "expo-location";

export type CollectorPosition = {
  lat: number;
  lng: number;
  accuracy?: number;
};

export async function requestCollectorLocation(): Promise<CollectorPosition> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Location permission is required to verify you are at the pickup address.");
  }

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
    accuracy: pos.coords.accuracy ?? undefined,
  };
}
