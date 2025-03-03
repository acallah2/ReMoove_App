import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LogBox, View, Text } from "react-native";
import "../../global.css";

// Disable or customize Reanimated logs here:
LogBox.ignoreLogs([
  " [Reanimated] Reading from `value` during component render. Please ensure that you do not access the `value` property or use `get` method of a shared value while React is rendering a component.",
]); // Ignore specific log warnings

const LogoHeader = () => (
  <View className="flex-row items-center justify-center py-1">
    <Text className="text-3xl font-bold">ReMoove</Text>
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "alerts") {
            iconName = focused
              ? "notifications"
              : "notifications-outline";
          } else if (route.name === "settings") {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#033266",
        tabBarInactiveTintColor: "#4C4C4C",
        headerShown: true,
        headerTitle: () => <LogoHeader />,
        headerTitleAlign: "center",
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="alerts" options={{ title: "Alerts" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}