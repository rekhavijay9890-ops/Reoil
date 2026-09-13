import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, shadow } from "../../constants/theme";
import { demoPickupHistory, type PickupHistoryItem } from "../../lib/demo-data";

const filters = ["All", "Home", "Hotel", "Restaurant"] as const;

export default function BookingsScreen() {
  const [filter, setFilter] = useState<typeof filters[number]>("All");

  const items = demoPickupHistory.filter(
    (item) => filter === "All" || item.type === filter,
  );

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

      {items.map((item) => (
        <HistoryCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}

function HistoryCard({ item }: { item: PickupHistoryItem }) {
  const icon = item.type === "Home" ? "🏠" : item.type === "Hotel" ? "🏨" : "🍽️";

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.icon}>{icon}</Text>
          <View>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.meta}>{item.type} · {item.quantity}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.earnings}>+ ₹{item.earnings}</Text>
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
