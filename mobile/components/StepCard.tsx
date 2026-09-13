import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius, shadow } from "../constants/theme";

export function StepCard({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.number}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 12,
    ...shadow.card,
  },
  number: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  numberText: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontFamily: fonts.headingSemi,
    color: colors.dark,
    marginBottom: 6,
  },
  description: {
    fontFamily: fonts.body,
    color: colors.muted,
    lineHeight: 22,
    fontSize: 14,
    marginBottom: 4,
  },
});
