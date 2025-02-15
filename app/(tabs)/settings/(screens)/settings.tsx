import React, { useState } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, ScrollView } from "react-native";
import { ModularCard } from "../../../../components/Cards/ModularCard";
import { CardContent } from "../../../../components/Cards/CardContent";
import { Button } from "@/components/ModularButton";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [sortingErrorsEnabled, setSortingErrorsEnabled] = useState(false);
  const [fullBinNotificationsEnabled, setFullBinNotificationsEnabled] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ScrollView className="p-6 pb-24">
      <View className="space-y-10">
        {/* User Profile */}
        <ModularCard className="mb-3">
          <TouchableOpacity onPress={() => toggleSection("profile")} className="flex-row justify-between items-center py-3">
            <Text className="text-lg font-semibold">User Profile</Text>
            <Ionicons name={expandedSections["profile"] ? "chevron-up" : "chevron-down"} size={20} />
          </TouchableOpacity>
          {expandedSections["profile"] && (
            <CardContent>
              {!isSignedIn ? (
                <Button onPress={() => setIsSignedIn(true)}>Sign In</Button>
              ) : (
                <>
                  <Text className="mt-2">Email</Text>
                  <TextInput className="border rounded-lg p-2" value={email} onChangeText={setEmail} placeholder="Enter email" />
                  <Text className="mt-2">Password</Text>
                  <TextInput className="border rounded-lg p-2 mb-4" value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
                  <Button onPress={() => {}}>Submit</Button>
                </>
              )}
            </CardContent>
          )}
        </ModularCard>

        {/* Notifications */}
        <ModularCard className="mb-3">
          <TouchableOpacity onPress={() => toggleSection("notifications")} className="flex-row justify-between items-center py-3">
            <Text className="text-lg font-semibold">Notifications</Text>
            <Ionicons name={expandedSections["notifications"] ? "chevron-up" : "chevron-down"} size={20} />
          </TouchableOpacity>
          {expandedSections["notifications"] && (
            <CardContent>
              <View className="flex-row justify-between items-center">
                <Text>Enable Alerts</Text>
                <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
              </View>
              <View className="flex-row justify-between items-center">
                <Text>Sorting Errors</Text>
                <Switch value={sortingErrorsEnabled} onValueChange={setSortingErrorsEnabled} />
              </View>
              <View className="flex-row justify-between items-center">
                <Text>Full Bin Notifications</Text>
                <Switch value={fullBinNotificationsEnabled} onValueChange={setFullBinNotificationsEnabled} />
              </View>
            </CardContent>
          )}
        </ModularCard>

        {/* Maintenance */}
        <ModularCard className="mb-3">
          <TouchableOpacity onPress={() => toggleSection("maintenance")} className="flex-row justify-between items-center py-3">
            <Text className="text-lg font-semibold">Maintenance</Text>
            <Ionicons name={expandedSections["maintenance"] ? "chevron-up" : "chevron-down"} size={20} />
          </TouchableOpacity>
          {expandedSections["maintenance"] && (
            <CardContent>
              <Button variant="danger" className="w-full mb-4" onPress={() => {}}>Run Diagnostics</Button>
              <Button className="w-full" onPress={() => {}}>Reset Device</Button>
            </CardContent>
          )}
        </ModularCard>

        {/* App Details */}
        <ModularCard className="mb-10">
          <TouchableOpacity onPress={() => toggleSection("appdetails")} className="flex-row justify-between items-center py-3">
            <Text className="text-lg font-semibold">App Details</Text>
            <Ionicons name={expandedSections["appdetails"] ? "chevron-up" : "chevron-down"} size={20} />
          </TouchableOpacity>
          {expandedSections["appdetails"] && (
            <CardContent>
              <Text>Version: 1.0.0</Text>
              <Text>Developer: ReMoove</Text>
              <Text>License: Open Source</Text>
            </CardContent>
          )}
        </ModularCard>
      </View>
    </ScrollView>
  );
}
