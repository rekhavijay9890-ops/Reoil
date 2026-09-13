import { Tabs } from "expo-router";
import { colors, fonts } from "../../constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.cardDark },
        headerTintColor: colors.white,
        headerTitleStyle: { fontFamily: fonts.headingSemi },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen name="jobs" options={{ title: "My jobs", tabBarIcon: () => null }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: () => null }} />
    </Tabs>
  );
}
