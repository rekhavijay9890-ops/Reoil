import { Tabs } from "expo-router";
import { colors, fonts } from "../../constants/theme";

export default function CollectorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.cardDark },
        headerTintColor: colors.white,
        headerTitleStyle: { fontFamily: fonts.headingSemi },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.white },
      }}
    >
      <Tabs.Screen
        name="jobs"
        options={{ title: "My jobs", tabBarLabel: "Jobs" }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarLabel: "Profile" }}
      />
    </Tabs>
  );
}
