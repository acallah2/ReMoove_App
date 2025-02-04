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
        setLoading(true); // Start loading indicator
        setError(null); // Clear previous errors

        try {
            // Construct query parameters
            const params: any = { deviceID };
            if (timeStamp) params.timeStamp = timeStamp;

            // Make an API call
            const response = await axios.get(
                "https://yu8evuklyl.execute-api.us-east-2.amazonaws.com/dev/fetchSensorData",
                { params } // Attach query parameters
            );

            console.log("Full API Response:", response); // Debugging log for the raw API response

            // Parse the response body
            const responseBody = response.data.body ? JSON.parse(response.data.body) : null;
            console.log("Parsed Response Body:", responseBody); // Debugging log for parsed body

            // Validate and map the data
            if (responseBody && responseBody.items) {
                const parsedData = responseBody.items.map((item: any) => ({
                    deviceID: item.deviceID.S,
                    timeStamp: item.timeStamp.S,
                    trashType: item.trashType.S,
                    weight: parseFloat(item.weight.N), // Convert numeric values
                    location: item.location.S,
                }));
                setData(parsedData); // Set parsed data
            } else {
                throw new Error("Invalid API response structure");
            }
        } catch (err) {
            console.error("Error fetching data:", err); // Log the error for debugging
            if (err instanceof Error) {
                setError(err.message); // Set error message
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    // Automatically fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Render each item in the list
    const renderItem = ({ item }: { item: any }) => (
        <View className="bg-white rounded-lg p-4 mb-4 shadow">
            <Text className="text-lg font-semibold">Device ID: {item.deviceID}</Text>
            <Text className="text-gray-600">Timestamp: {item.timeStamp}</Text>
            <Text className="text-gray-600">Trash Type: {item.trashType}</Text>
            <Text className="text-gray-600">Weight: {item.weight} kg</Text>
            <Text className="text-gray-600">Location: {item.location}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100 p-4">
            {/* Input fields for deviceID and timeStamp */}
            <View className="mb-4">
                <TextInput
                    placeholder="Enter Device ID"
                    value={deviceID}
                    onChangeText={setDeviceID}
                    className="bg-white rounded-lg p-2 border border-gray-300"
                />
                <TextInput
                    placeholder="Enter Timestamp (optional)"
                    value={timeStamp}
                    onChangeText={setTimeStamp}
                    className="bg-white rounded-lg p-2 border border-gray-300 mt-2"
                />
            </View>
            <Button title="Refresh Data" onPress={fetchData} />
            {loading && <ActivityIndicator size="large" className="my-4" />}
            {error && <Text className="text-red-500 text-center my-2">{error}</Text>}
            <FlatList
                data={data} // Data to display in the list
                keyExtractor={(item, index) => index.toString()} // Unique key for each item
                renderItem={renderItem} // Render function for each item
                className="flex-1"
                ListEmptyComponent={
                    !loading ? (
                        <Text className="text-gray-500 text-center">No data found</Text>
                    ) : null // Use null instead of false
                }
            />
        </SafeAreaView>
    );
};

export default logdata;
