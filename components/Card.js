import React from "react";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function Card({ image, title, description, link }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(link)}
      className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200"
    >
      <View>
        {/* Image Section */}
        {image && (
          <Image
            source={{ uri: image }}
            className="h-36 w-full rounded-md mb-4"
            resizeMode="contain"
          />
        )}

        {/* Title Section */}
        <Text className="text-lg font-bold text-gray-900 mb-2">{title}</Text>

        {/* Description Section */}
        <Text className="text-sm text-gray-600">{description}</Text>
      </View>
    </TouchableOpacity>
  );
}
