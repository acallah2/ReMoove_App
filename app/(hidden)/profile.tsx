import React, { useState } from 'react';
import { Button, SafeAreaView, Text } from 'react-native';
import axios from 'axios';
//import Button from '../components/Button';

const profile = () => {
  const [data, setData] = useState<{ message: string; number: number } | null>(null); // State to store API response
  const [loading, setLoading] = useState<boolean>(false); // State for loading indication

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('https://yu8evuklyl.execute-api.us-east-2.amazonaws.com/dev/simpleButton');
      setData(response.data); // Store the entire response in the state
    } catch (error) {
      console.error(error);
      setData({ message: 'Failed to fetch data', number: 0 }); // Handle errors with fallback values
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
      <Button title="Fetch Data" onPress={fetchData} />
      {loading ? (
        <Text className="text-blue-500 mt-4">Loading...</Text>
      ) : (
        data && (
          <SafeAreaView className="mt-4">
            <Text className="text-gray-800">Message: {data.message}</Text>
            <Text className="text-gray-800">Number: {data.number}</Text>
          </SafeAreaView>
        )
      )}
    </SafeAreaView>
  );
};

export default profile;
