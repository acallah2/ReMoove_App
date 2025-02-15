import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ModularCard } from '@/components/Cards/ModularCard';
import { CardContent } from '@/components/Cards/CardContent';
import { Button } from '@/components/ModularButton';

interface Alert {
  id: string;
  message: string;
  trashCanId: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
}

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const router = useRouter();

  useEffect(() => {
    setAlerts([
      {
        id: "test-1",
        message: "Trash can #1 is full",
        trashCanId: "1",
        timestamp: new Date().toLocaleTimeString(),
        type: "warning",
      },
      {
        id: "test-2",
        message: "Trash can #2 lost connection",
        trashCanId: "2",
        timestamp: new Date().toLocaleTimeString(),
        type: "error",
      },
      {
        id: "test-3",
        message: "Trash can #1 maintenace scheduled tomorrow",
        trashCanId: "1",
        timestamp: new Date().toLocaleTimeString(),
        type: "info",
      },
    ]);
  }, []);

  const dismissAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // Determine border color based on alert type
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

      {alerts.length === 0 ? (
        <Text className="text-gray-500 text-center mt-10">No alerts at the moment.</Text>
      ) : (
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
                <TouchableOpacity onPress={() => dismissAlert(item.id)} className="ml-4">
                  <Ionicons name="close-circle" size={24} color="#D32F2F" />
                </TouchableOpacity>
              </TouchableOpacity>
            </ModularCard>
          )}
        />
      )}

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
