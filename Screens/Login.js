import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { axiosPrivate } from "../axiosPrivate";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({
  setUser,
  handleLogin,
  isErrorLogin,
  loginErrorMessage,
  setIsErrorLogin,
}) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [userTypes, setUserType] = useState("");
  const [hidePassword, setHidePassword] = useState(true); // New state variable

  const [isErrorSignup, setIsErrorSignup] = useState(false);

  const [LoginState, setLoginState] = useState(true);
  const [choice, setChoice] = useState([
    { label: "Student", value: "Student" },
    { label: "Staff", value: "Staff" },
  ]);

  const clear = () => {
    setUser("");
    setEmail("");
    setPassword("");
    setCPassword("");
    setUserType("");
  };

  const handleSignUp = async () => {
    try {
      const data = { username, email, password, userTypes };
      const res = await axiosPrivate.post("auth/signup", data);
      console.log(res);
      clear();
      setLoginState(true);
      setIsErrorSignup(false);
    } catch (err) {
      setIsErrorSignup(true);
      console.log("Failed to sign up" + err);
    }
  };

  const handleLocalLogin = () => {
    const data = { email, password };
    handleLogin(data);
  };

  return (
    <>
      {LoginState ? (
        <View style={styles.container}>
          <Image
            source={require("../assets/logo2.png")} // Replace with the path to your app logo
            style={styles.applogo}
          />
          {/* <Text style={styles.title}>Login</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              secureTextEntry={hidePassword}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setHidePassword(!hidePassword)}
            >
              <Image
                source={
                  hidePassword
                    ? require("../assets/hide.png")
                    : require("../assets/show.png")
                }
                style={styles.logo}
              />
            </TouchableOpacity>
          </View>
          {isErrorLogin && (
            <Text style={styles.error}>{loginErrorMessage}</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={handleLocalLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLoginState(false);
              setIsErrorLogin(false);
            }}
          >
            <Text style={styles.signUpText}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <Image
            source={require("../assets/logo2.png")} // Replace with the path to your app logo
            style={styles.applogo}
          />
          {/* <Text style={styles.title}>SignUp</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={hidePassword} // Use secureTextEntry conditionally
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            onChangeText={(text) => setCPassword(text)}
          />

          <DropDownPicker
            open={open}
            value={userTypes}
            items={choice}
            setOpen={setOpen}
            setValue={setUserType}
            setItems={setChoice}
            containerStyle={{ height: 40, width: "80%", marginBottom: 16 }}
            style={{
              backgroundColor: "#ffffff",
              borderColor: "gray",
              zIndex: 1,
            }} // Adjust zIndex
            dropDownContainerStyle={{
              backgroundColor: "#ffffff",
              zIndex: 1,
              overflow: "hidden",
            }} // Adjust zIndex and overflow
            dropDownStyle={{ backgroundColor: "#ffffff" }}
            placeholder={"Choose an account Type"}
          />
          {isErrorSignup && (
            <Text style={styles.error}>Please Fill the details correctly</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setLoginState(true);
              setIsErrorSignup(false);
            }}
          >
            <Text style={styles.signUpText}>Have an account? Log In</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white"
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
    borderRadius: 10,
  },
  dropdownInput: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    marginLeft: 35,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#3871C1",
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  signUpText: {
    color: "#F68712",
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
    width: "80%",
    marginBottom: 16,
  },
  passwordInput: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 10,
  },
  eyeIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  logo: {
    width: 24, // Adjust the width and height as needed
    height: 24,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 55, // Adjust the marginTop as needed
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold", // Adjust the fontWeight as needed
    marginBottom: 1,
  },
  applogo: {
    width: 200, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    marginTop: -55,
  },
  error: {
    color: "red",
  },
});

export default LoginScreen;
