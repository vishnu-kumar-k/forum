import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { axiosPrivate } from "../axiosPrivate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { ScrollView } from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
const Upload = () => {
  const [title, setTitle] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [footerImage, setFooterImage] = useState("");

  const [headerImageURI, setHeaderImageURI] = useState("");
  const [footerImageURI, setFooterImageURI] = useState("");
  const [headerImageType, setHeaderImageType] = useState("");
  const [footerImageType, setFooterImageType] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const clear = () => {
    setTitle("");
    setHeaderImage("");
    setFooterImage("");
    setDescription("");
    setAuthor("");
    setError("");
  };

  const handleUpload = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem("userDetails"));
      const formData = new FormData();

      formData.append("title", title);
      formData.append("headerImage", headerImage);
      formData.append("footerImage", footerImage);
      formData.append("headerImageType", headerImageType);
      formData.append("footerImageType", footerImageType);
      formData.append("description", description);
      formData.append("author", author);
      formData.append("userId", value._id);

      await axiosPrivate.post("blog/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clear();
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setSuccess(false);
      setError(true);
      console.error("Error uploading data:", error);
    }
  };

  const selectHeaderFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      console.log(result);
      if (!result.canceled) {
        setHeaderImageType(result.assets[0].name);
        setHeaderImageURI(result.assets[0].uri);
        try {
          const fileContent = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );

          setHeaderImage(fileContent);
        } catch (readFileError) {
          console.error("Error reading file:", readFileError);
        }
      } else {
        console.log("Document picking cancelled.");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const selectFooterFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.canceled) {
        setFooterImageType(result.assets[0].name);
        setFooterImageURI(result.assets[0].uri);
        try {
          const fileContent = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );

          setFooterImage(fileContent);
        } catch (readFileError) {
          console.error("Error reading file:", readFileError);
        }
      } else {
        console.log("Document picking cancelled.");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Upload Post</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          style={styles.descriptionInput}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Author"
          value={author}
          onChangeText={(text) => setAuthor(text)}
        />
        <Text style={styles.titleText}>Select Header Image</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={selectHeaderFile}>
          <View style={styles.imagePreviewContainer}>
            {headerImage ? (
              <Image
                source={{ uri: headerImageURI }}
                style={styles.previewImage}
              />
            ) : (
              <Image
                source={require("../assets/download1.png")}
                style={styles.previewImage}
              />
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.titleText}>Select Footer Image</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={selectFooterFile}>
          <View style={styles.imagePreviewContainer}>
            {footerImage ? (
              <Image
                source={{ uri: footerImageURI }}
                style={styles.previewImage}
              />
            ) : (
              <Image
                source={require("../assets/download1.png")}
                style={styles.previewImage}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <Text style={styles.buttonText}>Upload</Text>
        </TouchableOpacity>
        {success && (
          <Text style={styles.successMessage}>Uploaded Successfully</Text>
        )}
        {error && <Text style={styles.errorMessage}>Failed to Upload</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
  successMessage: {
    color: "green",
    marginTop: 10,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
  imagePicker: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  imagePreviewContainer: {
    marginTop: 10,
    borderStyle: "dashed",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: 275,
  },
  titleText: {
    marginTop: 2,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100, // Increased height for the description input
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 5,
  },
});

export default Upload;
