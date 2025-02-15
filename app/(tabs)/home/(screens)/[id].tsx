import { useState } from "react";
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

export default function TrashCanPage() {
  const { id } = useLocalSearchParams();

  // Example state (Replace with API fetch later)
  const [status, setStatus] = useState({
    fillLevel: 45, // Percentage
    sortingStatus: "Idle",
    lastUpdated: "5 mins ago",
    error: null,
  });

  const [history, setHistory] = useState([
    { time: "10:00 AM", type: "Recycling", success: true },
    { time: "10:15 AM", type: "Landfill", success: false },
    { time: "10:30 AM", type: "Compost", success: true },
  ]);

  // Placeholder data for usage trends
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [{ data: [5, 8, 6, 7, 9] }],
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 p-6 space-y-4"
          contentContainerStyle={{ paddingBottom: 100 }} // Ensures no cut-off
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center border-b pb-4 mb-4 border-gray-300">
            <Text className="text-2xl font-bold">Trash Can: {id}</Text>
            <Text className="text-sm text-gray-500">Last Updated: {status.lastUpdated}</Text>
          </View>

          {/* Status Section */}
          <ModularCard className="mb-4">
            <CardContent>
              <Text className="text-lg font-semibold">Status</Text>
              <View className="mt-2">
                <Text className="font-medium">Fill Level:</Text>
                <Progress value={status.fillLevel} className="mt-2" />
                <Text className="text-sm text-gray-500">{status.fillLevel}% Full</Text>
              </View>
              <View className="mt-2">
                <Text className="font-medium">Sorting Mechanism:</Text>
                <Text className={status.sortingStatus === "Idle" ? "text-redwood" : "text-ucd-gold"}>
                  {status.sortingStatus}
                </Text>
              </View>
              {status.error && <Text className="text-doubledecker mt-2">Error: {status.error}</Text>}
            </CardContent>
          </ModularCard>

          {/* Manual Controls */}
          <ModularCard className="mb-4">
            <CardContent>
              <Text className="text-lg font-semibold">Manual Controls</Text>

              {/* First Row */}
              <View className="flex-row justify-between mt-2">
                <Button onPress={() => console.log("Sorting manually triggered")} className="w-[48%]">
                  Force Sort
                </Button>
                <Button onPress={() => console.log("Trapdoor toggled")} className="w-[48%]">
                  Open/Close Trap
                </Button>
              </View>

              {/* Second Row */}
              <View className="flex-row justify-between mt-2">
                <Button onPress={() => console.log("Gantry moved left")} className="w-[48%]">
                  Move Left
                </Button>
                <Button onPress={() => console.log("Gantry moved right")} className="w-[48%]">
                  Move Right
                </Button>
              </View>
            </CardContent>
          </ModularCard>

          {/* Usage History */}
          <ModularCard className="mb-4">
            <CardContent>
              <Text className="text-lg font-semibold">Usage History</Text>
              {history.map((item, index) => (
                <View key={index} className="flex-row justify-between text-sm mt-1">
                  <Text>{`${item.time} - ${item.type}`}</Text>
                  <Text className={item.success ? "text-redwood" : "text-doubledecker"}>
                    {item.success ? "Sorted" : "Failed"}
                  </Text>
                </View>
              ))}
            </CardContent>
          </ModularCard>

          {/* Usage Trends */}
          <ModularCard className="mb-4">
            <CardContent>
              <Text className="text-lg font-semibold text-center">Sorting Efficiency</Text>

              {/* Centering the graph */}
              <View className="flex items-center justify-center w-full mt-2">
                <LineChart
                  data={data}
                  width={screenWidth * 0.9} // Adjust width to fit container
                  height={200}
                  yAxisLabel=""
                  chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 170, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  bezier
                  style={{
                    borderRadius: 10,
                    alignSelf: "center", // Ensures centering
                  }}
                />
              </View>
            </CardContent>
          </ModularCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
