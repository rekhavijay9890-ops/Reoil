import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { colors, fonts, radius, shadow } from "../constants/theme";
import { fetchMonthlyReport, type BusinessStats, type MonthlyReport } from "../lib/api";

export default function BusinessDashboardScreen() {
  const { token, user } = useAuth();
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [business, setBusiness] = useState<BusinessStats | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      setLoading(true);
      fetchMonthlyReport(token)
        .then((data) => {
          setReport(data.report);
          setBusiness(data.business);
        })
        .catch(() => {
          setReport(null);
          setBusiness(null);
        })
        .finally(() => setLoading(false));
    }, [token]),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Business dashboard</Text>
        <Text style={styles.subtitle}>{user?.name} — restaurant / hotel account</Text>

        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            <View style={styles.hero}>
              <Text style={styles.heroLabel}>This month</Text>
              <Text style={styles.heroValue}>{business?.thisMonthLiters ?? 0} L collected</Text>
              <Text style={styles.heroSub}>
                {business?.thisMonthPickups ?? 0} pickups · ₹{business?.thisMonthEarnings ?? 0} paid
              </Text>
            </View>

            <View style={styles.row}>
              <View style={styles.card}>
                <Text style={styles.cardValue}>{business?.totalLiters ?? 0} L</Text>
                <Text style={styles.cardLabel}>Total collected</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardValue}>{report?.completed ?? 0}</Text>
                <Text style={styles.cardLabel}>Completed this month</Text>
              </View>
            </View>

            <Text style={styles.section}>Monthly report — {report?.month}</Text>
            <View style={styles.reportCard}>
              <Text style={styles.reportLine}>Pickups booked: {report?.pickups ?? 0}</Text>
              <Text style={styles.reportLine}>Completed: {report?.completed ?? 0}</Text>
              <Text style={styles.reportLine}>Liters: {report?.liters ?? 0} L</Text>
              <Text style={styles.reportEarnings}>Earnings: ₹{report?.earnings ?? 0}</Text>
            </View>

            <PrimaryButton label="Bulk book pickup" onPress={() => router.push("/book?bulk=1")} />
            <View style={{ height: 12 }} />
            <PrimaryButton label="Single pickup" variant="outline" onPress={() => router.push("/book")} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  scroll: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 12 },
  backText: { fontFamily: fonts.bodySemi, color: colors.primary },
  title: { fontSize: 26, fontFamily: fonts.heading, color: colors.dark },
  subtitle: { fontFamily: fonts.body, color: colors.muted, marginBottom: 20 },
  hero: {
    backgroundColor: colors.cardDark,
    borderRadius: radius.xl,
    padding: 22,
    marginBottom: 16,
    ...shadow.card,
  },
  heroLabel: { color: "rgba(255,255,255,0.8)", fontFamily: fonts.body },
  heroValue: { color: colors.white, fontFamily: fonts.heading, fontSize: 28, marginTop: 4 },
  heroSub: { color: colors.lime, fontFamily: fonts.body, marginTop: 8 },
  row: { flexDirection: "row", gap: 12, marginBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardValue: { fontFamily: fonts.heading, fontSize: 22, color: colors.primary },
  cardLabel: { fontFamily: fonts.body, color: colors.muted, marginTop: 4, fontSize: 13 },
  section: { fontFamily: fonts.headingSemi, fontSize: 16, color: colors.dark, marginBottom: 10 },
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportLine: { fontFamily: fonts.body, color: colors.muted, marginBottom: 6 },
  reportEarnings: { fontFamily: fonts.headingSemi, color: colors.dark, fontSize: 18, marginTop: 8 },
});
