import { Stack } from "expo-router";
import { colors, fonts } from "../../constants/theme";

export default function BookLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.dark,
        headerTitleStyle: { fontFamily: fonts.headingSemi },
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Book pickup" }} />
      <Stack.Screen name="success" options={{ title: "", headerShown: false }} />
    </Stack>
  );
}
