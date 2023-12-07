import React, { useEffect, useState } from "react";
import {
  StatusBar,
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyPost from "./MyPost";
import MyEvents from "./MyEvents";
import axiosPrivate from "../axiosPrivate";

export default function Profile({ onLogout }) {
  const [user, setUser] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBlogs, setShowBlogs] = useState(true);
  const [showEvents, setShowEvents] = useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] =
    useState(false);
  const [editedProfile, setEditedProfile] = useState({
    username: user.username,
    bio: user.bio,
    phone: user.phone,
    DOB: user.DOB,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const value = await AsyncStorage.getItem("userDetails");
        setUser(JSON.parse(value));
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, []);

  const handleEditProfile = () => {
    setIsEditProfileModalVisible(true);
  };
  

  const handleShareProfile = () => {
    // Add functionality for sharing profile
    console.log("Share Profile");
  };

  const handleToggleBlogs = () => {
    setShowBlogs(!showBlogs);
    setShowEvents(false); // Close the other section when toggling
  };

  const handleToggleEvents = () => {
    setShowEvents(!showEvents);
    setShowBlogs(false); // Close the other section when toggling
  };

  const handleSaveChanges = async () => {
    console.error(user._id);
    try {
      const res = await axiosPrivate.post("auth/updateprofile", {
        userId: user._id, // Assuming user.id is the user's ID
        username: editedProfile.username,
        DOB: editedProfile.DOB,
        bio: editedProfile.bio,
        phone: editedProfile.phone,
        // Include other fields if needed
      });

      if (res.data.success) {
        setUser({
          ...user,
          username: editedProfile.username,
          DOB: editedProfile.DOB,
          bio: editedProfile.bio,
          phone: editedProfile.phone,
          // Include other fields if needed
        });

        setIsEditProfileModalVisible(false);
      } else {
        console.error("Failed to update profile:", res);
        // Handle error response from the server, show an error message, etc.
      }
    } catch (err) {
      console.error("Error updating user details:", err);
      // Handle network errors or other exceptions, show an error message, etc.
    }
  };

  const renderDetails = () => {
    if (showBlogs) {
      // Add logic to render blog details here
      return <MyPost />;
    } else if (showEvents) {
      // Add logic to render event details here
      return <MyEvents />;
    }
    return null; // Return null if neither blogs nor events are selected
  };

  return (
    <>
      {isLoaded ? (
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <Image
              style={styles.profilePicture}
              source={{
                uri: !user?.profilePicture
                  ? "https://cdn2.vectorstock.com/i/1000x1000/53/86/young-male-cartoon-design-vector-9775386.jpg"
                  : user.profilePicture,
              }}
            />
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{user.posts.length || 0}</Text>
              <Text style={styles.labelText}>Posts</Text>
            </View>
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{user.followers.length || 0}</Text>
              <Text style={styles.labelText}>Followers</Text>
            </View>
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{user.following.length || 0}</Text>
              <Text style={styles.labelText}>Following</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.profileInfoText}>{user.userTypes}</Text>
            {user.bio && <Text style={styles.profileInfoText}>{user.bio}</Text>}
            {user.phone && (
              <Text style={styles.profileInfoText}>{user.phone}</Text>
            )}
            {user.DOB && <Text style={styles.profileInfoText}>{user.DOB}</Text>}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.editProfileButton]}
              onPress={handleEditProfile}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.shareProfileButton]}
              onPress={onLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                showBlogs ? styles.activeToggleButton : null,
              ]}
              onPress={handleToggleBlogs}
            >
              <Image
                source={require("../assets/mypost.png")}
                style={styles.toggleImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                showEvents ? styles.activeToggleButton : null,
              ]}
              onPress={handleToggleEvents}
            >
              <Image
                source={require("../assets/home.png")}
                style={styles.toggleImage}
              />
            </TouchableOpacity>
          </View>
          {renderDetails()}
          <StatusBar style="auto" />
          {/* Edit Profile Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isEditProfileModalVisible}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={editedProfile.username}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, username: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Bio"
                  value={editedProfile.bio}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, bio: text }))
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={editedProfile.phone}
                  onChangeText={(text) => {
                    // Allow only numeric input
                    const numericInput = text.replace(/[^0-9]/g, "");
                    setEditedProfile((prev) => ({
                      ...prev,
                      phone: numericInput,
                    }));
                  }}
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Date of Birth"
                  value={editedProfile.DOB}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, DOB: text }))
                  }
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveChanges}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditProfileModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View style={styles.container}>
          <Text>Loading</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  countContainer: {
    alignItems: "center",
  },
  countText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  labelText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 5,
  },
  profileInfo: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 16,
    width: "40%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  editProfileButton: {
    backgroundColor: "#3871C1",
  },
  shareProfileButton: {
    backgroundColor: "#F68712",
  },
  profileInfoText: {
    marginLeft: 16,
    marginRight: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 16,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
  },
  activeToggleButton: {
    borderColor: "#F68712",
    borderBottomWidth: 2,
  },
  toggleImage: {
    width: 24,
    height: 24,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#3871C1",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#F68712",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
