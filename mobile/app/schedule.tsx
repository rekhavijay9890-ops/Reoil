import { useState } from "react";
import {
  ActivityIndicator,
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
import { submitPickup } from "../lib/api";
import { propertyTypes, quantities } from "../lib/content";
import { colors, fonts, radius, shadow } from "../constants/theme";

export default function ScheduleScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("home");
  const [quantity, setQuantity] = useState("5-10");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!name || !email || !phone || !address) {
      Alert.alert("Missing fields", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await submitPickup({ name, email, phone, address, type, quantity, notes });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setNotes("");
      setType("home");
      setQuantity("5-10");
    } catch (error) {
      Alert.alert(
        "Request failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Pickup requested!</Text>
        <Text style={styles.successText}>
          We&apos;ll contact you within 24 hours to confirm your collection time.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => setSuccess(false)}>
          <Text style={styles.primaryButtonText}>Book another pickup</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Book your oil pickup</Text>
        <Text style={styles.subheading}>
          Free collection for homes and restaurants. We&apos;ll confirm within 24 hours.
        </Text>

        <View style={styles.formCard}>
        <Field label="Full name" value={name} onChangeText={setName} />
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field
          label="Pickup address"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <Text style={styles.label}>Property type</Text>
        <View style={styles.chipRow}>
          {propertyTypes.map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              selected={type === item.value}
              onPress={() => setType(item.value)}
            />
          ))}
        </View>

        <Text style={styles.label}>Estimated quantity</Text>
        <View style={styles.chipRow}>
          {quantities.map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              selected={quantity === item.value}
              onPress={() => setQuantity(item.value)}
            />
          ))}
        </View>

        <Field
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <Pressable
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.primaryButtonText}>Request pickup</Text>
          )}
        </Pressable>
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
  onChangeText: (value: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
      />
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    ...shadow.card,
  },
  heading: { fontSize: 26, fontFamily: fonts.heading, color: colors.dark },
  subheading: {
    fontFamily: fonts.body,
    color: colors.muted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 22,
  },
  field: { marginBottom: 14 },
  label: {
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
  },
  inputMultiline: { minHeight: 80, textAlignVertical: "top" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.muted, fontFamily: fonts.bodySemi, fontSize: 13 },
  chipTextSelected: { color: colors.white },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  primaryButtonText: {
    color: colors.white,
    fontFamily: fonts.bodySemi,
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successIcon: {
    width: 56,
    height: 56,
    lineHeight: 56,
    textAlign: "center",
    fontSize: 28,
    color: colors.white,
    backgroundColor: colors.light,
    borderRadius: 28,
    marginBottom: 16,
    overflow: "hidden",
  },
  successTitle: { fontSize: 24, fontFamily: fonts.heading, color: colors.dark },
  successText: {
    fontFamily: fonts.body,
    color: colors.muted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },
});
