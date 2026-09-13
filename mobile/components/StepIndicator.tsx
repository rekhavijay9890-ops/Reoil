import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius } from "../constants/theme";

export function StepIndicator({ step, total = 4 }: { step: number; total?: number }) {
  return (
    <View style={styles.wrap}>
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <View key={n} style={styles.item}>
            <View
              style={[
                styles.circle,
                active && styles.circleActive,
                done && styles.circleDone,
              ]}
            >
              <Text style={[styles.num, (active || done) && styles.numActive]}>{n}</Text>
            </View>
            {i < total - 1 ? (
              <View style={[styles.line, done && styles.lineDone]} />
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  item: { flexDirection: "row", alignItems: "center" },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  circleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  circleDone: {
    borderColor: colors.light,
    backgroundColor: colors.light,
  },
  num: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.muted,
  },
  numActive: { color: colors.white },
  line: {
    width: 28,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  lineDone: { backgroundColor: colors.light },
});
