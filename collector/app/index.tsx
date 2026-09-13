import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors, fonts } from "../constants/theme";

export default function SplashScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      router.replace(user ? "/(tabs)/jobs" : "/login");
    }, 1200);
    return () => clearTimeout(timer);
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🚚</Text>
      <Text style={styles.title}>Reoil Collector</Text>
      <Text style={styles.sub}>Pickup & delivery app for field staff</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cardDark, alignItems: "center", justifyContent: "center", padding: 32 },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 32, fontFamily: fonts.heading, color: colors.white },
  sub: { marginTop: 8, fontFamily: fonts.body, color: colors.lime, textAlign: "center" },
});
