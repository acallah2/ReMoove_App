import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Image,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ModularCard } from "../../../../components/Cards/ModularCard";
import { Button as ModularButton } from "../../../../components/ModularButton";
import { Ionicons } from "@expo/vector-icons";
import { fetchHomeTrashCans, fetchTrashCanStatus } from "../../../utils/api";

// Import local images
const imageOptions = [
  require("../../../../assets/images/ProfilePics/pic1.jpeg"),
  require("../../../../assets/images/ProfilePics/pic2.jpeg"),
  require("../../../../assets/images/ProfilePics/pic3.jpeg"),
  require("../../../../assets/images/ProfilePics/pic4.jpeg"),
  require("../../../../assets/images/ProfilePics/pic5.jpeg"),
  require("../../../../assets/images/ProfilePics/pic6.jpeg"),
  require("../../../../assets/images/ProfilePics/pic7.jpeg"),
  require("../../../../assets/images/ProfilePics/pic8.jpeg"),
  require("../../../../assets/images/ProfilePics/pic9.jpeg"),
];

const defaultImage = require("../../../../assets/images/ProfilePics/pic1.jpeg");

// Function to get status border color based on status text
const getStatusBorderColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "full":
    case "error":
      return "border-red-500";
    case "working":
      return "border-green-500";
    case "working, almost full":
      return "border-yellow-500";
    default:
      return "border-gray-300";
  }
};

// Computes overall status based on fill levels. Defaults to zero if missing.
const computeStatus = (
  fillLevels: Record<string, number> = { Containers: 0, Organics: 0, Landfill: 0, Paper: 0 }
): string => {
  let overallStatus = "Working";
  for (const key in fillLevels) {
    const fill = fillLevels[key];
    if (fill === 100) return "Full";
    if (fill >= 80) overallStatus = "Working, almost full";
  }
  return overallStatus;
};

const Home = () => {
  const router = useRouter();
  const [trashcans, setTrashcans] = useState<any[]>([]);
  const [selectedTrashcan, setSelectedTrashcan] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Obtain list from storage, if it exists.
  const loadStoredTrashcans = async () => {
    try {
      const storedData = await AsyncStorage.getItem("trashcans");
      if (storedData) {
        setTrashcans(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Error loading stored trashcans:", error);
    }
  };

  // Save the fetched list in storage.
  const storeTrashcans = async (list: any[]) => {
    try {
      await AsyncStorage.setItem("trashcans", JSON.stringify(list));
    } catch (error) {
      console.error("Error saving trashcans:", error);
    }
  };

  // Fetch initial list of trashcans from the Home endpoint.
  const fetchTrashcansList = async () => {
    try {
      const response = await fetchHomeTrashCans();
      const data =
        response && typeof response.body === "string"
          ? JSON.parse(response.body)
          : response;
      if (!Array.isArray(data)) {
        throw new Error("Expected an array but got: " + JSON.stringify(data));
      }
      // Map each entry to include default fields.
      const list = data.map((entry: any, index: number) => ({
        id: entry.id !== undefined ? entry.id : index + 1,
        image: entry.image || defaultImage,
        // These will be updated by the status fetch.
        status: "Pending",
        fillLevels: { Containers: 0, Organics: 0, Landfill: 0, Paper: 0 },
        lastUpdated: "Loading...",
        location: entry.location || "Unknown Location",
      }));
      setTrashcans(list);
      storeTrashcans(list);
      return list;
    } catch (error) {
      console.error("Error fetching trashcans list:", error);
      return [];
    }
  };

  // Function to fetch status for all trashcans, optionally accepting a list.
  const refreshStatuses = async (listParam?: any[]) => {
    setRefreshing(true);
    const listToUse = listParam || trashcans;
    await Promise.all(
      listToUse
        .filter((trashcan) => trashcan && trashcan.id !== undefined)
        .map(async (trashcan) => {
          try {
            const idStr = trashcan.id.toString();
            const responseData = await fetchTrashCanStatus(idStr);
            const dataObject =
              typeof responseData.body === "string"
                ? JSON.parse(responseData.body)
                : responseData;
            // Default to zero values if fillLevels is missing.
            const updatedFillLevels =
              dataObject.fillLevels || { Containers: 0, Organics: 0, Landfill: 0, Paper: 0 };
            const computedStatus = computeStatus(updatedFillLevels);
            setTrashcans((prev) =>
              prev.map((tc) =>
                tc.id === trashcan.id
                  ? {
                      ...tc,
                      fillLevels: updatedFillLevels,
                      status: computedStatus,
                      lastUpdated: dataObject.lastUpdated || "Just now",
                    }
                  : tc
              )
            );
          } catch (error) {
            console.error(`Error fetching status for trashcan ${trashcan.id}:`, error);
            setTrashcans((prev) =>
              prev.map((tc) =>
                tc.id === trashcan.id ? { ...tc, status: "Error" } : tc
              )
            );
          }
        })
    );
    setRefreshing(false);
  };

  // On mount, load stored trashcans, fetch list from API, and refresh statuses.
  useEffect(() => {
    (async () => {
      await loadStoredTrashcans();
      const list = await fetchTrashcansList();
      if (list.length > 0) {
        await refreshStatuses(list);
      }
    })();
  }, []);

  const changeImage = (id: number) => {
    console.log("Opening modal for trashcan:", id);
    setSelectedTrashcan(id);
    setModalVisible(true);
  };

  const selectImage = useCallback(
    (image: any) => {
      console.log("Updating trashcan image:", image);
      setTrashcans((prevTrashcans) =>
        prevTrashcans.map((trashcan) =>
          trashcan.id === selectedTrashcan ? { ...trashcan, image } : trashcan
        )
      );
      setModalVisible(false);
    },
    [selectedTrashcan]
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="px-4 py-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => refreshStatuses()} />
        }
      >
        {trashcans.map((trashcan, index) => (
          <ModularCard
            key={`${trashcan.id}-${index}`}
            className={`flex-row items-center space-x-4 p-4 ${index !== 0 ? "mt-4" : ""} border-l-4 ${getStatusBorderColor(trashcan.status)}`}
          >
            {/* Image section with change icon */}
            <TouchableOpacity onPress={() => changeImage(trashcan.id)} className="relative">
              <Image source={trashcan.image || defaultImage} className="w-16 h-16 rounded-lg" />
              <View className="absolute bottom-0 right-0 bg-black/60 rounded-full p-1">
                <Ionicons name="pencil" size={14} color="white" />
              </View>
            </TouchableOpacity>

            {/* Trashcan details (aligned vertically) */}
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold mb-1">Trash Can {trashcan.id}</Text>
              <Text className="text-sm font-semibold">
                <Text className="text-gray-700">Status: </Text>
                <Text className={`ml-1 ${
                  trashcan.status.toLowerCase() === "full" || trashcan.status.toLowerCase() === "error"
                    ? "text-doubledecker"
                    : trashcan.status.toLowerCase() === "working"
                    ? "text-redwood"
                    : trashcan.status.toLowerCase() === "working, almost full"
                    ? "text-ucd-gold"
                    : "text-gray-500"
                }`}>
                  {trashcan.status}
                </Text>
              </Text>
              <Text className="text-sm text-gray-600">
                <Text className="font-semibold">Last Updated:</Text> {trashcan.lastUpdated}
              </Text>
              <Text className="text-sm text-gray-600">
                <Text className="font-semibold">Location:</Text> {trashcan.location}
              </Text>
              <ModularButton
                onPress={() => router.push(`/home/${trashcan.id}`)}
                variant="primary"
                textVariant="white"
                className="mt-2"
              >
                View Details
              </ModularButton>
            </View>
          </ModularCard>
        ))}
      </ScrollView>

      {/* Modal for changing image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="bg-white rounded-lg p-4">
              <Text className="text-lg font-bold text-center mb-2">
                Select Trashcan Image
              </Text>
              <FlatList
                data={imageOptions}
                numColumns={3}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => selectImage(item)}>
                    <Image source={item} className="w-20 h-20 m-2" />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;