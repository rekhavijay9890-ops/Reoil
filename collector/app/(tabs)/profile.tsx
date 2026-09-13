import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { colors, fonts, radius } from "../../constants/theme";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
        <Text style={styles.role}>Delivery collector</Text>
      </View>
      <PrimaryButton label="Logout" variant="outline" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, padding: 20 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: { fontSize: 22, fontFamily: fonts.heading, color: colors.dark },
  phone: { marginTop: 4, fontFamily: fonts.body, color: colors.muted },
  role: { marginTop: 8, fontFamily: fonts.bodySemi, color: colors.primary },
});
