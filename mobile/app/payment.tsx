import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, fonts, radius, shadow } from "../constants/theme";
import { openUpiPayment } from "../lib/contact-actions";
import { payment, propertyTypes } from "../lib/content";

export default function PaymentScreen() {
  const [type, setType] = useState("home");
  const [liters, setLiters] = useState("10");
  const [reference, setReference] = useState("");

  const rate = payment.rates[type as keyof typeof payment.rates] ?? payment.rates.home;
  const litersNum = Math.max(0, Number.parseFloat(liters) || 0);
  const total = useMemo(() => litersNum * rate, [litersNum, rate]);

  async function handlePay() {
    if (litersNum <= 0) {
      Alert.alert("Enter liters", "Please enter how many liters we collected.");
      return;
    }

    const note = reference.trim()
      ? `Reoil pickup ${reference.trim()}`
      : "Reoil oil collection";

    try {
      await openUpiPayment(total, note);
    } catch {
      Alert.alert(
        "Payment",
        `Pay ${payment.symbol}${total.toFixed(0)} to UPI ID: ${payment.upiId}`,
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Pay for collection</Text>
        <Text style={styles.subheading}>{payment.subtitle}</Text>

        <View style={styles.card}>
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
            Rate: {payment.symbol}{rate} {payment.rateUnit}
          </Text>

          <Text style={styles.label}>Liters collected</Text>
          <TextInput
            style={styles.input}
            value={liters}
            onChangeText={setLiters}
            keyboardType="decimal-pad"
            placeholder="e.g. 10"
            placeholderTextColor={colors.muted}
          />

          <Text style={styles.label}>Booking reference (optional)</Text>
          <TextInput
            style={styles.input}
            value={reference}
            onChangeText={setReference}
            placeholder="Your name or booking ID"
            placeholderTextColor={colors.muted}
          />

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Amount due</Text>
            <Text style={styles.totalAmount}>
              {payment.symbol}{total.toFixed(0)}
            </Text>
          </View>

          <Pressable style={styles.payButton} onPress={handlePay}>
            <Text style={styles.payButtonText}>Pay with UPI</Text>
          </Pressable>

          <Text style={styles.cashNote}>{payment.cashNote}</Text>
          <Text style={styles.upiId}>UPI ID: {payment.upiId}</Text>
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
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
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
  totalBox: {
    backgroundColor: colors.mint,
    borderRadius: radius.md,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: { fontFamily: fonts.bodySemi, color: colors.dark, fontSize: 16 },
  totalAmount: { fontFamily: fonts.heading, color: colors.dark, fontSize: 28 },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: "center",
  },
  payButtonText: { color: colors.white, fontFamily: fonts.bodySemi, fontSize: 16 },
  cashNote: {
    marginTop: 14,
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  upiId: {
    marginTop: 6,
    fontFamily: fonts.bodyMedium,
    color: colors.primary,
    fontSize: 13,
    textAlign: "center",
  },
});
