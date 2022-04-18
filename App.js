import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  useEffect(() => {
    registerForPushNotification().then((token) => setExpoPushToken(token));
  }, []);
  useEffect(() => {
    if (expoPushToken) {
      sendPushNotification(expoPushToken);
      setInterval(function () {
        sendPushNotification(expoPushToken);
      }, 300000);
    }
  }, [expoPushToken]);

  async function registerForPushNotification() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status != "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    }
    if (status !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Nyota Challenge",
      body: "Hello World! This Is Egide",
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  return (
    <View style={styles.container}>
      <Text>Nyota Challenge</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
