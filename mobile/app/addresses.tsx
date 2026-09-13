import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { colors, fonts, radius, shadow } from "../constants/theme";
import { deleteAddress, fetchAddresses, saveAddress, type AddressRecord } from "../lib/api";

export default function AddressesScreen() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<AddressRecord[]>([]);
  const [label, setLabel] = useState("Home");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      fetchAddresses(token).then(setAddresses).catch(() => setAddresses([]));
    }, [token]),
  );

  async function handleAdd() {
    if (!token || !address.trim()) {
      Alert.alert("Address required", "Enter a full pickup address.");
      return;
    }
    setLoading(true);
    try {
      const saved = await saveAddress(token, { label, address: address.trim() });
      setAddresses((prev) => [saved, ...prev]);
      setAddress("");
    } catch (error) {
      Alert.alert("Failed", error instanceof Error ? error.message : "Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    try {
      await deleteAddress(token, id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      Alert.alert("Failed to delete address");
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Saved addresses</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Label</Text>
          <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholder="Home, Restaurant..." />
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={address}
            onChangeText={setAddress}
            multiline
            placeholder="Full street address"
          />
          <PrimaryButton label="Save address" onPress={handleAdd} loading={loading} />
        </View>

        {addresses.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardAddress}>{item.address}</Text>
            <Pressable onPress={() => handleDelete(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 12 },
  backText: { fontFamily: fonts.bodySemi, color: colors.primary },
  title: { fontSize: 26, fontFamily: fonts.heading, color: colors.dark, marginBottom: 16 },
  form: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  label: { fontFamily: fonts.bodySemi, color: colors.dark, marginBottom: 6 },
  input: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    marginBottom: 12,
    color: colors.text,
  },
  multiline: { minHeight: 80, textAlignVertical: "top" },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLabel: { fontFamily: fonts.bodySemi, color: colors.dark, fontSize: 15 },
  cardAddress: { fontFamily: fonts.body, color: colors.muted, marginTop: 4, lineHeight: 20 },
  delete: { marginTop: 10, color: colors.danger, fontFamily: fonts.bodySemi },
});
