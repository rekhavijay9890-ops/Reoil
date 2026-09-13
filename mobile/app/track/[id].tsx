import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { colors, fonts, radius, shadow } from "../../constants/theme";
import { fetchPickupById, type PickupRecord } from "../../lib/api";
import {
  formatPickupType,
  formatQuantity,
  formatStatus,
  pickupDateLabel,
  TRACKING_STEPS,
  trackingProgress,
} from "../../lib/pickup-display";
import { openPhoneCall, openWhatsApp } from "../../lib/contact-actions";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function TrackPickupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const [pickup, setPickup] = useState<PickupRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    fetchPickupById(id, token)
      .then(setPickup)
      .catch(() => setPickup(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />;
  }

  if (!pickup) {
    return <Text style={styles.error}>Pickup not found.</Text>;
  }

  const progress = trackingProgress(pickup.status);
  const uniqueSteps = TRACKING_STEPS.filter(
    (step, index, arr) => arr.findIndex((s) => s.label === step.label) === index,
  );

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>{formatPickupType(pickup.type)} pickup</Text>
        <Text style={styles.summaryMeta}>
          {pickupDateLabel(pickup)} · {formatQuantity(pickup.quantity)}
        </Text>
        <Text style={styles.status}>{formatStatus(pickup.status)}</Text>
      </View>

      <Text style={styles.sectionTitle}>Pickup status</Text>
      {uniqueSteps.map((step, index) => {
        const done = index <= progress;
        return (
          <View key={step.label} style={styles.stepRow}>
            <View style={[styles.dot, done && styles.dotDone]} />
            <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{step.label}</Text>
          </View>
        );
      })}

      <View style={styles.collectorCard}>
        <Text style={styles.collectorTitle}>Need help?</Text>
        <Text style={styles.collectorText}>Our team will contact you before pickup.</Text>
        <PrimaryButton label="Chat on WhatsApp" onPress={() => openWhatsApp()} />
        <View style={{ height: 10 }} />
        <PrimaryButton label="Call support" variant="outline" onPress={() => openPhoneCall()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  error: { textAlign: "center", marginTop: 40, fontFamily: fonts.body, color: colors.muted },
  summary: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  summaryTitle: { fontFamily: fonts.headingSemi, fontSize: 18, color: colors.dark },
  summaryMeta: { marginTop: 6, fontFamily: fonts.body, color: colors.muted },
  status: { marginTop: 10, fontFamily: fonts.bodySemi, color: colors.primary },
  sectionTitle: {
    fontFamily: fonts.headingSemi,
    fontSize: 16,
    color: colors.dark,
    marginBottom: 12,
  },
  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border,
    marginRight: 12,
  },
  dotDone: { backgroundColor: colors.primary },
  stepLabel: { fontFamily: fonts.body, color: colors.muted, fontSize: 15 },
  stepLabelDone: { color: colors.dark, fontFamily: fonts.bodySemi },
  collectorCard: {
    marginTop: 24,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  collectorTitle: { fontFamily: fonts.headingSemi, fontSize: 16, color: colors.dark },
  collectorText: {
    marginTop: 6,
    marginBottom: 14,
    fontFamily: fonts.body,
    color: colors.muted,
    lineHeight: 20,
  },
});
