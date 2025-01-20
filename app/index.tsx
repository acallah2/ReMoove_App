import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Link } from "expo-router";

import "../global.css";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-5xl">ReMoove!</Text>
      <StatusBar style="auto" />
      <Link href="/profile" style={{color: 'blue'}}>Go to Profile</Link>
      <Link href="/home" style={{color: 'blue'}}>Go to Home</Link>
      <Link href="/trashcanlist" style={{color: 'blue'}}>Go to List of Trash Cans</Link>
    </View>
  );
}

