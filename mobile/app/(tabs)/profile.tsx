import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { colors, fonts, radius, shadow } from "../../constants/theme";
import { openPhoneCall, openWhatsApp } from "../../lib/contact-actions";

const menuItems = [
  { icon: "👤", label: "Personal information" },
  { icon: "📍", label: "Saved addresses" },
  { icon: "📋", label: "Pickup history" },
  { icon: "₹", label: "Earnings & payments" },
  { icon: "🔔", label: "Notifications" },
  { icon: "💬", label: "Help & support" },
  { icon: "⚙️", label: "Settings" },
];

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.[0] ?? "?"}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? "Guest"}</Text>
          <Text style={styles.phone}>{user?.phone ?? ""}</Text>
          <Text style={styles.email}>{user?.email ?? ""}</Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              style={styles.menuRow}
              onPress={() => {
                if (item.label === "Help & support") {
                  openWhatsApp().catch(() => Alert.alert("WhatsApp", "Could not open WhatsApp."));
                } else if (item.label === "Saved addresses") {
                  router.push("/addresses");
                } else if (item.label === "Pickup history") {
                  router.push("/(tabs)/bookings");
                } else if (item.label === "Earnings & payments") {
                  router.push("/(tabs)/earnings");
                } else if (item.label === "Personal information" && user?.accountType === "business") {
                  router.push("/business");
                } else {
                  Alert.alert(item.label, "More options coming soon.");
                }
              }}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logout} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <Pressable
          style={styles.callBtn}
          onPress={() => openPhoneCall().catch(() => Alert.alert("Call", "Could not start call."))}
        >
          <Text style={styles.callText}>Call support</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: colors.white,
    fontSize: 28,
    fontFamily: fonts.heading,
  },
  name: { fontSize: 22, fontFamily: fonts.heading, color: colors.dark },
  phone: { marginTop: 4, fontFamily: fonts.body, color: colors.muted, fontSize: 14 },
  email: { marginTop: 2, fontFamily: fonts.body, color: colors.primary, fontSize: 13 },
  menu: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadow.soft,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: { fontSize: 18, width: 28 },
  menuLabel: { flex: 1, fontFamily: fonts.bodyMedium, color: colors.dark, fontSize: 15 },
  chevron: { color: colors.muted, fontSize: 20 },
  logout: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 14,
  },
  logoutText: {
    color: colors.danger,
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
  callBtn: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 10,
  },
  callText: {
    color: colors.primary,
    fontFamily: fonts.bodySemi,
    fontSize: 14,
  },
});
