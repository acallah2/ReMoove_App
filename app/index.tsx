// app/index.tsx
import { Redirect } from "expo-router";

import { LogBox } from "react-native";

// Disable or customize Reanimated logs here:
LogBox.ignoreLogs(["Reading from `value` during component render",]); // Ignore specific log warnings



export default function Index() {
  return <Redirect href="/home" />;
}
