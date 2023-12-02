import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosPrivate } from '../axiosPrivate';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = ({ user }) => {
  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [follow, setFollow] = useState({});

  const load = async () => {
    try {
      const res = await axiosPrivate.get('blog/all');
      setData(res.data.feeds);

      const favRes = await axiosPrivate.post('blog/getfavourites', { userId: user._id });
      const favPosts = favRes.data.favoriteBlogs;

      // Construct an object with blog post IDs as keys
      const favObject = favPosts.reduce((acc, post) => {
        acc[post._id] = true;
        return acc;
      }, {});

      setFavorites(favObject);
      const folRes = await axiosPrivate.post('auth/getfollowers', { userId: user._id });
      const fol = folRes.data.followers;

      // Construct an object with blog post IDs as keys
      const folObject = fol.reduce((acc, item) => {
        acc[item._id] = true;
        return acc;
      }, {});
      console.log(folObject);

      setFollow(folObject);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleFollow = async (personId) => {
    try {
      const isAlreadyFollowing = follow[personId];

      if (isAlreadyFollowing) {
        // If already following, unfollow
        await axiosPrivate.post('auth/unfollow', { userId: user._id, personId });
      } else {
        // If not following, follow
        console.log(personId);
        console.log(user._id);
        await axiosPrivate.post('auth/follow', { userId: user._id, personId });
      }

      setFollow((prevFollow) => {
        const newFollow = { ...prevFollow };
        newFollow[personId] = !prevFollow[personId];
        return newFollow;
      });
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

  const toggleFavorite = async (postId) => {
    try {
      const isAlreadyFavorite = favorites[postId];
      console.log(isAlreadyFavorite)
      if (isAlreadyFavorite) {
        // If already favorite, remove it
        await axiosPrivate.post('blog/removefavourite', { userId: user._id, postId });
      } else {
        // If not favorite, add it
        await axiosPrivate.post('blog/addfavourite', { userId: user._id, postId });
      }

      setFavorites((prevFavorites) => {
        const newFavorites = { ...prevFavorites };
        newFavorites[postId] = !prevFavorites[postId];
        return newFavorites;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    postItem: {
      position: 'relative',
      padding: 16,
      borderBottomWidth: 1,
      borderColor: '#ccc',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#3871C1',
    },
    headerImage: {
      width: '100%',
      height: 200,
    },
    description: {
      fontSize: 16,
      color: '#F68712',
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
      color: '#3871C1',
    },
    userNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    statLabel: {
      color: '#3871C1',
      marginLeft: 5,
    },
  });

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
          <Text style={[styles.userName, { color: '#3871C1' }]}>{item.author || "Anonymous"}</Text>
        </View>
      </View>
      <Text style={[styles.title, { color: '#3871C1' }]}>{item.title}</Text>
      <Image source={{ uri: item.headerImageUrl }} style={styles.headerImage} />
      <Text style={[styles.description, { color: '#F68712' }]}>{item.description}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.statContainer}>
          <Icon name="eye" size={20} color="#3871C1" />
          <Text style={styles.statLabel}>{item.viewsCount}</Text>
        </View>
        <View style={styles.statContainer}>
          <Icon name="thumbs-up" size={20} color="#3871C1" />
          <Text style={styles.statLabel}>{item.likesCount}</Text>
        </View>
        <View style={styles.statContainer}>
          <Icon name="comments" size={20} color="#3871C1" />
          <Text style={styles.statLabel}>{item.commentsCount}</Text>
        </View>
        <View style={styles.statContainer}>
          <TouchableOpacity onPress={() => { toggleFavorite(item._id) }}>
            <Icon
              name={favorites[item._id] ? 'heart' : 'heart-o'}
              size={20}
              color={favorites[item._id] ? '#f00' : '#3871C1'}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.followButton} onPress={() => toggleFollow(item.userId)}>
          <Icon
          style={styles.followButtonText}
            name={follow[item.userId] ? 'user-check' : 'user-plus'}
            size={20}
            color={follow[item.userId] ? '#0f0' : '#3871C1'}
          />
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

export default Home;
