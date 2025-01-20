import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, View, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../components/Card'; // Adjust the path if necessary

interface CardData {
  id: string;
  title: string;
  description: string;
}

const TrashcanList: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');

  // Save cards to AsyncStorage
  const saveCards = async (updatedCards: CardData[]) => {
    try {
      await AsyncStorage.setItem('cards', JSON.stringify(updatedCards));
    } catch (error) {
      console.error('Failed to save cards:', error);
    }
  };

  // Load cards from AsyncStorage when the component mounts
  const loadCards = async () => {
    try {
      const storedCards = await AsyncStorage.getItem('cards');
      if (storedCards) {
        setCards(JSON.parse(storedCards));
      }
    } catch (error) {
      console.error('Failed to load cards:', error);
    }
  };

  useEffect(() => {
    loadCards(); // Load cards when the component mounts
  }, []);

  // Add a new card and save it
  const addCard = () => {
    const updatedCards = [
      ...cards,
      { id: Date.now().toString(), title: newCardTitle, description: newCardDescription },
    ];
    setCards(updatedCards);
    saveCards(updatedCards); // Persist cards
    setModalVisible(false);
    setNewCardTitle('');
    setNewCardDescription('');
  };

  // Delete a card and save changes
  const deleteCard = (id: string) => {
    const updatedCards = cards.filter((card) => card.id !== id);
    setCards(updatedCards);
    saveCards(updatedCards); // Persist changes
  };

  // Show confirmation alert before deleting
  const confirmDelete = (id: string) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCard(id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-lg mx-4 mt-4"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-center font-bold text-lg">Add New Card</Text>
      </TouchableOpacity>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => alert(`Card: ${item.title}`)} // Regular press
            onLongPress={() => confirmDelete(item.id)} // Long press to delete
            delayLongPress={500} // Optional: Set delay for long press (500ms)
            className="bg-white rounded-lg shadow-lg p-4 m-2"
          >
            <View>
              <Text className="text-xl font-bold text-gray-900">{item.title}</Text>
              <Text className="text-sm text-gray-600 mt-2">{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-4">No cards yet. Add one!</Text>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-4/5 bg-white p-6 rounded-lg shadow-lg">
            <Text className="text-lg font-bold mb-4 text-gray-800">Create New Card</Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-3"
              placeholder="Enter card title"
              value={newCardTitle}
              onChangeText={setNewCardTitle}
            />

            <TextInput
              className="border border-gray-300 rounded-lg p-3 mb-4"
              placeholder="Enter card description"
              value={newCardDescription}
              onChangeText={setNewCardDescription}
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-red-500 flex-1 mr-2 p-3 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white text-center font-bold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-500 flex-1 ml-2 p-3 rounded-lg"
                onPress={addCard}
              >
                <Text className="text-white text-center font-bold">Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TrashcanList;
