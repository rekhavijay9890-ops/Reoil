import { Link } from "expo-router";
import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, radius, shadow } from "../constants/theme";
import { contact, payout, propertyTypes, stats, steps } from "../lib/content";

async function openWhatsApp() {
  const url = `whatsapp://send?phone=${contact.whatsapp}&text=${encodeURIComponent(contact.whatsappMessage)}`;
  const webUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`;
  const canOpen = await Linking.canOpenURL(url);
  await Linking.openURL(canOpen ? url : webUrl);
}

async function openPhoneCall() {
  const url = `tel:${contact.phone}`;
  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    Alert.alert("Cannot call", `Dial ${contact.displayPhone} from your phone.`);
    return;
  }
  await Linking.openURL(url);
}

function StepCard({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
      {children}
    </View>
  );
}

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [supportY, setSupportY] = useState(0);
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

  function scrollToSupport() {
    scrollRef.current?.scrollTo({ y: supportY - 20, animated: true });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            Re<Text style={styles.logoAccent}>oil</Text>
          </Text>
          <Pressable style={styles.settingsButton} onPress={scrollToSupport}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </Pressable>
        </View>

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

        <StepCard
          number="₹"
          title={payout.title}
          description={payout.subtitle}
        >
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
            <Text style={styles.payoutLabel}>You receive</Text>
            <Text style={styles.payoutAmount}>
              {payout.symbol}{estimatedPayout.toFixed(0)}
            </Text>
          </View>
        </StepCard>

        <View onLayout={(e) => setSupportY(e.nativeEvent.layout.y)}>
          <StepCard
            number="?"
            title="Need help?"
            description="Chat on WhatsApp or call us for pickup, payout, or schedule questions."
          >
            <Pressable style={styles.whatsappButton} onPress={handleWhatsApp}>
              <Text style={styles.whatsappButtonText}>Chat on WhatsApp</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={handleCall}>
              <Text style={styles.secondaryButtonText}>Call {contact.displayPhone}</Text>
            </Pressable>
            <Text style={styles.supportHours}>{contact.supportHours}</Text>
          </StepCard>
        </View>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logo: {
    fontSize: 28,
    fontFamily: fonts.heading,
    color: colors.dark,
  },
  logoAccent: { color: colors.light },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIcon: { fontSize: 18, color: colors.muted },
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
  stepCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 12,
    ...shadow.card,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  stepNumberText: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  stepTitle: {
    fontSize: 17,
    fontFamily: fonts.headingSemi,
    color: colors.dark,
    marginBottom: 6,
  },
  stepDescription: {
    fontFamily: fonts.body,
    color: colors.muted,
    lineHeight: 22,
    fontSize: 14,
    marginBottom: 4,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12, marginBottom: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.muted, fontFamily: fonts.bodySemi, fontSize: 12 },
  chipTextSelected: { color: colors.white },
  rateText: {
    fontFamily: fonts.bodyMedium,
    color: colors.primary,
    fontSize: 13,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 13,
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
    paddingVertical: 11,
    fontSize: 15,
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
    marginTop: 4,
  },
  payoutLabel: { fontFamily: fonts.bodySemi, color: colors.dark, fontSize: 14 },
  payoutAmount: { fontFamily: fonts.heading, color: colors.dark, fontSize: 22 },
  whatsappButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
  },
  whatsappButtonText: {
    color: colors.white,
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
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
