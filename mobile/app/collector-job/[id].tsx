import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import {
  fetchCollectorJobDetail,
  updateCollectorJob,
  type CollectorJob,
  type CollectorProximity,
} from "../../lib/api";
import { requestCollectorLocation } from "../../lib/collector-location";
import { COLLECTOR_PROXIMITY_METERS, formatDistance, isNearPickup } from "../../lib/geo";
import { colors, fonts, radius, shadow } from "../../constants/theme";

export default function CollectorJobScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const [job, setJob] = useState<CollectorJob | null>(null);
  const [proximity, setProximity] = useState<CollectorProximity | null>(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [liters, setLiters] = useState("");
  const [myLat, setMyLat] = useState<number | null>(null);
  const [myLng, setMyLng] = useState<number | null>(null);

  const refreshLocation = useCallback(async () => {
    if (!token || !id) return;
    setLocating(true);
    try {
      const pos = await requestCollectorLocation();
      setMyLat(pos.lat);
      setMyLng(pos.lng);
      const detail = await fetchCollectorJobDetail(id, token, pos.lat, pos.lng);
      setJob(detail.pickup);
      setProximity(detail.proximity);
    } catch (error) {
      if (!job) {
        Alert.alert("Location needed", error instanceof Error ? error.message : "Enable GPS");
      }
    } finally {
      setLocating(false);
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    refreshLocation();
    const interval = setInterval(refreshLocation, 15000);
    return () => clearInterval(interval);
  }, [refreshLocation]);

  const withinRange =
    proximity?.withinRange ??
    (job?.lat != null && job?.lng != null && myLat != null && myLng != null
      ? isNearPickup(myLat, myLng, job.lat, job.lng).withinRange
      : false);

  const distanceMeters =
    proximity?.distanceMeters ??
    (job?.lat != null && job?.lng != null && myLat != null && myLng != null
      ? isNearPickup(myLat, myLng, job.lat, job.lng).distanceMeters
      : null);

  const hasPickupGps = job?.lat != null && job?.lng != null;

  async function getVerifiedPosition() {
    const pos = await requestCollectorLocation();
    if (job?.lat != null && job?.lng != null) {
      const check = isNearPickup(pos.lat, pos.lng, job.lat, job.lng);
      if (!check.withinRange) {
        throw new Error(
          `You must be within ${COLLECTOR_PROXIMITY_METERS} m. You are ${formatDistance(check.distanceMeters)} away.`,
        );
      }
    }
    return pos;
  }

  async function startTrip() {
    if (!token || !job) return;
    setSaving(true);
    try {
      const pos = await getVerifiedPosition();
      const updated = await updateCollectorJob(job.id, token, "start_trip", {
        collectorLat: pos.lat,
        collectorLng: pos.lng,
      });
      setJob(updated);
      Alert.alert("Verified & started", "You are at the pickup location. Customer notified.");
      await refreshLocation();
    } catch (error) {
      Alert.alert("Cannot start", error instanceof Error ? error.message : "Try again");
    } finally {
      setSaving(false);
    }
  }

  async function markCollected() {
    if (!token || !job) return;
    const litersNum = parseInt(liters, 10);
    if (!litersNum || litersNum <= 0) {
      Alert.alert("Liters required", "Enter how many liters you collected.");
      return;
    }
    setSaving(true);
    try {
      const pos = await getVerifiedPosition();
      const updated = await updateCollectorJob(job.id, token, "mark_collected", {
        litersCollected: litersNum,
        collectorLat: pos.lat,
        collectorLng: pos.lng,
      });
      setJob(updated);
      Alert.alert("Collected", "Location verified. Admin will confirm payment.");
    } catch (error) {
      Alert.alert("Cannot complete", error instanceof Error ? error.message : "Try again");
    } finally {
      setSaving(false);
    }
  }

  function openMaps() {
    if (!job) return;
    const query =
      job.lat && job.lng
        ? `${job.lat},${job.lng}`
        : encodeURIComponent(job.address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  }

  function callCustomer() {
    if (!job) return;
    Linking.openURL(`tel:${job.phone}`);
  }

  if (loading && !job) {
    return <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />;
  }
  if (!job) {
    return <Text style={styles.error}>Job not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.verifyCard}>
        <Text style={styles.verifyTitle}>📍 Location verification</Text>
        {!hasPickupGps ? (
          <Text style={styles.verifyWarn}>
            Customer did not pin GPS on this booking. Ask admin before collecting.
          </Text>
        ) : locating && myLat == null ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <Text style={styles.verifyDistance}>
              {distanceMeters != null
                ? `You are ${formatDistance(distanceMeters)} from pickup`
                : "Getting your location…"}
            </Text>
            <Text style={styles.verifyHint}>
              Must be within {proximity?.radiusMeters ?? COLLECTOR_PROXIMITY_METERS} m to start or collect
            </Text>
            <View style={[styles.verifyBadge, withinRange ? styles.verifyOk : styles.verifyFar]}>
              <Text style={[styles.verifyBadgeText, withinRange ? styles.verifyTextDark : styles.verifyTextLight]}>
                {withinRange ? "✓ At pickup location" : "Move closer to customer"}
              </Text>
            </View>
            <Pressable onPress={refreshLocation} style={styles.refreshBtn}>
              <Text style={styles.refreshText}>Refresh location</Text>
            </Pressable>
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Customer</Text>
        <Text style={styles.value}>{job.name}</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{job.phone}</Text>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{job.address}</Text>
        <Text style={styles.label}>Oil</Text>
        <Text style={styles.value}>{job.type} · {job.quantity} (~{job.litersEstimated} L)</Text>
        {job.notes ? (
          <>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{job.notes}</Text>
          </>
        ) : null}
      </View>

      <PrimaryButton label="Open in Google Maps" variant="outline" onPress={openMaps} />
      <View style={{ height: 10 }} />
      <PrimaryButton label="Call customer" variant="outline" onPress={callCustomer} />
      <View style={{ height: 20 }} />

      {job.status === "assigned" && (
        <PrimaryButton
          label={withinRange ? "Verify & start trip" : "Get closer to start"}
          onPress={startTrip}
          loading={saving}
          disabled={!withinRange || !hasPickupGps}
        />
      )}

      {job.status === "on_the_way" && (
        <>
          <Text style={styles.label}>Liters collected</Text>
          <TextInput
            style={styles.input}
            value={liters}
            onChangeText={setLiters}
            keyboardType="number-pad"
            placeholder={`Est. ${job.litersEstimated} L`}
            placeholderTextColor={colors.muted}
          />
          <PrimaryButton
            label={withinRange ? "Verify & mark collected" : "Get closer to collect"}
            onPress={markCollected}
            loading={saving}
            disabled={!withinRange || !hasPickupGps}
          />
        </>
      )}

      {job.status === "collected" && (
        <View style={styles.done}>
          <Text style={styles.doneText}>✓ Oil collected & location verified.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  error: { textAlign: "center", marginTop: 40, fontFamily: fonts.body, color: colors.muted },
  verifyCard: {
    backgroundColor: colors.cardDark,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 16,
  },
  verifyTitle: { fontFamily: fonts.headingSemi, color: colors.white, fontSize: 16 },
  verifyDistance: { fontFamily: fonts.heading, color: colors.lime, fontSize: 22, marginTop: 8 },
  verifyHint: { fontFamily: fonts.body, color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 4 },
  verifyWarn: { fontFamily: fonts.body, color: "#fcd34d", marginTop: 8, lineHeight: 20 },
  verifyBadge: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    alignItems: "center",
  },
  verifyOk: { backgroundColor: colors.mint },
  verifyFar: { backgroundColor: "rgba(255,255,255,0.15)" },
  verifyBadgeText: { fontFamily: fonts.bodySemi, fontSize: 14 },
  verifyTextDark: { color: colors.dark },
  verifyTextLight: { color: colors.white },
  refreshBtn: { marginTop: 10, alignItems: "center" },
  refreshText: { fontFamily: fonts.bodySemi, color: colors.lime, fontSize: 13 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  label: { fontFamily: fonts.bodySemi, color: colors.muted, fontSize: 12, marginTop: 10 },
  value: { fontFamily: fonts.body, color: colors.dark, fontSize: 15, marginTop: 2, lineHeight: 22 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    fontFamily: fonts.body,
    fontSize: 16,
    marginBottom: 12,
    color: colors.text,
  },
  done: { backgroundColor: colors.mint, padding: 16, borderRadius: radius.lg },
  doneText: { fontFamily: fonts.bodySemi, color: colors.dark, textAlign: "center" },
});
