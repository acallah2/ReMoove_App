import React from "react";
import { SafeAreaView, Button } from "react-native";
import { useRouter, Link } from "expo-router";

const Settings = () => {
    const router = useRouter();

    return (
      <SafeAreaView>
              <Link href="/logdata" style={{color: 'blue'}}>Go to List of Trash Cans</Link>
      </SafeAreaView>

    );
}

export default Settings
