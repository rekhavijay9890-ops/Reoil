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
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Login failed", error instanceof Error ? error.message : "Try again.");
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
        <Text style={styles.logo}>
          Re<Text style={styles.logoAccent}>oil</Text>
        </Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in with your mobile number</Text>

        <Text style={styles.label}>Mobile number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="9876543210"
          placeholderTextColor={colors.muted}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Your password"
          placeholderTextColor={colors.muted}
        />

        <PrimaryButton label="Login" onPress={handleLogin} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to Reoil? </Text>
          <Link href="/register" asChild>
            <Pressable>
              <Text style={styles.link}>Create account</Text>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  container: { flex: 1, padding: 24, justifyContent: "center" },
  logo: { fontSize: 36, fontFamily: fonts.heading, color: colors.dark, textAlign: "center" },
  logoAccent: { color: colors.light },
  title: {
    marginTop: 24,
    fontSize: 28,
    fontFamily: fonts.heading,
    color: colors.dark,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontFamily: fonts.body,
    color: colors.muted,
    textAlign: "center",
  },
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
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { fontFamily: fonts.body, color: colors.muted },
  link: { fontFamily: fonts.bodySemi, color: colors.primary },
});
