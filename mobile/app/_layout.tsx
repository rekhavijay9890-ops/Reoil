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
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text, View } from "react-native";
import { colors, fonts } from "../constants/theme";

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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.cream }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.dark,
          headerTitleStyle: {
            fontFamily: fonts.headingSemi,
            fontWeight: "600",
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.border,
          },
          tabBarLabelStyle: {
            fontFamily: fonts.bodySemi,
            fontSize: 11,
          },
          sceneStyle: { backgroundColor: colors.cream },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>⌂</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Book",
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>📅</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="payout"
          options={{
            title: "Rates",
            headerTitle: "Payout rates",
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>₹</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="help"
          options={{
            title: "Help",
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>💬</Text>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
