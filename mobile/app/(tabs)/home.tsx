import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScreenHeader } from "../../components/ScreenHeader";
import { colors, fonts, radius, shadow } from "../../constants/theme";
import { demoImpact, demoUpcomingPickup, demoUser } from "../../lib/demo-data";

const benefits = [
  { icon: "🌱", label: "Eco-friendly" },
  { icon: "💰", label: "Get paid" },
  { icon: "🚚", label: "Free pickup" },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title={`Hello, ${demoUser.name}`}
          subtitle="Ready to recycle your oil?"
          onNotificationPress={() =>
            Alert.alert("Notifications", "Push notifications coming in Phase 2.")
          }
        />

        <View style={styles.heroCard}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Used Oil Has Value</Text>
            <Text style={styles.heroSub}>
              Book a free pickup and get paid when we collect.
            </Text>
            <PrimaryButton
              label="Book a Pickup"
              onPress={() => router.push("/book")}
            />
          </View>
          <Text style={styles.heroOil}>🛢️</Text>
        </View>

        <Text style={styles.sectionTitle}>Your Impact</Text>
        <View style={styles.impactRow}>
          <View style={styles.impactCard}>
            <Text style={styles.impactValue}>{demoImpact.litersCollected} L</Text>
            <Text style={styles.impactLabel}>Oil collected</Text>
          </View>
          <View style={styles.impactCard}>
            <Text style={styles.impactValue}>{demoImpact.totalPickups}</Text>
            <Text style={styles.impactLabel}>Pickups done</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Upcoming Pickup</Text>
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingTop}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{demoUpcomingPickup.status}</Text>
            </View>
            <Pressable onPress={() => Alert.alert("Tracking", "Tracking screen coming in Phase 2.")}>
              <Text style={styles.trackLink}>Track →</Text>
            </Pressable>
          </View>
          <Text style={styles.upcomingMeta}>
            {demoUpcomingPickup.date} · {demoUpcomingPickup.time}
          </Text>
          <Text style={styles.upcomingDetail}>
            {demoUpcomingPickup.type} · {demoUpcomingPickup.quantity}
          </Text>
          <Text style={styles.upcomingAddress}>{demoUpcomingPickup.address}</Text>
        </View>

        <Text style={styles.sectionTitle}>Why Reoil?</Text>
        <View style={styles.benefitsRow}>
          {benefits.map((b) => (
            <View key={b.label} style={styles.benefitCard}>
              <Text style={styles.benefitIcon}>{b.icon}</Text>
              <Text style={styles.benefitLabel}>{b.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  heroCard: {
    backgroundColor: colors.cardDark,
    borderRadius: radius.xl,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    ...shadow.card,
  },
  heroText: { flex: 1, paddingRight: 8 },
  heroTitle: {
    color: colors.white,
    fontSize: 22,
    fontFamily: fonts.heading,
    marginBottom: 6,
  },
  heroSub: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  heroOil: { fontSize: 48 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.headingSemi,
    color: colors.dark,
    marginBottom: 12,
  },
  impactRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  impactCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  impactValue: {
    fontSize: 22,
    fontFamily: fonts.heading,
    color: colors.primary,
  },
  impactLabel: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.muted,
  },
  upcomingCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  upcomingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: colors.mint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusText: {
    color: colors.dark,
    fontFamily: fonts.bodySemi,
    fontSize: 12,
  },
  trackLink: {
    color: colors.primary,
    fontFamily: fonts.bodySemi,
    fontSize: 13,
  },
  upcomingMeta: {
    fontFamily: fonts.bodySemi,
    color: colors.dark,
    fontSize: 15,
  },
  upcomingDetail: {
    marginTop: 4,
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 14,
  },
  upcomingAddress: {
    marginTop: 6,
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 13,
  },
  benefitsRow: { flexDirection: "row", gap: 10 },
  benefitCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  benefitIcon: { fontSize: 24, marginBottom: 6 },
  benefitLabel: {
    fontSize: 12,
    fontFamily: fonts.bodySemi,
    color: colors.dark,
    textAlign: "center",
  },
});
