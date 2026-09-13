import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../constants/theme";

export function ScreenHeader({
  title,
  subtitle,
  onNotificationPress,
}: {
  title: string;
  subtitle?: string;
  onNotificationPress?: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Pressable style={styles.bell} onPress={onNotificationPress}>
        <Text style={styles.bellIcon}>🔔</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  textWrap: { flex: 1, paddingRight: 12 },
  title: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.dark,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.muted,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  bellIcon: { fontSize: 18 },
});
