import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text } from "react-native";
import React from "react";

export const unstable_settings = { group: true };


export default function CardDetails() {
  const params = useLocalSearchParams();
  const id = params.id || "Unknown"; // Default if undefined

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-900">
        This is the page for card ID: {id}
      </Text>
    </SafeAreaView>
  );
}
