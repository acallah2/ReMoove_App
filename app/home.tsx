import { SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import Card from '../components/Card'

const home = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
        <ScrollView>
          {/* Example Cards */}
          <Card
            image="https://e7.pngegg.com/pngimages/250/763/png-clipart-positive-cows-dairy-cow-livestock-thumbnail.png"
            title="Card Title 1"
            description="This is a description for the first card."
            onPress={() => alert('Card 1 Pressed')}
          />
          <Card
            image="https://e7.pngegg.com/pngimages/250/763/png-clipart-positive-cows-dairy-cow-livestock-thumbnail.png"
            title="Card Title 2"
            description="This is a description for the second card."
            onPress={() => alert('Card 2 Pressed')}
          />
          <Card
            image="https://e7.pngegg.com/pngimages/250/763/png-clipart-positive-cows-dairy-cow-livestock-thumbnail.png"
            title="Card Title 3"
            description="This is a description for the second card."
            onPress={() => alert('Card 2 Pressed')}
          />
          <Card
            image="https://e7.pngegg.com/pngimages/250/763/png-clipart-positive-cows-dairy-cow-livestock-thumbnail.png"
            title="Card Title 4"
            description="This is a description for the second card."
            onPress={() => alert('Card 2 Pressed')}
          />
          <Card
            image="https://e7.pngegg.com/pngimages/250/763/png-clipart-positive-cows-dairy-cow-livestock-thumbnail.png"
            title="Card Title 5"
            description="This is a description for the second card."
            onPress={() => alert('Card 2 Pressed')}
          />
          <Card
                  title="Card Title 6"
                  description="This is a description for the third card."
                  onPress={() => alert('Card 3 Pressed')} image={undefined}          />
        </ScrollView>
      </SafeAreaView>
  )
}

export default home
