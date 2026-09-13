import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "../../components/BarChart";
import { useAuth } from "../../context/AuthContext";
import { colors, fonts, radius, shadow } from "../../constants/theme";
import { fetchMyStats, type CustomerStats } from "../../lib/api";

export default function EarningsScreen() {
  const { token } = useAuth();
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      setLoading(true);
      fetchMyStats(token)
        .then(setStats)
        .catch(() => setStats(null))
        .finally(() => setLoading(false));
    }, [token]),
  );

  if (loading) {
    return <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />;
  }

  const monthly = stats?.monthlyEarnings?.length
    ? stats.monthlyEarnings
    : [{ month: "—", amount: 0 }];

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Earnings</Text>
        <Text style={styles.totalAmount}>
          ₹ {(stats?.totalEarnings ?? 0).toLocaleString("en-IN")}
        </Text>
        <Text style={styles.totalNote}>From completed pickups only</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.litersCollected ?? 0} L</Text>
          <Text style={styles.statLabel}>Total collections</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.totalPickups ?? 0}</Text>
          <Text style={styles.statLabel}>Total pickups</Text>
        </View>
      </View>

      <Text style={styles.chartTitle}>Earnings overview</Text>
      <BarChart data={monthly} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  totalCard: {
    backgroundColor: colors.cardDark,
    borderRadius: radius.xl,
    padding: 24,
    marginBottom: 16,
    ...shadow.card,
  },
  totalLabel: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: fonts.body,
    fontSize: 14,
  },
  totalAmount: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 36,
    marginTop: 6,
  },
  totalNote: {
    color: colors.lime,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 8,
  },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: colors.primary,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: fonts.body,
    color: colors.muted,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: fonts.headingSemi,
    color: colors.dark,
    marginBottom: 12,
  },
});
