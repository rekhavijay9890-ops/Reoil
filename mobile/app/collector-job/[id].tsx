import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import {
  fetchCollectorJobs,
  updateCollectorJob,
  type CollectorJob,
} from "../../lib/api";
import { colors, fonts, radius, shadow } from "../../constants/theme";

export default function CollectorJobScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const [job, setJob] = useState<CollectorJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [liters, setLiters] = useState("");

  useEffect(() => {
    if (!token || !id) return;
    fetchCollectorJobs(token)
      .then((jobs) => setJob(jobs.find((j) => j.id === id) ?? null))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  async function startTrip() {
    if (!token || !job) return;
    setSaving(true);
    try {
      const updated = await updateCollectorJob(job.id, token, "start_trip");
      setJob(updated);
      Alert.alert("Trip started", "Customer has been notified.");
    } catch (error) {
      Alert.alert("Failed", error instanceof Error ? error.message : "Try again");
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
      const updated = await updateCollectorJob(job.id, token, "mark_collected", litersNum);
      setJob(updated);
      Alert.alert("Collected", "Admin will confirm payment to customer.");
    } catch (error) {
      Alert.alert("Failed", error instanceof Error ? error.message : "Try again");
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

  if (loading) {
    return <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />;
  }
  if (!job) {
    return <Text style={styles.error}>Job not found.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
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
        {job.preferredDate ? (
          <>
            <Text style={styles.label}>Preferred time</Text>
            <Text style={styles.value}>{job.preferredDate} {job.preferredTime ?? ""}</Text>
          </>
        ) : null}
      </View>

      <PrimaryButton label="Open in Google Maps" variant="outline" onPress={openMaps} />
      <View style={{ height: 10 }} />
      <PrimaryButton label="Call customer" variant="outline" onPress={callCustomer} />
      <View style={{ height: 20 }} />

      {job.status === "assigned" && (
        <PrimaryButton label="Start trip" onPress={startTrip} loading={saving} />
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
          <PrimaryButton label="Mark as collected" onPress={markCollected} loading={saving} />
        </>
      )}

      {job.status === "collected" && (
        <View style={styles.done}>
          <Text style={styles.doneText}>✓ Oil collected. Waiting for admin to complete payment.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  error: { textAlign: "center", marginTop: 40, fontFamily: fonts.body, color: colors.muted },
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
