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
import { sendManualControl, connectTrashCan, fetchTrashCanStatus } from "../../../utils/api";

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
    labels: ['0m', '10m', '20m', '30m', '40m', '50m'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0] }],
  });

  const [selectedWaste, setSelectedWaste] = useState<'Total' | 'Containers' | 'Organics' | 'Landfill' | 'Paper'>('Total');

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [{ data: [5, 8, 6, 7, 9] }],
  };

  const screenWidth = Dimensions.get("window").width;

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
    const ws = connectTrashCan(trashCanId, (newData) => {
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
    return () => ws.close();
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

  // Update the updateChartData function to handle different waste types
  const updateChartData = (range: '1h' | '8h' | '24h' | '7d') => {
    let labels: string[] = [];
    
    switch (range) {
      case '1h':
        labels = ['10m', '20m', '30m', '40m', '50m', '60m'];
        break;
      case '8h':
        labels = ['1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h'];
        break;
      case '24h':
        labels = ['3h', '6h', '9h', '12h', '15h', '18h', '21h', '24h'];
        break;
      case '7d':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
    }
  
    // Generate category-specific dummy data
    let data: number[];
    switch (selectedWaste) {
      case 'Containers':
        data = labels.map(() => Math.floor(Math.random() * 20)); // 0-20 items
        break;
      case 'Organics':
        data = labels.map(() => Math.floor(Math.random() * 30)); // 0-30 items
        break;
      case 'Landfill':
        data = labels.map(() => Math.floor(Math.random() * 25)); // 0-25 items
        break;
      case 'Paper':
        data = labels.map(() => Math.floor(Math.random() * 15)); // 0-15 items
        break;
      case 'Total':
      default:
        data = labels.map(() => Math.floor(Math.random() * 80)); // 0-80 items for total
        break;
    }
  
    setChartData({
      labels,
      datasets: [{
        data
      }]
    });
  };

  // Update the useEffect to respond to both timeRange and selectedWaste changes
  useEffect(() => {
    updateChartData(timeRange);
  }, [timeRange, selectedWaste]);

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
              <Text className="text-lg font-semibold">Fill Level</Text>
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
            </CardContent>
          </ModularCard>

          {/* Manual Controls */}
          <ModularCard className="mb-4">
            <CardContent>
              <Text className="text-lg font-semibold">Manual Controls</Text>
              {/* First Row */}
              <View className="flex-row justify-between mt-2">
                <Button onPress={() => sendManualControl({ forceSort: true })} className="w-[48%]">
                  Force Sort
                </Button>
                <Button
                  onPress={() => {
                    if (status.sortingStatus === "Idle") {
                      sendManualControl({ openTrap: status.trapStatus === "Closed" });
                    } else {
                      setShowGantryWaitMessage(true);
                      setTimeout(() => setShowGantryWaitMessage(false), 3000);
                    }
                  }}
                  className="w-[48%]"
                >
                  {status.trapStatus === "Closed" ? "Open Trap" : "Close Trap"}
                </Button>
              </View>

              {/* Bin Position Controls */}
              <View className="flex-row flex-wrap justify-between mt-2">
                {[1, 2, 3, 4].map((bin) => (
                  <Button key={bin} onPress={() => sendManualControl({ moveGantry: bin })} className="w-[23%] mb-2">
                    {`Bin ${bin}`}
                  </Button>
                ))}
                <View className="w-full flex items-center">
                  <Button onPress={() => sendManualControl({ moveGantry: 5 })} className="w-[100%]">
                    Home
                  </Button>
                </View>
              </View>
            </CardContent>
          </ModularCard>

          {/* Usage Trends */}
          <ModularCard className="mb-4">
            <CardContent>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold">Sorting Efficiency</Text>
                <View className="flex-row space-x-1">
                  {(['1h', '8h', '24h', '7d'] as const).map((range) => (
                    <Button
                      key={range}
                      onPress={() => setTimeRange(range)}
                      className={`px-2 py-1 w-[45px] ${
                        timeRange === range ? 'bg-ucd-gold' : 'bg-gray-200'
                      }`}
                    >
                      {range.toUpperCase()}
                    </Button>
                  ))}
                </View>
              </View>

              <View className="flex items-center justify-center w-full mt-2 mb-4">
                <LineChart
                  data={chartData}
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
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16
                  }}
                  withInnerLines={false}
                  withOuterLines={true}
                />
              </View>

              {/* Waste type selector - moved below graph with wider buttons */}
              <View className="flex-row flex-wrap justify-center gap-2">
                {(['Total', 'Containers', 'Organics', 'Landfill', 'Paper'] as const).map((type) => (
                  <Button
                    key={type}
                    onPress={() => setSelectedWaste(type)}
                    className={`px-2 py-1 w-[100px] ${
                      selectedWaste === type ? 'bg-ucd-gold' : 'bg-gray-200'
                    }`}
                  >
                    {type}
                  </Button>
                ))}
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