import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { colors, fonts, radius } from "../constants/theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    try {
      await signIn(phone, password);
      router.replace("/(tabs)/jobs");
    } catch (error) {
      Alert.alert("Login failed", error instanceof Error ? error.message : "Try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Text style={styles.title}>Collector login</Text>
        <Text style={styles.sub}>Sign in to see your assigned pickups</Text>
        <Text style={styles.label}>Mobile number</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        <PrimaryButton label="Sign in" onPress={handleLogin} loading={loading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontFamily: fonts.heading, color: colors.dark },
  sub: { marginTop: 8, marginBottom: 24, fontFamily: fonts.body, color: colors.muted },
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
});
