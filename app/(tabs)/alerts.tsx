import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ModularCard } from '@/components/Cards/ModularCard';
import { CardContent } from '@/components/Cards/CardContent';
import { Button } from '@/components/ModularButton';

interface AlertItem {
  id: string;
  message: string;
  trashCanId: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
}

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // AWS API URLs
  const API_URL = 'https://m4t7u6yuzg.execute-api.us-east-2.amazonaws.com/Dev/Alerts'; // Fetch & dismiss single alert
  const CLEAR_ALL_API_URL = 'https://m4t7u6yuzg.execute-api.us-east-2.amazonaws.com/Dev/Alerts/clear'; // Clear all alerts

  // Fetch alerts from AWS
  const fetchAlerts = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(API_URL);

      console.log("API Response:", response.data);

      let alertsData = [];

      if (Array.isArray(response.data)) {
        alertsData = response.data;
      } else if (response.data?.body) {
        alertsData = typeof response.data.body === "string"
          ? JSON.parse(response.data.body)
          : response.data.body;
      }

      if (Array.isArray(alertsData)) {
        setAlerts(alertsData);
      } else {
        console.error("Unexpected API response format:", alertsData);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
      Alert.alert("Error", "Failed to load alerts. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  }, []);

  const dismissAlert = async (id: string, timestamp: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        data: { timestamp },
      });
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    } catch (error) {
      console.error('Error dismissing alert:', error);
      Alert.alert('Error', 'Failed to dismiss alert.');
    }
  };

  const clearAllAlerts = async () => {
    try {
      await axios.delete(CLEAR_ALL_API_URL);
      setAlerts([]);
    } catch (error) {
      console.error('Error clearing alerts:', error);
      Alert.alert('Error', 'Failed to clear all alerts.');
    }
  };

  const getBorderColor = (type: 'info' | 'warning' | 'error') => {
    switch (type) {
      case 'info':
        return 'border-green-500';
      case 'warning':
        return 'border-yellow-500';
      case 'error':
        return 'border-red-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Alerts</Text>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ModularCard className={`border-l-4 ${getBorderColor(item.type)} mb-2`}>
            <TouchableOpacity 
              onPress={() => router.push(`/home/(screens)/${item.trashCanId}`)}
              className="flex-row items-center justify-between w-full"
            >
              <CardContent className="flex-1">
                <Text className="text-lg font-semibold">{item.message}</Text>
                <Text className="text-sm text-gray-700">{item.timestamp}</Text>
              </CardContent>
              <TouchableOpacity onPress={() => dismissAlert(item.id, item.timestamp)} className="ml-4">
                <Ionicons name="close-circle" size={24} color="#D32F2F" />
              </TouchableOpacity>
            </TouchableOpacity>
          </ModularCard>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10">No alerts at the moment.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {alerts.length > 0 && (
        <Button 
          variant="danger" 
          textVariant="white" 
          className="mt-4" 
          onPress={clearAllAlerts}
        >
          Clear All
        </Button>
      )}
    </View>
  );
};

export default AlertsScreen;
