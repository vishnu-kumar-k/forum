import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyPost from './MyPost';
import MyEvents from './MyEvents';

export default function Profile({ onLogout }) {
  const [user, setUser] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBlogs, setShowBlogs] = useState(true);
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const value = await AsyncStorage.getItem('userDetails');
        setUser(JSON.parse(value));
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, []);

  const handleEditProfile = () => {
    // Add functionality for editing profile
    // This can navigate to another screen for editing profile details
    console.log('Edit Profile');
  };

  const handleShareProfile = () => {
    // Add functionality for sharing profile
    console.log('Share Profile');
  };

  const handleToggleBlogs = () => {
    setShowBlogs(!showBlogs);
    setShowEvents(false); // Close the other section when toggling
  };

  const handleToggleEvents = () => {
    setShowEvents(!showEvents);
    setShowBlogs(false); // Close the other section when toggling
  };

  
  const renderDetails = () => {
    if (showBlogs) {
      // Add logic to render blog details here
      return (
        <MyPost/>
      );
    } else if (showEvents) {
      // Add logic to render event details here
      return (
        <MyEvents/>
      );
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
              <Text style={styles.countText}>{user.posts || 0}</Text>
              <Text style={styles.labelText}>Posts</Text>
            </View>
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{user.followers || 0}</Text>
              <Text style={styles.labelText}>Followers</Text>
            </View>
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{user.following || 0}</Text>
              <Text style={styles.labelText}>Following</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.profileInfoText}>Hello, I am vibin</Text>
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
                source={require('../assets/mypost.png')}
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
                source={require('../assets/home.png')}
                style={styles.toggleImage}
              />
            </TouchableOpacity>
          </View>
          {renderDetails()}
          <StatusBar style="auto" />
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
    backgroundColor: '#fff',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  countContainer: {
    alignItems: 'center',
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  labelText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 16,
    width: '40%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  editProfileButton: {
    backgroundColor: '#3871C1',
  },
  shareProfileButton: {
    backgroundColor: '#F68712',
  },
  profileInfoText: {
    marginLeft: 16,
    marginRight: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 16,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
  },
  activeToggleButton: {
    borderColor: '#F68712',
    borderBottomWidth: 2
  },
  toggleImage: {
    width: 24,
    height: 24,
  },
  detailsContainer: {
    padding: 16,
  },
});
