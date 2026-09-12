import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, shadow } from "../constants/theme";
import { openPhoneCall, openWhatsApp } from "../lib/contact-actions";
import { contact } from "../lib/content";

export default function ContactScreen() {
  async function handleWhatsApp() {
    try {
      await openWhatsApp();
    } catch {
      Alert.alert("WhatsApp", `Message us at ${contact.displayPhone}`);
    }
  }

  async function handleCall() {
    try {
      await openPhoneCall();
    } catch {
      Alert.alert("Call", `Dial ${contact.displayPhone}`);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.heading}>Contact us</Text>
      <Text style={styles.subheading}>
        Need help with a pickup, payment, or schedule change? Reach our team directly.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick support</Text>
        <Text style={styles.cardText}>
          Our team typically replies within a few hours during business hours.
        </Text>

        <Pressable style={styles.whatsappButton} onPress={handleWhatsApp}>
          <Text style={styles.buttonIcon}>💬</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitle}>Chat on WhatsApp</Text>
            <Text style={styles.buttonSubtitle}>Fastest way to get help</Text>
          </View>
        </Pressable>

        <Pressable style={styles.callButton} onPress={handleCall}>
          <Text style={styles.buttonIcon}>📞</Text>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitleDark}>Call us</Text>
            <Text style={styles.buttonSubtitleDark}>{contact.displayPhone}</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Support hours</Text>
        <Text style={styles.infoValue}>{contact.supportHours}</Text>

        <Text style={[styles.infoLabel, { marginTop: 16 }]}>Email</Text>
        <Text style={styles.infoValue}>{contact.email}</Text>
      </View>

      <Text style={styles.footerNote}>
        For emergencies during pickup, call us directly so we can assist immediately.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  heading: {
    fontSize: 28,
    fontFamily: fonts.heading,
    color: colors.dark,
    marginBottom: 6,
  },
  subheading: {
    fontFamily: fonts.body,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadow.card,
  },
  cardTitle: {
    fontFamily: fonts.headingSemi,
    fontSize: 18,
    color: colors.dark,
    marginBottom: 6,
  },
  cardText: {
    fontFamily: fonts.body,
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 16,
    fontSize: 14,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25D366",
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mint,
    borderRadius: radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  buttonIcon: { fontSize: 28 },
  buttonContent: { flex: 1 },
  buttonTitle: {
    fontFamily: fonts.bodySemi,
    color: colors.white,
    fontSize: 16,
  },
  buttonSubtitle: {
    fontFamily: fonts.body,
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    marginTop: 2,
  },
  buttonTitleDark: {
    fontFamily: fonts.bodySemi,
    color: colors.dark,
    fontSize: 16,
  },
  buttonSubtitleDark: {
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  infoLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.dark,
    marginTop: 4,
  },
  footerNote: {
    marginTop: 20,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    textAlign: "center",
  },
});
