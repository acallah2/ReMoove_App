import React, { useState } from "react";
import { SafeAreaView, ScrollView, Button } from "react-native";
import Card from "../components/Card";

const Home = () => {
  // State for dynamically managing cards
  const [cards, setCards] = useState([
    {
      id: 1,
      image: "https://e7.pngegg.com/pngimages/250/763/png-clipart-positive-cows-dairy-cow-livestock-thumbnail.png",
      title: "Card Title 1",
      description: "This is a description for the first card.",
    },
    {
      id: 2,
      image: "https://e7.pngegg.com/pngimages/250/763/png-clipart-positive-cows-dairy-cow-livestock-thumbnail.png",
      title: "Card Title 2",
      description: "This is a description for the second card.",
    },
  ]);

  // Function to add a new card dynamically
  const addCard = () => {
    const newCard = {
      id: cards.length + 1,
      image: "https://e7.pngegg.com/pngimages/250/763/png-clipart-positive-cows-dairy-cow-livestock-thumbnail.png",
      title: `Card Title ${cards.length + 1}`,
      description: `This is a description for card ${cards.length + 1}.`,
    };
    setCards((prevCards) => [...prevCards, newCard]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="px-4 py-4">
        {/* Render all cards */}
        {cards.map((card) => (
          <Card
            key={card.id}
            image={card.image}
            title={card.title}
            description={card.description}
            link={`/${card.id}`} // Pass the dynamic link
          />
        ))}
      </ScrollView>
      {/* Button to add a new card */}
      <Button title="Add Card" onPress={addCard} />
    </SafeAreaView>
  );
};

export default Home;
