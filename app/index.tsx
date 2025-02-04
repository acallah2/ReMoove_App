import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import "../global.css";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "(home)") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "(alerts)") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "(settings)") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tabs.Screen name="(home)" options={{ title: "Home" }} />
      <Tabs.Screen name="(alerts)" options={{ title: "Alerts" }} />
      <Tabs.Screen name="(settings)" options={{ title: "Settings" }} />
    </Tabs>
  );
}