import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius } from "../constants/theme";

export function BarChart({
  data,
}: {
  data: { month: string; amount: number }[];
}) {
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <View style={styles.wrap}>
      <View style={styles.bars}>
        {data.map((item) => {
          const height = Math.max(12, (item.amount / max) * 120);
          return (
            <View key={item.month} style={styles.col}>
              <View style={[styles.bar, { height }]} />
              <Text style={styles.month}>{item.month}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 150,
    paddingTop: 8,
  },
  col: { flex: 1, alignItems: "center" },
  bar: {
    width: 22,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    marginBottom: 8,
  },
  month: {
    fontSize: 10,
    fontFamily: fonts.body,
    color: colors.muted,
  },
});
