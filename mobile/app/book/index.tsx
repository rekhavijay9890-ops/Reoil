import { router } from "expo-router";
import { useState } from "react";
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
import { PrimaryButton } from "../../components/PrimaryButton";
import { StepIndicator } from "../../components/StepIndicator";
import { colors, fonts, radius, shadow } from "../../constants/theme";
import {
  demoUser,
  quantityOptions,
  sourceTypes,
  timeSlots,
} from "../../lib/demo-data";
import { submitPickup } from "../../lib/api";

function mapTypeForApi(type: string) {
  if (type === "hotel") return "commercial";
  return type;
}

function mapQuantityForApi(value: string) {
  const map: Record<string, string> = {
    "5": "under-5",
    "10": "5-10",
    "20": "10-25",
    "50+": "25+",
  };
  return map[value] ?? "5-10";
}

function nextDates(count = 7) {
  const dates: { label: string; value: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      value: d.toISOString().slice(0, 10),
    });
  }
  return dates;
}

export default function BookPickupScreen() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("home");
  const [quantity, setQuantity] = useState("10");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [name, setName] = useState(demoUser.name);
  const [phone, setPhone] = useState(demoUser.phone.replace(/\s/g, ""));
  const [email, setEmail] = useState(demoUser.email);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);

  const dates = nextDates();

  async function handleConfirm() {
    if (!address || !name || !phone || !email || !date || !timeSlot) {
      Alert.alert("Missing details", "Please complete all fields before confirming.");
      return;
    }

    setLoading(true);
    try {
      await submitPickup({
        name,
        email,
        phone,
        address,
        type: mapTypeForApi(type),
        quantity: mapQuantityForApi(quantity),
        notes: `Preferred: ${date} ${timeSlot}. ${instructions}`.trim(),
      });

      const typeLabel = sourceTypes.find((s) => s.value === type)?.label ?? type;
      const qtyLabel = quantityOptions.find((q) => q.value === quantity)?.label ?? quantity;
      const dateLabel = dates.find((d) => d.value === date)?.label ?? date;

      router.replace({
        pathname: "/book/success",
        params: {
          type: typeLabel,
          quantity: qtyLabel,
          address,
          date: dateLabel,
          time: timeSlot,
        },
      });
    } catch (error) {
      Alert.alert(
        "Booking failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (step === 1 && !type) return;
    if (step === 2 && !quantity) return;
    if (step === 3 && (!address || !name || !phone || !email)) {
      Alert.alert("Contact & address", "Please fill name, phone, email, and address.");
      return;
    }
    if (step === 4) {
      handleConfirm();
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <StepIndicator step={step} />

        {step === 1 && (
          <>
            <Text style={styles.title}>Select source type</Text>
            <Text style={styles.subtitle}>Where is the used oil coming from?</Text>
            {sourceTypes.map((item) => (
              <Pressable
                key={item.value}
                style={[styles.typeCard, type === item.value && styles.typeCardActive]}
                onPress={() => setType(item.value)}
              >
                <Text style={styles.typeIcon}>{item.icon}</Text>
                <View style={styles.typeText}>
                  <Text style={styles.typeLabel}>{item.label}</Text>
                  <Text style={styles.typeDesc}>{item.description}</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>How much oil?</Text>
            <Text style={styles.subtitle}>Select an estimated quantity</Text>
            <View style={styles.qtyVisual}>
              <Text style={styles.oilJug}>🛢️</Text>
              <Text style={styles.qtySelected}>
                {quantityOptions.find((q) => q.value === quantity)?.label ?? quantity}
              </Text>
            </View>
            <View style={styles.chipRow}>
              {quantityOptions.map((item) => (
                <Pressable
                  key={item.value}
                  style={[styles.chip, quantity === item.value && styles.chipActive]}
                  onPress={() => setQuantity(item.value)}
                >
                  <Text style={[styles.chipText, quantity === item.value && styles.chipTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>Pickup location</Text>
            <Text style={styles.subtitle}>Where should we collect the oil?</Text>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapEmoji}>🗺️</Text>
              <Text style={styles.mapText}>Map preview (Phase 2)</Text>
            </View>
            <Field label="Full name" value={name} onChangeText={setName} />
            <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Field label="Pickup address" value={address} onChangeText={setAddress} multiline />
            <Field
              label="Special instructions (optional)"
              value={instructions}
              onChangeText={setInstructions}
              multiline
            />
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.title}>Choose date & time</Text>
            <Text style={styles.subtitle}>We&apos;ll confirm your slot within 24 hours</Text>
            <Text style={styles.fieldLabel}>Preferred date</Text>
            <View style={styles.chipRow}>
              {dates.map((d) => (
                <Pressable
                  key={d.value}
                  style={[styles.dateChip, date === d.value && styles.chipActive]}
                  onPress={() => setDate(d.value)}
                >
                  <Text style={[styles.chipText, date === d.value && styles.chipTextActive]}>
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>Time slot</Text>
            <View style={styles.slotGrid}>
              {timeSlots.map((slot) => (
                <Pressable
                  key={slot}
                  style={[styles.slotChip, timeSlot === slot && styles.chipActive]}
                  onPress={() => setTimeSlot(slot)}
                >
                  <Text style={[styles.slotText, timeSlot === slot && styles.chipTextActive]}>
                    {slot}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <View style={styles.actions}>
          {step > 1 ? (
            <View style={styles.backWrap}>
              <PrimaryButton
                label="Back"
                variant="outline"
                onPress={() => setStep((s) => s - 1)}
              />
            </View>
          ) : null}
          <View style={step > 1 ? styles.nextWrap : styles.nextFull}>
            <PrimaryButton
              label={step === 4 ? "Confirm pickup" : "Continue"}
              onPress={handleNext}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  multiline,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholderTextColor={colors.muted}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontFamily: fonts.heading, color: colors.dark },
  subtitle: {
    fontFamily: fonts.body,
    color: colors.muted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 22,
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadow.soft,
  },
  typeCardActive: { borderColor: colors.primary, backgroundColor: colors.mint },
  typeIcon: { fontSize: 32, marginRight: 14 },
  typeText: { flex: 1 },
  typeLabel: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.dark },
  typeDesc: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  qtyVisual: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  oilJug: { fontSize: 56 },
  qtySelected: {
    marginTop: 8,
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.primary,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.muted },
  chipTextActive: { color: colors.white },
  dateChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: colors.mint,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapEmoji: { fontSize: 36 },
  mapText: { fontFamily: fonts.body, color: colors.muted, marginTop: 6 },
  field: { marginBottom: 14 },
  fieldLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.dark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.text,
  },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },
  slotGrid: { gap: 8, marginBottom: 16 },
  slotChip: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotText: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.dark },
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
  backWrap: { flex: 1 },
  nextWrap: { flex: 2 },
  nextFull: { flex: 1 },
});
