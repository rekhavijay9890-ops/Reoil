import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts, radius } from "../constants/theme";

export function PrimaryButton({
  label,
  onPress,
  loading,
  variant = "primary",
  disabled,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "outline";
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={[styles.base, variant === "outline" && styles.outline, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.label, variant === "outline" && styles.labelOutline]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 15, alignItems: "center" },
  outline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  disabled: { opacity: 0.6 },
  label: { color: colors.white, fontFamily: fonts.bodySemi, fontSize: 16 },
  labelOutline: { color: colors.dark },
});
