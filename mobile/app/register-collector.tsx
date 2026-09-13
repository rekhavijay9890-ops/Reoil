import { Link, router } from "expo-router";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";
import { StepIndicator } from "../components/StepIndicator";
import { registerCollector } from "../lib/api";
import { colors, fonts, radius } from "../constants/theme";

const VEHICLES = [
  { id: "bike", label: "Bike", icon: "🏍️" },
  { id: "scooter", label: "Scooter", icon: "🛵" },
  { id: "van", label: "Van / tempo", icon: "🚐" },
  { id: "car", label: "Car", icon: "🚗" },
];

export default function RegisterCollectorScreen() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const result = await registerCollector({
        name,
        phone,
        password,
        city,
        vehicleType,
      });
      Alert.alert("Application submitted", result.message, [
        { text: "OK", onPress: () => router.replace("/login-collector") },
      ]);
    } catch (error) {
      Alert.alert("Failed", error instanceof Error ? error.message : "Try again");
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (step === 1 && (!name.trim() || !phone.trim() || !city.trim())) {
      Alert.alert("Required", "Enter your name, phone, and city.");
      return;
    }
    if (step === 2 && !vehicleType) {
      Alert.alert("Required", "Select your vehicle type.");
      return;
    }
    if (step === 3) {
      submit();
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.icon}>🚚</Text>
          <Text style={styles.title}>Join as delivery partner</Text>
          <Text style={styles.subtitle}>Apply to collect used cooking oil in your area</Text>

          <StepIndicator step={step} total={3} />

          {step === 1 && (
            <>
              <Field label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
              <Field label="Mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="9876543210" />
              <Field label="City / area" value={city} onChangeText={setCity} placeholder="e.g. Delhi, Noida" />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>How do you travel for pickups?</Text>
              {VEHICLES.map((v) => (
                <Pressable
                  key={v.id}
                  style={[styles.vehicleCard, vehicleType === v.id && styles.vehicleCardOn]}
                  onPress={() => setVehicleType(v.id)}
                >
                  <Text style={styles.vehicleIcon}>{v.icon}</Text>
                  <Text style={styles.vehicleLabel}>{v.label}</Text>
                </Pressable>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.reviewTitle}>Almost done</Text>
              <Text style={styles.reviewLine}>{name} · {phone}</Text>
              <Text style={styles.reviewLine}>{city} · {VEHICLES.find((v) => v.id === vehicleType)?.label}</Text>
              <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <Field label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
              <Text style={styles.hint}>
                Admin will review your application. You can log in after approval.
              </Text>
            </>
          )}

          <View style={styles.actions}>
            {step > 1 ? (
              <View style={styles.backWrap}>
                <PrimaryButton label="Back" variant="outline" onPress={() => setStep((s) => s - 1)} />
              </View>
            ) : null}
            <View style={step > 1 ? styles.nextWrap : styles.nextFull}>
              <PrimaryButton
                label={step === 3 ? "Submit application" : "Continue"}
                onPress={next}
                loading={loading}
              />
            </View>
          </View>

          <Link href="/login-collector" asChild>
            <Pressable style={styles.footer}>
              <Text style={styles.link}>Already applied? Sign in</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad";
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40 },
  icon: { fontSize: 40, textAlign: "center" },
  title: { fontSize: 26, fontFamily: fonts.heading, color: colors.dark, textAlign: "center", marginTop: 8 },
  subtitle: { fontFamily: fonts.body, color: colors.muted, textAlign: "center", marginTop: 6, marginBottom: 8, lineHeight: 22 },
  label: { fontFamily: fonts.bodySemi, color: colors.dark, marginBottom: 6 },
  field: { marginBottom: 14 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
  },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 10,
  },
  vehicleCardOn: { borderColor: colors.primary, backgroundColor: colors.mint },
  vehicleIcon: { fontSize: 28, marginRight: 14 },
  vehicleLabel: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.dark },
  reviewTitle: { fontFamily: fonts.headingSemi, fontSize: 18, color: colors.dark, marginBottom: 8 },
  reviewLine: { fontFamily: fonts.body, color: colors.muted, marginBottom: 4 },
  hint: { fontFamily: fonts.body, color: colors.muted, fontSize: 13, lineHeight: 20, marginBottom: 8 },
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
  backWrap: { flex: 1 },
  nextWrap: { flex: 2 },
  nextFull: { flex: 1 },
  footer: { alignItems: "center", marginTop: 20 },
  link: { fontFamily: fonts.bodySemi, color: colors.primary },
});
