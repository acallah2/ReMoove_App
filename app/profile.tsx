import React from 'react';
import { SafeAreaView } from 'react-native';
import Button from '../components/Card'

const profile = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
      <Button title="Primary Button" onPress={() => alert('Primary Button Pressed')} image={undefined} description={undefined} />
    </SafeAreaView>
  )
}

export default profile
