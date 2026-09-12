import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, radius, shadow } from "../constants/theme";
import { openPhoneCall, openWhatsApp } from "../lib/contact-actions";
import { contact, payout, propertyTypes, stats, steps } from "../lib/content";

export default function HomeScreen() {
  const [type, setType] = useState("home");
  const [liters, setLiters] = useState("10");

  const rate = payout.rates[type as keyof typeof payout.rates] ?? payout.rates.home;
  const litersNum = Math.max(0, Number.parseFloat(liters) || 0);
  const estimatedPayout = useMemo(() => litersNum * rate, [litersNum, rate]);

  async function handleWhatsApp() {
    try {
      await openWhatsApp();
    } catch {
      Alert.alert("WhatsApp", `Message us at ${contact.displayPhone}`);
    }
  }

  async function handleCall() {
    try {
      await openPhoneCall();
    } catch {
      Alert.alert("Call", `Dial ${contact.displayPhone}`);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>💧</Text>
          </View>
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
          colors={[colors.dark, colors.primary, colors.light]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
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
        <Text style={styles.sectionSubtitle}>
          Three simple steps from your kitchen to clean energy.
        </Text>
        {steps.map((step, index) => (
          <View key={step.title} style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepLabel}>Step {index + 1}</Text>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}

        <View style={styles.stepCard}>
          <Text style={styles.stepLabel}>Payout</Text>
          <Text style={styles.stepTitle}>{payout.title}</Text>
          <Text style={styles.stepDescription}>{payout.subtitle}</Text>

          <View style={styles.chipRow}>
            {propertyTypes.map((item) => (
              <Pressable
                key={item.value}
                style={[styles.chip, type === item.value && styles.chipSelected]}
                onPress={() => setType(item.value)}
              >
                <Text style={[styles.chipText, type === item.value && styles.chipTextSelected]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.rateText}>
            We pay {payout.symbol}{rate} {payout.rateUnit}
          </Text>

          <Text style={styles.inputLabel}>Estimated liters</Text>
          <TextInput
            style={styles.input}
            value={liters}
            onChangeText={setLiters}
            keyboardType="decimal-pad"
            placeholder="e.g. 10"
            placeholderTextColor={colors.muted}
          />

          <View style={styles.payoutBox}>
            <Text style={styles.payoutLabel}>You receive (estimate)</Text>
            <Text style={styles.payoutAmount}>
              {payout.symbol}{estimatedPayout.toFixed(0)}
            </Text>
          </View>
          <Text style={styles.payoutNote}>{payout.note}</Text>
        </View>

        <View style={styles.stepCard}>
          <Text style={styles.stepLabel}>Support</Text>
          <Text style={styles.stepTitle}>Need help?</Text>
          <Text style={styles.stepDescription}>
            Chat on WhatsApp or call us for pickup, payout, or schedule questions.
          </Text>

          <Pressable style={styles.whatsappButton} onPress={handleWhatsApp}>
            <Text style={styles.whatsappButtonText}>💬 Chat on WhatsApp</Text>
          </Pressable>
          <Pressable style={styles.callButton} onPress={handleCall}>
            <Text style={styles.callButtonText}>📞 Call {contact.displayPhone}</Text>
          </Pressable>
          <Text style={styles.supportHours}>{contact.supportHours}</Text>
        </View>

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
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMarkText: { fontSize: 16 },
  logo: {
    fontSize: 26,
    fontFamily: fonts.heading,
    color: colors.dark,
  },
  logoAccent: { color: colors.light },
  hero: { marginBottom: 24 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.mint,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(82, 183, 136, 0.3)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 14,
  },
  badgeText: {
    color: colors.dark,
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.dark,
    lineHeight: 38,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.muted,
    lineHeight: 24,
  },
  actions: { marginTop: 22 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    paddingHorizontal: 22,
    alignItems: "center",
    ...shadow.card,
  },
  primaryButtonText: {
    color: colors.white,
    fontFamily: fonts.bodySemi,
    fontSize: 16,
  },
  statsCard: { borderRadius: radius.xl, padding: 24, marginBottom: 28 },
  statsTitle: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.headingSemi,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
    paddingVertical: 11,
  },
  statLabel: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: fonts.body,
    flex: 1,
    paddingRight: 12,
    fontSize: 14,
  },
  statValue: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 26,
    fontFamily: fonts.heading,
    color: colors.dark,
    textAlign: "center",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 22,
  },
  stepCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  stepNumberText: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 17,
  },
  stepLabel: {
    fontSize: 11,
    fontFamily: fonts.bodySemi,
    color: colors.light,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: fonts.headingSemi,
    color: colors.dark,
    marginBottom: 6,
  },
  stepDescription: {
    fontFamily: fonts.body,
    color: colors.muted,
    lineHeight: 22,
    fontSize: 14,
    marginBottom: 12,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.muted, fontFamily: fonts.bodySemi, fontSize: 13 },
  chipTextSelected: { color: colors.white },
  rateText: {
    fontFamily: fonts.bodyMedium,
    color: colors.primary,
    fontSize: 14,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: fonts.bodySemi,
    color: colors.dark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: fonts.body,
    color: colors.text,
    marginBottom: 12,
  },
  payoutBox: {
    backgroundColor: colors.mint,
    borderRadius: radius.md,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  payoutLabel: { fontFamily: fonts.bodySemi, color: colors.dark, fontSize: 15 },
  payoutAmount: { fontFamily: fonts.heading, color: colors.dark, fontSize: 24 },
  payoutNote: {
    marginTop: 10,
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  whatsappButton: {
    backgroundColor: "#25D366",
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  whatsappButtonText: {
    color: colors.white,
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
  callButton: {
    backgroundColor: colors.mint,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  callButtonText: {
    color: colors.dark,
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
  supportHours: {
    marginTop: 12,
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
  },
  ctaCard: {
    borderRadius: radius.xl,
    padding: 28,
    marginTop: 12,
    alignItems: "center",
  },
  ctaTitle: {
    color: colors.white,
    fontSize: 24,
    fontFamily: fonts.heading,
    textAlign: "center",
  },
  ctaText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: fonts.body,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 22,
    fontSize: 15,
  },
  ctaButton: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 13,
    paddingHorizontal: 26,
  },
  ctaButtonText: {
    color: colors.dark,
    fontFamily: fonts.bodySemi,
    fontSize: 16,
  },
});
