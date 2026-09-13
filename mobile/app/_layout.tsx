import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from "@expo-google-fonts/dm-sans";
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { colors } from "../constants/theme";

export default function RootLayout() {
  const [loaded] = useFonts({
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
  });

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.dark,
        }}
      >
        <ActivityIndicator color={colors.white} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" options={{ presentation: "card" }} />
          <Stack.Screen name="forgot-password" options={{ presentation: "card" }} />
          <Stack.Screen name="addresses" options={{ presentation: "card" }} />
          <Stack.Screen name="business" options={{ presentation: "card" }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="book" options={{ presentation: "card" }} />
          <Stack.Screen name="track/[id]" options={{ presentation: "card", headerShown: true, title: "Track pickup" }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
