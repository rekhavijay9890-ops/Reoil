import { Alert, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StepCard } from "../components/StepCard";
import { colors, fonts, radius } from "../constants/theme";
import { openPhoneCall, openWhatsApp } from "../lib/contact-actions";
import { contact } from "../lib/content";

export default function HelpScreen() {
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
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Need help?</Text>
        <Text style={styles.subheading}>
          Chat on WhatsApp or call us for pickup, payout, or schedule questions.
        </Text>

        <StepCard
          number="?"
          title="Contact Reoil"
          description={`We're available ${contact.supportHours.toLowerCase()}.`}
        >
          <Pressable style={styles.whatsappButton} onPress={handleWhatsApp}>
            <Text style={styles.whatsappButtonText}>Chat on WhatsApp</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={handleCall}>
            <Text style={styles.secondaryButtonText}>Call {contact.displayPhone}</Text>
          </Pressable>
          <Text style={styles.supportHours}>{contact.supportHours}</Text>
          <Text style={styles.email}>{contact.email}</Text>
        </StepCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 26, fontFamily: fonts.heading, color: colors.dark },
  subheading: {
    fontFamily: fonts.body,
    color: colors.muted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 22,
  },
  whatsappButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
  },
  whatsappButtonText: {
    color: colors.white,
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.dark,
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
  supportHours: {
    marginTop: 12,
    fontFamily: fonts.body,
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
  },
  email: {
    marginTop: 6,
    fontFamily: fonts.bodyMedium,
    color: colors.primary,
    fontSize: 13,
    textAlign: "center",
  },
});
