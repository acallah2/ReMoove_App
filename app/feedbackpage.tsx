import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import axios, { AxiosError } from "axios";
import "nativewind";

export default function FeedbackPage() {
    const API_URL = "https://yu8evuklyl.execute-api.us-east-2.amazonaws.com/dev/feedback"; 

    const [userId, setUserId] = useState<string>("");
    const [deviceId, setDeviceId] = useState<string>("");
    const [suggestion, setSuggestion] = useState<string>("");

    const handleSubmit = async () => {
        const payload = {
            user_id: userId,
            device_id: deviceId,
            suggestion: suggestion,
        };

        try {
            const response = await axios.post(API_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                Alert.alert("Success", "Feedback submitted successfully!");
                setUserId("");
                setDeviceId("");
                setSuggestion("");
            } else {
                Alert.alert("Error", response.data.error || "An error occurred. Please try again.");
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response) {
                Alert.alert("Error", err.response.data?.error || "An error occurred on the server.");
            } else {
                Alert.alert("Error", "Failed to connect to server. Check your internet connection.");
            }
        }
    };

    return (
        <View className="flex-1 p-6 bg-white">
            <Text className="text-2xl font-bold text-center mb-6">Submit Feedback</Text>
            
            <Text className="text-lg font-semibold">User ID</Text>
            <TextInput
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                value={userId}
                onChangeText={setUserId}
                placeholder="Enter User ID"
            />

            <Text className="text-lg font-semibold mt-4">Device ID</Text>
            <TextInput
                className="w-full p-3 border border-gray-300 rounded-lg mt-2"
                value={deviceId}
                onChangeText={setDeviceId}
                placeholder="Enter Device ID"
            />

            <Text className="text-lg font-semibold mt-4">Suggestion</Text>
            <TextInput
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 h-24"
                value={suggestion}
                onChangeText={setSuggestion}
                placeholder="Enter Suggestion"
                multiline
            />

            <View className="mt-6">
                <Button title="Submit Feedback" onPress={handleSubmit} color="#007bff" />
            </View>
        </View>
    );
}
