import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, radius, shadow } from "../../constants/theme";
import { demoUser } from "../../lib/demo-data";
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
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{demoUser.name[0]}</Text>
          </View>
          <Text style={styles.name}>{demoUser.name}</Text>
          <Text style={styles.phone}>{demoUser.phone}</Text>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              style={styles.menuRow}
              onPress={() => {
                if (item.label === "Help & support") {
                  openWhatsApp().catch(() => Alert.alert("WhatsApp", "Could not open WhatsApp."));
                } else {
                  Alert.alert(item.label, "Available in Phase 2 with login & saved data.");
                }
              }}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.logout}
          onPress={() => Alert.alert("Logout", "Login is skipped in Phase 1.")}
        >
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
