import React from 'react';
import { Pressable, Text } from 'react-native';

export default function Button({ title, onPress, type = 'primary' }) {
  const baseClasses = "px-4 py-2 rounded-lg";
  const primaryClasses = "bg-blue-500 text-white";
  const secondaryClasses = "bg-gray-200 text-gray-800";
  const dangerClasses = "bg-red-500 text-white";

  let buttonClasses;
  switch (type) {
    case 'secondary':
      buttonClasses = secondaryClasses;
      break;
    case 'danger':
      buttonClasses = dangerClasses;
      break;
    default:
      buttonClasses = primaryClasses;
      break;
  }

  return (
    <Pressable
      onPress={onPress}
      className={`${baseClasses} ${buttonClasses}`}
    >
      <Text className="text-center text-lg font-medium">
        {title}
      </Text>
    </Pressable>
  );
}
