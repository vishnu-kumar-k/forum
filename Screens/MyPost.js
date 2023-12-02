import React,{useEffect, useState} from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { axiosPrivate } from '../axiosPrivate';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from '@react-navigation/native'

const MyPost = () => {
 const [data,setData]=useState([]);
 const load=async()=>{
  try{
    const data=JSON.parse(await AsyncStorage.getItem('userDetails'));
      const res= await axiosPrivate.post('blog/myblogs',{userId:data._id});
      setData(res.data.feeds);
  }
  catch(err){
    console.log(err);
  }
 }

 const deleteBlog=async(e,postId)=>{
   e.preventDefault();
    try{
          await axiosPrivate.post('blog/removeblog',{postId});
          load();
      }
      catch(err){
        console.log(err);
      }
 }
  useEffect(()=>{
    load()
  },[])
  useFocusEffect(
    React.useCallback(() => {
      // This will run when the screen is focused
      load();
    }, [])
  );

  const renderPostItem = ({ item }) => (
    <TouchableOpacity style={styles.postItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={{ uri: item.headerImageUrl }} style={styles.headerImage} />
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.infoContainer}>
        <Text>Views: {item.viewsCount}</Text>
        <Text>Likes: {item.likesCount}</Text>
        <Text>Comments: {item.commentsCount}</Text>
        <Text>Author: {item.author}</Text>
      </View>
      
      <TouchableOpacity onPress={(e)=>deleteBlog(e,item._id)}>
      <Text style={styles.title} >Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        {  data.length===0 &&    <Text style={styles.info}>No Posts Yet</Text>
}
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
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  thumbnail: {
    width: 100,
    height: 100,
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
  footerImage: {
    width: '100%',
    height: 150,
  },
  info:{
    marginLeft:16,
    alignItems:'center',
    textAlign:"center"
  }
});

export default MyPost;


