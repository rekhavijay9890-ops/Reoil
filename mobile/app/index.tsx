import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/theme";
import { stats, steps } from "../lib/content";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            Re<Text style={styles.logoAccent}>oil</Text>
          </Text>
        </View>

        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Eco-friendly oil recycling</Text>
          </View>
          <Text style={styles.title}>
            Turn used cooking oil into a cleaner planet
          </Text>
          <Text style={styles.subtitle}>
            Reoil collects used cooking oil from homes and restaurants, keeping
            grease out of drains and turning waste into biofuel.
          </Text>

          <View style={styles.actions}>
            <Link href="/schedule" asChild>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Schedule a pickup</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <LinearGradient
          colors={[colors.dark, colors.primary]}
          style={styles.statsCard}
        >
          <Text style={styles.statsTitle}>Why Reoil?</Text>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statRow}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </LinearGradient>

        <Text style={styles.sectionTitle}>How it works</Text>
        {steps.map((step, index) => (
          <View key={step.title} style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}

        <LinearGradient
          colors={[colors.dark, colors.primary]}
          style={styles.ctaCard}
        >
          <Text style={styles.ctaTitle}>Ready to recycle your oil?</Text>
          <Text style={styles.ctaText}>
            Join homes and restaurants making a difference today.
          </Text>
          <Link href="/schedule" asChild>
            <Pressable style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Get started</Text>
            </Pressable>
          </Link>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 8 },
  logo: { fontSize: 28, fontWeight: "700", color: colors.dark },
  logoAccent: { color: colors.light },
  hero: { marginBottom: 24 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#e8f5e9",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  badgeText: { color: colors.dark, fontWeight: "600", fontSize: 13 },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.dark,
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: { fontSize: 16, color: colors.muted, lineHeight: 24 },
  actions: { marginTop: 20 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  primaryButtonText: { color: colors.white, fontWeight: "700", fontSize: 16 },
  statsCard: { borderRadius: 20, padding: 24, marginBottom: 28 },
  statsTitle: { color: colors.white, fontSize: 18, fontWeight: "600", marginBottom: 12 },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    paddingVertical: 10,
  },
  statLabel: { color: "rgba(255,255,255,0.85)", flex: 1, paddingRight: 12 },
  statValue: { color: colors.white, fontWeight: "700", fontSize: 18 },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.dark,
    textAlign: "center",
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  stepNumberText: { color: colors.white, fontWeight: "700", fontSize: 16 },
  stepTitle: { fontSize: 18, fontWeight: "700", color: colors.dark, marginBottom: 6 },
  stepDescription: { color: colors.muted, lineHeight: 22 },
  ctaCard: { borderRadius: 20, padding: 28, marginTop: 12, alignItems: "center" },
  ctaTitle: { color: colors.white, fontSize: 24, fontWeight: "700", textAlign: "center" },
  ctaText: {
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  ctaButtonText: { color: colors.dark, fontWeight: "700", fontSize: 16 },
});
