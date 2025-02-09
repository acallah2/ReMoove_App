// logdata.tsx
import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList, Text, View, ActivityIndicator, Button, TextInput } from "react-native";
import axios from "axios";

const logdata = () => {
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [data, setData] = useState([]); // State to store data from the API
  const [error, setError] = useState<string | null>(null); // State to store error messages
  const [deviceID, setDeviceID] = useState("device123"); // Default deviceID
  const [timeStamp, setTimeStamp] = useState(""); // Optional timeStamp

  // Fetch data from the API
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Construct query parameters
      const params: any = { deviceID };
      if (timeStamp) params.timeStamp = timeStamp;

      const response = await axios.get(
        "https://yu8evuklyl.execute-api.us-east-2.amazonaws.com/dev/fetchSensorData",
        { params }
      );

      console.log("Full API Response:", response);
      const responseBody = response.data.body ? JSON.parse(response.data.body) : null;
      console.log("Parsed Response Body:", responseBody);

      if (responseBody && responseBody.items) {
        const parsedData = responseBody.items.map((item: any) => ({
          deviceID: item.deviceID.S,
          timeStamp: item.timeStamp.S,
          trashType: item.trashType.S,
          weight: parseFloat(item.weight.N),
          location: item.location.S,
        }));
        setData(parsedData);
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View className="bg-white rounded-lg p-4 mb-4 shadow">
      <Text className="text-lg font-semibold text-ucd-blue">Device ID: {item.deviceID}</Text>
      <Text className="text-ucd-gray-dark">Timestamp: {item.timeStamp}</Text>
      <Text className="text-ucd-gray-dark">Trash Type: {item.trashType}</Text>
      <Text className="text-ucd-gray-dark">Weight: {item.weight} kg</Text>
      <Text className="text-ucd-gray-dark">Location: {item.location}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View className="mb-4">
        <TextInput
          placeholder="Enter Device ID"
          value={deviceID}
          onChangeText={setDeviceID}
          className="bg-white rounded-lg p-2 border border-ucd-blue-10"
        />
        <TextInput
          placeholder="Enter Timestamp (optional)"
          value={timeStamp}
          onChangeText={setTimeStamp}
          className="bg-white rounded-lg p-2 border border-ucd-blue-10 mt-2"
        />
      </View>
      <Button title="Refresh Data" onPress={fetchData} color="#033266" />
      {loading && <ActivityIndicator size="large" className="my-4" />}
      {error && <Text className="text-red-500 text-center my-2">{error}</Text>}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        className="flex-1"
        ListEmptyComponent={
          !loading ? (
            <Text className="text-ucd-gray-dark text-center">No data found</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default logdata;
