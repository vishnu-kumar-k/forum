import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosPrivate } from "../axiosPrivate";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const Home = ({ user }) => {
  const [data, setData] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [follow, setFollow] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(0);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };
  const load = async () => {
    try {
      const res = await axiosPrivate.get("blog/all");
      setData(res.data.feeds);

      const favRes = await axiosPrivate.post("blog/getfavourites", {
        userId: user._id,
      });
      const favPosts = favRes.data.favoriteBlogs;

      // Construct an object with blog post IDs as keys
      const favObject = favPosts.reduce((acc, post) => {
        acc[post._id] = true;
        return acc;
      }, {});

      setFavorites(favObject);
      const folRes = await axiosPrivate.post("auth/getfollowing", {
        userId: user._id,
      });
      const fol = folRes.data.followers;

      // Construct an object with blog post IDs as keys
      const folObject = fol.reduce((acc, item) => {
        acc[item._id] = true;
        return acc;
      }, {});

      setFollow(folObject);
    } catch (err) {
      console.log(err);
    }
  };
  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  const toggleFollow = async (personId) => {
    try {
      const isAlreadyFollowing = follow[personId];
      if (isAlreadyFollowing) {
        // If already following, unfollow
        await axiosPrivate.post("auth/unfollow", {
          userId: user._id,
          personId,
        });
      } else {
        // If not following, follow
        console.log(personId);
        console.log(user._id);
        await axiosPrivate.post("auth/follow", { userId: user._id, personId });
      }

      setFollow((prevFollow) => {
        const newFollow = { ...prevFollow };
        newFollow[personId] = !prevFollow[personId];
        return newFollow;
      });
    } catch (err) {
      console.log("At following" + err);
    }
  };
  useEffect(() => {
    load();
  }, [liked]);

  useFocusEffect(
    React.useCallback(() => {
      // This will run when the screen is focused
      load();
    }, [])
  );
  // const getProfile = async (userId) => {
  //   try {
  //     const r = await axiosPrivate.post("auth/getprofile", {
  //       userId,
  //     });
  //     //console.error(r.data.user.username)
  //     return r.data.user;
  //   } catch (err) {
  //     console.error(err);
  //     return;
  //   }
  // };
  const toggleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        const r = await axiosPrivate.post("blog/removelike", {
          userId: user._id,
          postId,
        });
      } else {
        const r = await axiosPrivate.post("blog/addlike", {
          userId: user._id,
          postId,
        });
      }
      //  console.error(r);
      setLiked((prev) => prev + 1);
    } catch (err) {
      console.error("error at here", err);
    }
  };

  const toggleFavorite = async (postId) => {
    try {
      const isAlreadyFavorite = favorites[postId];
      console.log(isAlreadyFavorite);
      if (isAlreadyFavorite) {
        // If already favorite, remove it
        await axiosPrivate.post("blog/removefavourite", {
          userId: user._id,
          postId,
        });
      } else {
        // If not favorite, add it
        await axiosPrivate.post("blog/addfavourite", {
          userId: user._id,
          postId,
        });
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
  const handleCommentSubmit = async (postId) => {
    try {
      await axiosPrivate.post("blog/addcomment", {
        userId: user._id,
        postId,
        comment,
        username: user.username,
      });
      setComment("");
      setLiked((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };
  const isCommentEmpty = comment.trim().length === 0;

  const styles = StyleSheet.create({
    commentContainer: {
      flexDirection: "row", // Arrange children horizontally
      alignItems: "center",
      backgroundColor: "#fb8b24", // Align children vertically at the center
      margin: 10,
      paddingLeft: 10,
      marginTop:30,
      borderRadius: 20,
    },
    commentInput: {
      flex: 1, // Take up remaining space

      marginRight: 10, // Add some space between TextInput and Button
    },

    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    postItem: {
      position: "relative",
      padding: 16,
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#3871C1",
    },
    headerImage: {
      width: "100%",
      height: 200,
    },
    description: {
      fontSize: 16,
      color: "#F68712",
    },
    infoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 30,
    },
    userInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
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
      fontWeight: "bold",
      color: "#3871C1",
    },

    sendButton: {
      padding: 10,
    },
    disabledButton: {
      opacity: 0.5,
    },
    userNameContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flex: 1,
    },
    followButton: {
      position: "absolute",
      top: 16,
      right: 16,
      backgroundColor: "#3871C1",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    followButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    statContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    statLabel: {
      color: "#3871C1",
      marginLeft: 5,
    },
    commentItem: {
      flexDirection: "row",
      marginBottom: 8,
    },
    commentUsername: {
      fontWeight: "bold",
      marginRight: 8,
    },
    commentText: {
      flex: 1,
      marginRight: 8,
    },
    commentDate: {
      color: "#888",
    },
  });
  const Comment = ({ username, comment, date }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUsername}>{username || "Anonymous"}:</Text>
      <Text style={styles.commentText}>{comment}</Text>
      <Text style={styles.commentDate}>
        {date.split("T")[0].split("-").reverse().join("/")}
      </Text>
    </View>
  );

  const renderPostItem = ({ item }) => (
    <TouchableOpacity style={styles.postItem}>
      <View style={styles.userInfoContainer}>
        <Image
          source={{
            uri:
              item?.user?.profilePicture ||
              "https://cdn2.vectorstock.com/i/1000x1000/53/86/young-male-cartoon-design-vector-9775386.jpg",
          }}
          style={styles.profilePicture}
        />
        <View style={styles.userNameContainer}>
          <Text style={[styles.userName, { color: "#3871C1" }]}>
            {item.author || "Anonymous"}
          </Text>
          <Text style={[styles.userName, { color: "#3871C1" }]}>
            {item.date.split("T")[0].split("-").reverse().join("/") || "Anonymous"}
          </Text>
        </View>
      </View>
      <Text style={[styles.title, { color: "#3871C1" }]}>{item.title}</Text>
      <Image source={{ uri: item.headerImageUrl }} style={styles.headerImage} />
      <View>
        <Text
          style={[styles.description, { color: "#F68712" }]}
          numberOfLines={expanded ? undefined : 2}
        >
          {item.description}
        </Text>
        {!expanded && item.description.length > 50 && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.expandText}>Expand</Text>
          </TouchableOpacity>
        )}
        {expanded && (
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.expandText}>Reduce</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        {/* <View style={styles.statContainer}>
          <Icon name="eye" size={20} color="#3871C1" />
          <Text style={styles.statLabel}>{item.viewsCount}</Text>
        </View> */}
        <View style={styles.statContainer}>
          <TouchableOpacity
            onPress={() => {
              toggleLike(
                item._id,
                item.likes.includes(user._id) ? true : false
              );
            }}
          >
            <Icon
              name="thumbs-up"
              size={20}
              color={item.likes.includes(user._id) ? "red" : "#3871C1"}
            />
          </TouchableOpacity>
          <Text style={styles.statLabel}>
            {item.likes ? item.likes.length : 0}
          </Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={handleToggleComments}
            style={styles.statContainer}
          >
            <Icon name="comments" size={20} color="#3871C1" />
            <Text style={styles.statLabel}>
              {item.comments ? item.comments.length : 0}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statContainer}>
          <TouchableOpacity
            onPress={() => {
              toggleFavorite(item._id);
            }}
          >
            <Icon
              name={favorites[item._id] ? "heart" : "heart-o"}
              size={20}
              color={favorites[item._id] ? "#f00" : "#3871C1"}
            />
          </TouchableOpacity>
        </View>
      </View>
      {item.userId !== user._id && (
        <TouchableOpacity
          style={styles.followButton}
          onPress={() => toggleFollow(item.userId)}
        >
          <Text>
            <Text style={{ color: follow[item.userId] ? "#0f0" : "#f00" }}>
              {follow[item.userId] ? "Following" : "Follow"}
            </Text>
          </Text>
        </TouchableOpacity>
      )}
      {showComments && (
        <View>
          {/* Render your comments here */}
          {item.comments.map((comment) => (
            <Comment
              key={comment._id}
              username={comment.username}
              comment={comment.comment}
              date={comment.date}
            />
          ))}
        </View>
      )}
      <View style={styles.commentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Enter your comment"
          onChangeText={(text) => setComment(text)}
          value={comment}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity
          onPress={() => handleCommentSubmit(item._id)}
          disabled={isCommentEmpty}
          style={[styles.sendButton, isCommentEmpty && styles.disabledButton]}
        >
          <Icon
            name="send"
            size={30}
            color={isCommentEmpty ? "gray" : "#3871C1"}
          />
        </TouchableOpacity>
      </View>
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
