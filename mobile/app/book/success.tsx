import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../../components/PrimaryButton";
import { colors, fonts, radius, shadow } from "../../constants/theme";

export default function BookingSuccessScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    type?: string;
    quantity?: string;
    address?: string;
    date?: string;
    time?: string;
  }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Text style={styles.check}>✓</Text>
        </View>
        <Text style={styles.title}>Pickup Confirmed</Text>
        <Text style={styles.subtitle}>
          We&apos;ll contact you within 24 hours to confirm your collection time.
        </Text>

        <View style={styles.summary}>
          <SummaryRow label="Source" value={params.type ?? "—"} />
          <SummaryRow label="Quantity" value={params.quantity ?? "—"} />
          <SummaryRow label="Date" value={params.date ?? "—"} />
          <SummaryRow label="Time" value={params.time ?? "—"} />
          <SummaryRow label="Address" value={params.address ?? "—"} />
        </View>

        <PrimaryButton
          label="Track pickup"
          onPress={() => {
            if (params.id) {
              router.replace(`/track/${params.id}`);
            } else {
              router.replace("/(tabs)/bookings");
            }
          }}
        />
        <View style={{ height: 12 }} />
        <PrimaryButton
          label="Back to home"
          variant="outline"
          onPress={() => router.replace("/(tabs)/home")}
        />
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  check: { color: colors.white, fontSize: 36, fontFamily: fonts.heading },
  title: {
    fontSize: 26,
    fontFamily: fonts.heading,
    color: colors.dark,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fonts.body,
    color: colors.muted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 22,
  },
  summary: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  rowLabel: { fontFamily: fonts.body, color: colors.muted, fontSize: 14, flex: 1 },
  rowValue: {
    fontFamily: fonts.bodySemi,
    color: colors.dark,
    fontSize: 14,
    flex: 1.2,
    textAlign: "right",
  },
});
