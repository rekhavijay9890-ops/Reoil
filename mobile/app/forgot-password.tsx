import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";
import { resetPassword } from "../lib/api";
import { colors, fonts, radius } from "../constants/theme";

export default function ForgotPasswordScreen() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    try {
      await resetPassword({ phone, email, newPassword });
      Alert.alert("Password updated", "You can now log in with your new password.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (error) {
      Alert.alert("Reset failed", error instanceof Error ? error.message : "Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          Enter your registered phone and email to set a new password.
        </Text>

        <Text style={styles.label}>Mobile number</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>New password</Text>
        <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry />

        <PrimaryButton label="Update password" onPress={handleReset} loading={loading} />

        <Link href="/login" asChild>
          <Pressable style={styles.back}>
            <Text style={styles.link}>Back to login</Text>
          </Pressable>
        </Link>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontFamily: fonts.heading, color: colors.dark },
  subtitle: { marginTop: 8, marginBottom: 24, fontFamily: fonts.body, color: colors.muted, lineHeight: 22 },
  label: { fontFamily: fonts.bodySemi, color: colors.dark, marginBottom: 6 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: fonts.body,
    fontSize: 16,
    marginBottom: 14,
    color: colors.text,
  },
  back: { marginTop: 20, alignItems: "center" },
  link: { fontFamily: fonts.bodySemi, color: colors.primary },
});
