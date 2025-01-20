import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';

export default function Card({ image, title, description, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} className="bg-white rounded-lg shadow-lg p-4 m-2">
      {/* Image Section */}
      {image && (
        <Image
          source={{ uri: image }}
          style={{ height: 150, width: '100%' }}
          resizeMode="contain"
        />
      )}

      {/* Title Section */}
      <Text className="text-xl font-bold text-gray-900">{title}</Text>

      {/* Description Section */}
      <Text className="text-sm text-gray-600 mt-2">{description}</Text>
    </TouchableOpacity>
  );
}
