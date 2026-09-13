import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StepCard } from "../components/StepCard";
import { colors, fonts, radius } from "../constants/theme";
import { stats, steps } from "../lib/content";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.logo}>
          Re<Text style={styles.logoAccent}>oil</Text>
        </Text>

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

        <Link href="/schedule" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Schedule a pickup</Text>
          </Pressable>
        </Link>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Why Reoil?</Text>
          {stats.map((stat, index) => (
            <View
              key={stat.label}
              style={[styles.statRow, index === stats.length - 1 && styles.statRowLast]}
            >
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>How it works</Text>
        {steps.map((step, index) => (
          <StepCard
            key={step.title}
            number={String(index + 1)}
            title={step.title}
            description={step.description}
          />
        ))}

        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to recycle your oil?</Text>
          <Text style={styles.ctaText}>
            Join homes and restaurants making a difference today.
          </Text>
          <Link href="/schedule" asChild>
            <Pressable style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Get started</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  logo: {
    fontSize: 28,
    fontFamily: fonts.heading,
    color: colors.dark,
    marginBottom: 12,
  },
  logoAccent: { color: colors.light },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
  },
  badgeText: {
    color: colors.dark,
    fontFamily: fonts.bodySemi,
    fontSize: 12,
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.heading,
    color: colors.dark,
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.muted,
    lineHeight: 23,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 28,
  },
  primaryButtonText: {
    color: colors.white,
    fontFamily: fonts.bodySemi,
    fontSize: 16,
  },
  statsCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: 22,
    marginBottom: 28,
  },
  statsTitle: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.headingSemi,
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
  },
  statRowLast: { borderBottomWidth: 0 },
  statLabel: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: fonts.body,
    flex: 1,
    paddingRight: 12,
    fontSize: 14,
  },
  statValue: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: fonts.heading,
    color: colors.dark,
    textAlign: "center",
    marginBottom: 16,
  },
  ctaCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: 26,
    marginTop: 8,
    alignItems: "center",
  },
  ctaTitle: {
    color: colors.white,
    fontSize: 22,
    fontFamily: fonts.heading,
    textAlign: "center",
  },
  ctaText: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: fonts.body,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 18,
    lineHeight: 22,
    fontSize: 14,
  },
  ctaButton: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    color: colors.dark,
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
});
