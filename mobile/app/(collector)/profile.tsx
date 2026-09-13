import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { colors, fonts, radius, shadow } from "../../constants/theme";

export default function CollectorProfileScreen() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace("/login-collector");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🚚</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
        <Text style={styles.role}>Delivery collector</Text>
      </View>
      <PrimaryButton label="Logout" variant="outline" onPress={handleLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream, padding: 20 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 32 },
  name: { fontSize: 22, fontFamily: fonts.heading, color: colors.dark },
  phone: { marginTop: 4, fontFamily: fonts.body, color: colors.muted },
  role: { marginTop: 8, fontFamily: fonts.bodySemi, color: colors.primary },
});
