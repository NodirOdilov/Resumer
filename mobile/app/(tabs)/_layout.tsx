import { Tabs } from "expo-router";
import { colors } from "@/constants/theme";
import { Text } from "react-native";

function TabIcon({ label }: { label: string }) {
  return <Text style={{ fontSize: 20 }}>{label}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: colors.border,
        },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: () => <TabIcon label="H" />,
        }}
      />
      <Tabs.Screen
        name="resumes"
        options={{
          title: "Резюме",
          tabBarIcon: () => <TabIcon label="R" />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Поиск",
          tabBarIcon: () => <TabIcon label="S" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: () => <TabIcon label="P" />,
        }}
      />
    </Tabs>
  );
}
