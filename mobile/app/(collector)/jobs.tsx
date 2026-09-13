import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { fetchCollectorJobs, type CollectorJob } from "../../lib/api";
import { colors, fonts, radius, shadow } from "../../constants/theme";

const STATUS_LABELS: Record<string, string> = {
  assigned: "Ready to start",
  on_the_way: "On the way",
  collected: "Collected",
};

export default function CollectorJobsScreen() {
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState<CollectorJob[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    fetchCollectorJobs(token)
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [token]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0] ?? "Collector"}</Text>
      <Text style={styles.sub}>{jobs.length} active job{jobs.length === 1 ? "" : "s"}</Text>

      {loading && jobs.length === 0 ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : jobs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No jobs assigned yet.</Text>
          <Text style={styles.emptySub}>Admin will assign pickups to you.</Text>
        </View>
      ) : (
        jobs.map((job) => (
          <Pressable
            key={job.id}
            style={styles.card}
            onPress={() => router.push(`/collector-job/${job.id}`)}
          >
            <View style={styles.cardTop}>
              <Text style={styles.customer}>{job.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{STATUS_LABELS[job.status] ?? job.status}</Text>
              </View>
            </View>
            <Text style={styles.meta}>{job.type} · {job.quantity}</Text>
            <Text style={styles.address}>{job.address}</Text>
            {job.preferredDate ? (
              <Text style={styles.time}>
                {job.preferredDate}{job.preferredTime ? ` · ${job.preferredTime}` : ""}
              </Text>
            ) : null}
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  greeting: { fontSize: 22, fontFamily: fonts.heading, color: colors.dark },
  sub: { fontFamily: fonts.body, color: colors.muted, marginBottom: 20, marginTop: 4 },
  empty: { marginTop: 40, alignItems: "center" },
  emptyText: { fontFamily: fonts.bodySemi, color: colors.dark, fontSize: 16 },
  emptySub: { fontFamily: fonts.body, color: colors.muted, marginTop: 6, textAlign: "center" },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  customer: { fontFamily: fonts.bodySemi, fontSize: 16, color: colors.dark, flex: 1 },
  badge: { backgroundColor: colors.mint, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  badgeText: { fontFamily: fonts.bodySemi, fontSize: 11, color: colors.dark },
  meta: { marginTop: 6, fontFamily: fonts.body, color: colors.muted, fontSize: 13 },
  address: { marginTop: 6, fontFamily: fonts.body, color: colors.text, lineHeight: 20 },
  time: { marginTop: 6, fontFamily: fonts.bodySemi, color: colors.primary, fontSize: 13 },
});
