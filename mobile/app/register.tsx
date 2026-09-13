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
import { useAuth } from "../context/AuthContext";
import { colors, fonts, radius } from "../constants/theme";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isBusiness, setIsBusiness] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    try {
      await signUp({
        name,
        phone,
        email,
        password,
        accountType: isBusiness ? "business" : "home",
      });
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert("Registration failed", error instanceof Error ? error.message : "Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join Reoil and start earning from your used oil</Text>

          <Field label="Full name" value={name} onChangeText={setName} />
          <Field label="Mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />

          <Pressable style={styles.businessRow} onPress={() => setIsBusiness((v) => !v)}>
            <Text style={styles.checkbox}>{isBusiness ? "☑" : "☐"}</Text>
            <Text style={styles.businessText}>I run a restaurant or hotel (business account)</Text>
          </Pressable>

          <PrimaryButton label="Create account" onPress={handleRegister} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text style={styles.link}>Login</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={colors.muted}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 28, fontFamily: fonts.heading, color: colors.dark },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontFamily: fonts.body,
    color: colors.muted,
    lineHeight: 22,
  },
  field: { marginBottom: 14 },
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
    color: colors.text,
  },
  businessRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 10 },
  checkbox: { fontSize: 18 },
  businessText: { flex: 1, fontFamily: fonts.body, color: colors.dark, fontSize: 14 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { fontFamily: fonts.body, color: colors.muted },
  link: { fontFamily: fonts.bodySemi, color: colors.primary },
});
