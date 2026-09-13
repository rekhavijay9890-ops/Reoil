import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { colors, fonts, radius, shadow } from "../../constants/theme";
import { fetchMyPickups, type PickupRecord } from "../../lib/api";
import { formatPickupType, formatQuantity, formatStatus, matchesTypeFilter, pickupDateLabel } from "../../lib/pickup-display";

const filters = ["All", "Home", "Hotel", "Restaurant", "Commercial"] as const;

export default function BookingsScreen() {
  const { token } = useAuth();
  const [filter, setFilter] = useState<typeof filters[number]>("All");
  const [pickups, setPickups] = useState<PickupRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!token) return;
      setLoading(true);
      fetchMyPickups(token)
        .then(setPickups)
        .catch(() => setPickups([]))
        .finally(() => setLoading(false));
    }, [token]),
  );

  const items = pickups.filter((item) => matchesTypeFilter(item.type, filter));

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.filters}>
        {filters.map((f) => (
          <Pressable
            key={f}
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>No pickups yet. Book your first pickup from Home.</Text>
      ) : (
        items.map((item) => (
          <Pressable key={item.id} onPress={() => router.push(`/track/${item.id}`)}>
            <HistoryCard item={item} />
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

function HistoryCard({ item }: { item: PickupRecord }) {
  const typeLabel = formatPickupType(item.type);
  const icon = typeLabel === "Home" ? "🏠" : typeLabel === "Hotel" ? "🏨" : "🍽️";

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.icon}>{icon}</Text>
          <View>
            <Text style={styles.date}>{pickupDateLabel(item)}</Text>
            <Text style={styles.meta}>{typeLabel} · {formatQuantity(item.quantity)}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.status}>{formatStatus(item.status)}</Text>
        </View>
      </View>
      {item.status === "completed" ? (
        <Text style={styles.earnings}>+ ₹{item.earningsInr}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.muted },
  chipTextActive: { color: colors.white },
  empty: { fontFamily: fonts.body, color: colors.muted, textAlign: "center", marginTop: 24 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: { fontSize: 28 },
  date: { fontFamily: fonts.bodySemi, color: colors.dark, fontSize: 15 },
  meta: { fontFamily: fonts.body, color: colors.muted, fontSize: 13, marginTop: 2 },
  statusBadge: {
    backgroundColor: colors.mint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  status: { fontFamily: fonts.bodySemi, fontSize: 11, color: colors.dark },
  earnings: {
    marginTop: 10,
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.primary,
  },
});
