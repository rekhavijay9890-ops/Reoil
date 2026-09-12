import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { colors, fonts, radius, shadow } from "../constants/theme";
import { payout, propertyTypes } from "../lib/content";

export default function PaymentScreen() {
  const [type, setType] = useState("home");
  const [liters, setLiters] = useState("10");
  const [method, setMethod] = useState("cash");

  const rate = payout.rates[type as keyof typeof payout.rates] ?? payout.rates.home;
  const litersNum = Math.max(0, Number.parseFloat(liters) || 0);
  const total = useMemo(() => litersNum * rate, [litersNum, rate]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>{payout.title}</Text>
        <Text style={styles.subheading}>{payout.subtitle}</Text>

        <View style={styles.flowCard}>
          {payout.flow.map((item, index) => (
            <View
              key={item.step}
              style={[styles.flowRow, index === payout.flow.length - 1 && styles.flowRowLast]}
            >
              <View style={styles.flowNumber}>
                <Text style={styles.flowNumberText}>{item.step}</Text>
              </View>
              <View style={styles.flowContent}>
                <Text style={styles.flowTitle}>{item.title}</Text>
                <Text style={styles.flowDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estimate your payout</Text>

          <Text style={styles.label}>Property type</Text>
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

          <Text style={styles.label}>Estimated liters of oil</Text>
          <TextInput
            style={styles.input}
            value={liters}
            onChangeText={setLiters}
            keyboardType="decimal-pad"
            placeholder="e.g. 10"
            placeholderTextColor={colors.muted}
          />

          <Text style={styles.label}>How would you like to be paid?</Text>
          <View style={styles.methodRow}>
            {payout.methods.map((item) => (
              <Pressable
                key={item.value}
                style={[styles.methodCard, method === item.value && styles.methodCardSelected]}
                onPress={() => setMethod(item.value)}
              >
                <Text style={[styles.methodLabel, method === item.value && styles.methodLabelSelected]}>
                  {item.label}
                </Text>
                <Text style={[styles.methodDesc, method === item.value && styles.methodDescSelected]}>
                  {item.description}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>You receive (estimate)</Text>
            <Text style={styles.totalAmount}>
              {payout.symbol}{total.toFixed(0)}
            </Text>
          </View>

          <Link href="/schedule" asChild>
            <Pressable style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Schedule pickup & get paid</Text>
            </Pressable>
          </Link>

          <Text style={styles.note}>{payout.note}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  heading: {
    fontSize: 28,
    fontFamily: fonts.heading,
    color: colors.dark,
    marginBottom: 6,
  },
  subheading: {
    fontFamily: fonts.body,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  flowCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  flowRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  flowRowLast: { borderBottomWidth: 0 },
  flowNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  flowNumberText: {
    fontFamily: fonts.heading,
    color: colors.primary,
    fontSize: 14,
  },
  flowContent: { flex: 1 },
  flowTitle: {
    fontFamily: fonts.bodySemi,
    color: colors.dark,
    fontSize: 15,
  },
  flowDescription: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  cardTitle: {
    fontFamily: fonts.headingSemi,
    fontSize: 18,
    color: colors.dark,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.bodySemi,
    color: colors.dark,
    marginBottom: 8,
    marginTop: 4,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
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
    marginBottom: 16,
    fontSize: 14,
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
  methodRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  methodCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    backgroundColor: colors.cream,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.mint,
  },
  methodLabel: {
    fontFamily: fonts.bodySemi,
    color: colors.dark,
    fontSize: 15,
  },
  methodLabelSelected: { color: colors.primary },
  methodDesc: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  methodDescSelected: { color: colors.dark },
  totalBox: {
    backgroundColor: colors.mint,
    borderRadius: radius.md,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: { fontFamily: fonts.bodySemi, color: colors.dark, fontSize: 16 },
  totalAmount: { fontFamily: fonts.heading, color: colors.dark, fontSize: 28 },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: "center",
  },
  ctaButtonText: { color: colors.white, fontFamily: fonts.bodySemi, fontSize: 16 },
  note: {
    marginTop: 14,
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
