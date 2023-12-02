import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosPrivate } from '../axiosPrivate';
import { useFocusEffect } from '@react-navigation/native';

const Favourites = ({user}) => {
  const [data, setData] = useState([]);

  const load = async () => {
    try {
      const res = await axiosPrivate.post('blog/getfavourites',{userId:user._id});
      console.log(res.data.favoriteBlogs);
      setData(res.data.favoriteBlogs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // This will run when the screen is focused
      load();
    }, [])
  );

  const renderPostItem = ({ item }) => (
    <TouchableOpacity style={styles.postItem}>
      <View style={styles.userInfoContainer}>
        <Image
          source={{
            uri: item?.user?.profilePicture || "https://cdn2.vectorstock.com/i/1000x1000/53/86/young-male-cartoon-design-vector-9775386.jpg",
          }}
          style={styles.profilePicture}
        />
        <View style={styles.userNameContainer}>
          <Text style={[styles.userName, { color: '#3871C1' }]}>{item?.user?.name || "Anonymous"}</Text>
        </View>
      </View>
      <Text style={[styles.title, { color: '#3871C1' }]}>{item.title}</Text>
      <Image source={{ uri: item.headerImageUrl }} style={styles.headerImage} />
      <Text style={[styles.description, { color: '#F68712' }]}>{item.description}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.statContainer}>
          <Text style={{ color: '#3871C1' }}>{item.viewsCount}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={{ color: '#3871C1' }}>{item.likesCount}</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={{ color: '#3871C1' }}>{item.commentsCount}</Text>
          <Text style={styles.statLabel}>Comments</Text>
        </View>
        
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postItem: {
    position: 'relative', // Relative positioning for the parent container
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  description: {
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1, // Allow user name to take remaining space
  },
  followButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#3871C1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statContainer: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#3871C1',
  },
});

export default Favourites;
