import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../constants/theme";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoIcon}>💧</Text>
      </View>
      <Text style={styles.logo}>
        Re<Text style={styles.logoAccent}>oil</Text>
      </Text>
      <Text style={styles.tagline}>Collect. Recycle. Reuse.</Text>
      <Text style={styles.mission}>
        Turning used cooking oil into a cleaner tomorrow.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoIcon: { fontSize: 40 },
  logo: {
    fontSize: 42,
    fontFamily: fonts.heading,
    color: colors.white,
  },
  logoAccent: { color: colors.lime },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: fonts.bodySemi,
    color: colors.lime,
    letterSpacing: 0.5,
  },
  mission: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: fonts.body,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 22,
  },
});
