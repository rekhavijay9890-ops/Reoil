import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StepCard } from "../components/StepCard";
import { colors, fonts, radius } from "../constants/theme";
import { payout, propertyTypes } from "../lib/content";

export default function PayoutScreen() {
  const [type, setType] = useState("home");
  const [liters, setLiters] = useState("10");

  const rate = payout.rates[type as keyof typeof payout.rates] ?? payout.rates.home;
  const litersNum = Math.max(0, Number.parseFloat(liters) || 0);
  const estimatedPayout = useMemo(() => litersNum * rate, [litersNum, rate]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>{payout.title}</Text>
        <Text style={styles.subheading}>{payout.subtitle}</Text>

        <StepCard number="₹" title="Estimate your payout" description={payout.note}>
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

        <Text style={styles.sectionTitle}>How payout works</Text>
        {payout.flow.map((step) => (
          <StepCard
            key={step.step}
            number={String(step.step)}
            title={step.title}
            description={step.description}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 26, fontFamily: fonts.heading, color: colors.dark },
  subheading: {
    fontFamily: fonts.body,
    color: colors.muted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.dark,
    marginTop: 8,
    marginBottom: 12,
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
});
