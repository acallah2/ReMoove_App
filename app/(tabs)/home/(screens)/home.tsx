import React, { useState, useCallback } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { ModularCard } from "../../../../components/Cards/ModularCard";
import { Button as ModularButton } from "../../../../components/ModularButton";
import { Ionicons } from "@expo/vector-icons";

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

// Function to get status color
const getStatusBorderColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "full":
      return "border-red-500";
    case "empty":
      return "border-green-500";
    case "pending":
      return "border-yellow-500";
    default:
      return "border-gray-300";
  }
};

const Home = () => {
  const router = useRouter();
  const [trashcans, setTrashcans] = useState([
    {
      id: 1,
      image: imageOptions[0],
      status: "Full",
      lastUpdated: "2025-02-10 14:30",
      location: "TLC, Floor 2",
    },
    {
      id: 2,
      image: imageOptions[1],
      status: "Empty",
      lastUpdated: "2025-02-09 10:15",
      location: "Kemper Hall, Ground Floor",
    },
  ]);

  const [selectedTrashcan, setSelectedTrashcan] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const changeImage = (id: number) => {
    console.log("Opening modal for trashcan:", id);
    setSelectedTrashcan(id);
    setModalVisible(true);
  };

  const selectImage = useCallback(
    (image: any) => {
      console.log("Updating trashcan image:", image);
      setTrashcans((prevTrashcans) => {
        const updatedTrashcans = prevTrashcans.map((trashcan) =>
          trashcan.id === selectedTrashcan ? { ...trashcan, image } : trashcan
        );
        console.log("Updated trashcans:", updatedTrashcans);
        return updatedTrashcans;
      });
      setModalVisible(false);
    },
    [selectedTrashcan]
  );

  const addTrashcan = () => {
    const newTrashcan = {
      id: trashcans.length + 1,
      image: imageOptions[trashcans.length % imageOptions.length],
      status: "Pending",
      lastUpdated: "2025-02-10 15:00",
      location: `New Location ${trashcans.length + 1}`,
    };
    setTrashcans((prevTrashcans) => [...prevTrashcans, newTrashcan]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4 py-4">
        {trashcans.map((trashcan, index) => (
          <ModularCard
            key={trashcan.id}
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
              {/* Trashcan title moved above the details */}
              <Text className="text-lg font-bold mb-1">Trash can {trashcan.id}</Text>

              {/* Status with color coding */}
              <Text className="text-sm font-semibold">
                <Text className="text-gray-700">Status: </Text> 
                <Text className={`ml-1 ${trashcan.status === "Full" ? "text-doubledecker" : trashcan.status === "Empty" ? "text-redwood" : "text-ucd-gold"}`}>
                  {trashcan.status}
                </Text>
              </Text>

              {/* Other details */}
              <Text className="text-sm text-gray-600">
                <Text className="font-semibold">Last Updated:</Text> {trashcan.lastUpdated}
              </Text>
              <Text className="text-sm text-gray-600">
                <Text className="font-semibold">Location:</Text> {trashcan.location}
              </Text>

              {/* Navigate to detailed page */}
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

      {/* Button to add new trashcan */}
      <ModularButton onPress={addTrashcan} variant="primary" className="m-4">
        Add Trashcan
      </ModularButton>

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
