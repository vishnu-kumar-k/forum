import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList } from "react-native";
import axiosPrivate from "../axiosPrivate";

const Notification = ({ user }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosPrivate.post("auth/notifications", {
        userId: user._id,
      });

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications.reverse()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text>{item.message}</Text>
            <Text>Date: {new Date(item.date).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.noNotificationsText}>No Notifications Yet</Text>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B8E1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#94FBAB",
    borderRadius: 5,
  },
  noNotificationsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
});

export default Notification;
