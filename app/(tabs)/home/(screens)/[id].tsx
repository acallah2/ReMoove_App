import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ModularCard } from "../../../../components/Cards/ModularCard";
import { CardContent } from "../../../../components/Cards/CardContent";
import { Button } from "../../../../components/ModularButton";
import { Progress } from "../../../../components/Progress";
import { LineChart } from "react-native-chart-kit";
import { sendManualControl, connectTrashCan, fetchTrashCanStatus, fetchChartData } from "../../../utils/api";
import { Picker } from '@react-native-picker/picker';
import { StyleSheet } from 'react-native';

// First, update the helper function at the top of the file
const validateChartData = (timeData: any, selectedType: string): number[] => {
  if (!timeData || typeof timeData !== 'object') {
    console.log("Invalid time data received:", timeData);
    return [0];
  }

  // If we're looking for total, sum up all categories
  if (selectedType === 'Total') {
    // Get the first category's array length to determine how many data points we need
    const firstCategory = Object.values(timeData)[0] as number[];
    const dataLength = Array.isArray(firstCategory) ? firstCategory.length : 0;
    
    // Create an array of zeros with the correct length
    const totals = new Array(dataLength).fill(0);
    
    // Sum up values from each category
    Object.values(timeData).forEach((categoryData: any) => {
      if (Array.isArray(categoryData)) {
        categoryData.forEach((value: number, index: number) => {
          totals[index] += Number(value) || 0;
        });
      }
    });
    
    return totals;
  }

  // For specific categories, return that category's data or zeros
  return Array.isArray(timeData[selectedType]) ? 
    timeData[selectedType].map((n: any) => Number(n) || 0) : 
    [0];
};

// Add this helper function at the top of your file
const getDayLabels = (dataPoints: number): string[] => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const labels: string[] = ['Today'];
  
  // Add the next 6 days after today
  for (let i = 1; i < dataPoints; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    labels.push(days[date.getDay()]);
  }
  
  return labels;
};

// Add this mapping near the top of your file with other constants
const categoryMapping = {
  1: 'plastic_glass',
  2: 'compost',
  3: 'landfill',
  4: 'paper'
} as const;

export default function TrashCanPage() {
  const { id } = useLocalSearchParams();
  // Ensure we always work with a string trash can id or fallback to an empty string.
  const trashCanId = Array.isArray(id) ? id[0] : (id ?? "");

  const [status, setStatus] = useState({
    fillLevels: {
      Containers: 0,
      Organics: 0,
      Landfill: 0,
      Paper: 0,
    },
    sortingStatus: "",
    trapStatus: "",
    // Use lastUpdated to compute relative display time.
    lastUpdated: new Date(),
    error: null as string | null,
  });

  const [showGantryWaitMessage, setShowGantryWaitMessage] = useState(false);
  const [lastUpdatedDisplay, setLastUpdatedDisplay] = useState("Loading...");
  const [timeRange, setTimeRange] = useState<'1h' | '8h' | '24h' | '7d'>('1h');
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: Array<{ data: number[] }>;
  }>({
    labels: ['0m', '10m', '20m', '30m', '40m', '50m'],  // Default 1h view
    datasets: [{ 
      data: [0, 0, 0, 0, 0, 0].map(n => Number(n) || 0)  // Ensure numbers
    }]
  });

  const [rawChartData, setRawChartData] = useState<any>(null);

  const [selectedWaste, setSelectedWaste] = useState<'Total' | 'Containers' | 'Organics' | 'Landfill' | 'Paper'>('Total');

  const screenWidth = Dimensions.get("window").width;

  const [ws, setWs] = useState<WebSocket | null>(null);

  // Fetch initial status from the REST endpoint.
  useEffect(() => {
    if (!trashCanId) return;
    fetchTrashCanStatus(trashCanId)
      .then((fetchedData) => {
        // If the API returns a string body, parse it:
        const dataObject = typeof fetchedData.body === "string"
          ? JSON.parse(fetchedData.body)
          : fetchedData;
        setStatus({
          fillLevels: dataObject.fillLevels,
          sortingStatus: dataObject.sortingStatus,
          trapStatus: dataObject.trapStatus,
          lastUpdated: new Date(),
          error: null,
        });
        setLastUpdatedDisplay("Just Updated");
      })
      .catch((error) => {
        console.error(error);
        setStatus((prev) => ({ ...prev, error: "Failed to fetch initial status" }));
      });
  }, [trashCanId]);

  // Connect to the WebSocket API for live updates.
  useEffect(() => {
    if (!trashCanId) return;
    
    const websocket = connectTrashCan(trashCanId, (newData) => {
      const hasChanged =
        newData.sortingStatus !== status.sortingStatus ||
        newData.trapStatus !== status.trapStatus ||
        JSON.stringify(newData.fillLevels) !== JSON.stringify(status.fillLevels);

      setStatus({
        fillLevels: newData.fillLevels,
        sortingStatus: newData.sortingStatus,
        trapStatus: newData.trapStatus,
        lastUpdated: hasChanged ? new Date() : status.lastUpdated, // only update if changed
        error: null,
      });
      if (hasChanged) {
        setLastUpdatedDisplay("Just Updated");
      }
    });

    setWs(websocket);
    return () => websocket.close();
  }, [trashCanId]);

  // Update "Last Updated" display periodically.
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diffSeconds = Math.floor((now.getTime() - status.lastUpdated.getTime()) / 1000);
      if (diffSeconds < 120) {
        setLastUpdatedDisplay("Just Updated");
      } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        setLastUpdatedDisplay(`${minutes} minute${minutes > 1 ? "s" : ""} ago`);
      } else {
        const hours = Math.floor(diffSeconds / 3600);
        setLastUpdatedDisplay(`${hours} hour${hours > 1 ? "s" : ""} ago`);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [status.lastUpdated]);

  // Then replace the chart data fetching useEffect
  useEffect(() => {
    if (!trashCanId) return;
    
    const fetchData = async () => {
      try {
        const chartResponse = await fetchChartData(trashCanId);
        console.log("Raw chart response:", chartResponse); // Debug log
        
        const parsedData = chartResponse.body ? JSON.parse(chartResponse.body) : chartResponse;
        console.log("Parsed chart data:", parsedData); // Debug log
        
        setRawChartData(parsedData);
        
        const timeData = parsedData?.[timeRange];
        console.log("Time range data:", timeData); // Debug log

        if (!timeData || Object.keys(timeData).length === 0) {
          console.log("No data available for time range:", timeRange);
          setChartData({
            labels: ['No Data'],
            datasets: [{ data: [0] }]
          });
          return;
        }

        // Generate labels based on timeRange
        let labels: string[];
        const dataPoints = timeData[Object.keys(timeData)[0]]?.length || 0;
        
        switch (timeRange) {
          case '1h':
            labels = Array.from({length: dataPoints}, (_, i) => `${i*10}m`);
            break;
          case '8h':
            labels = Array.from({length: dataPoints}, (_, i) => `${i+1}h`);
            break;
          case '24h':
            labels = Array.from({length: dataPoints}, (_, i) => `${i*3}h`);
            break;
          case '7d':
            labels = getDayLabels(dataPoints);
            break;
          default:
            labels = ['No Data'];
        }

        // Process and validate the data
        const validatedData = validateChartData(timeData, selectedWaste);
        console.log("Validated data:", validatedData); // Debug log

        setChartData({
          labels: labels.slice(0, validatedData.length),
          datasets: [{
            data: validatedData
          }]
        });
      } catch (error) {
        console.error("Error updating chart data:", error);
        setChartData({
          labels: ['Error'],
          datasets: [{ data: [0] }]
        });
      }
    };
  
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [trashCanId, timeRange, selectedWaste]);

  // Function to empty the trash bin by setting all fill levels to 0.
  const emptyTrashBin = () => {
    const emptyLevels = {
      Containers: 0,
      Organics: 0,
      Landfill: 0,
      Paper: 0,
    };
    sendManualControl({
      trashCanId,
      fillLevels: emptyLevels,
      sortingStatus: status.sortingStatus || "Idle",
      trapStatus: status.trapStatus || "Closed",
      lastUpdated: "Just now",
    });
  };

  // Add this helper function above your return statement, along with your other functions:
const emptyCategory = (category: keyof typeof status.fillLevels) => {
  // Create a copy of current fill levels and set the specified category to 0
  const updatedFillLevels = {
    ...status.fillLevels,
    [category]: 0
  };

  // Create WebSocket message with complete status update
  const message = {
    action: "updateStatus",
    trashCanId: trashCanId,
    fillLevels: updatedFillLevels,
    sortingStatus: status.sortingStatus || "Idle",
    trapStatus: status.trapStatus || "Closed",
    lastUpdated: "Just now"
  };

  // Send the message through WebSocket
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
};

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          className="flex-1 p-6 space-y-4"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <ModularCard className="mb-4">
            <CardContent>
              <View className="flex-row justify-between items-center border-b pb-4 mb-4 border-gray-300">
                <Text className="text-2xl font-bold">Trash Can: {trashCanId}</Text>
                <Text className="text-sm text-gray-500">Last Updated: {lastUpdatedDisplay}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="font-medium">Sorting Mechanism: </Text>
                <Text className={`ml-1 ${status.sortingStatus === "Idle" ? "text-redwood" : "text-ucd-gold"}`}>
                  {status.sortingStatus}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="font-medium">Trap Mechanism: </Text>
                <Text className={`ml-1 ${status.trapStatus === "Closed" ? "text-redwood" : "text-ucd-gold"}`}>
                  {status.trapStatus}
                </Text>
              </View>
              {status.error && (
                <Text className="text-doubledecker mt-2">Error: {status.error}</Text>
              )}
            </CardContent>
          </ModularCard>

          {/* Fill Level */}
          <ModularCard className="mb-4">
            <CardContent>
              <View className="border-b border-gray-200 pb-4">
                <Text className="text-lg font-semibold">Fill Level</Text>
              </View>
              {(["Containers", "Organics", "Landfill", "Paper"] as Array<keyof typeof status.fillLevels>).map(
                (category, index) => {
                  const fill = status.fillLevels[category] || 0;
                  return (
                    <View key={index} className="mt-2">
                      <View className="flex-row justify-between pt-3">
                        <Text className="font-medium">{category}:</Text>
                        <Text className="text-sm text-gray-500">{fill}% Full</Text>
                      </View>
                      <Progress value={fill} className="mt-2" />
                    </View>
                  );
                }
              )}
              {/* Empty Category Buttons */}
              <View className="flex-col mt-4">
                {(["Containers", "Organics", "Landfill", "Paper"] as Array<keyof typeof status.fillLevels>).map(
                  (category, index) => (
                    <Button
                      key={index}
                      onPress={() => emptyCategory(category)}
                      className="w-full mb-2"
                    >
                      {`Empty ${category}`}
                    </Button>
                  )
                )}
              </View>
            </CardContent>
          </ModularCard>

          {/* Manual Controls */}
          <ModularCard className="mb-4">
            <CardContent>
              <View className="border-b border-gray-200 pb-4 mb-6">
                <Text className="text-lg font-semibold">Manual Sort</Text>
              </View>
              {/* Bin Position Controls */}
              <View className="flex-row flex-wrap justify-between mt-2">
                {[1, 2, 3, 4].map((bin) => (
                  <Button 
                    key={bin} 
                    onPress={() => {
                      const message = {
                        trashCanId,
                        category: categoryMapping[bin as keyof typeof categoryMapping]
                      };
                      sendManualControl(message);
                    }} 
                    className="w-[23%] mb-2"
                  >
                    {`Bin ${bin}`}
                  </Button>
                ))}
              </View>
            </CardContent>
          </ModularCard>

          {/* Usage Trends */}
          <ModularCard className="mb-4">
            <CardContent>
              <View className="border-b border-gray-200 pb-4 mb-6">
                <Text className="text-lg font-semibold">Sorting History</Text>
              </View>
              
              <View className="flex-row justify-center mb-6">
  <View className="flex-1 max-w-[140px] bg-gray-100 rounded-lg shadow-sm">
    <Picker
      selectedValue={timeRange}
      onValueChange={(value) => setTimeRange(value)}
      className="h-10 px-2"
      style={{ color: "#000" }}
    >
      <Picker.Item label="1H" value="1h" />
      <Picker.Item label="8H" value="8h" />
      <Picker.Item label="24H" value="24h" />
      <Picker.Item label="7D" value="7d" />
    </Picker>
  </View>
  
  {/* Spacer */}
  <View className="w-4" />
  
  <View className="flex-1 max-w-[140px] bg-gray-100 rounded-lg shadow-sm">
    <Picker
      selectedValue={selectedWaste}
      onValueChange={(value) => setSelectedWaste(value)}
      className="h-10 px-2"
      style={{ color: "#000" }}
    >
      <Picker.Item label="Total" value="Total" />
      <Picker.Item label="Containers" value="Containers" />
      <Picker.Item label="Organics" value="Organics" />
      <Picker.Item label="Landfill" value="Landfill" />
      <Picker.Item label="Paper" value="Paper" />
    </Picker>
  </View>
</View>

              <View className="flex items-center justify-center w-full">
                <LineChart
                  data={{
                    labels: chartData.labels,
                    datasets: [{
                      data: chartData.datasets[0].data
                    }]
                  }}
                  width={screenWidth * 0.85}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=" items"
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 170, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#ffa726'
                    },
                    formatYLabel: (value) => Math.max(0, Math.round(Number(value) || 0)).toString(),
                    formatXLabel: (value) => value?.toString() || '0',
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                  withInnerLines={false}
                  withOuterLines={true}
                  fromZero={true}
                  segments={4}
                />
              </View>
            </CardContent>
          </ModularCard>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Temporary Pop-Up Message */}
      {showGantryWaitMessage && (
        <View className="absolute bottom-10 w-full items-center">
          <View className="bg-black/70 px-4 py-2 rounded-xl">
            <Text className="text-white">
              Please wait for the gantry to stop moving.
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}