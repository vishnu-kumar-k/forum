// App.js
import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Screens/Home";
import Upload from "./Screens/Upload";
import CustomTabBarIcon from "./Components/CustomTabIcon";
import Profile from "./Screens/Profile";
import Notification from "./Screens/Notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./Screens/Login";
import { axiosPrivate } from "./axiosPrivate";
import MyPost from "./Screens/MyPost";
import Favourites from "./Screens/Favourites";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
function Root() {
  const [user, setUser] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [isErrorLogin, setIsErrorLogin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const value = await AsyncStorage.getItem("userDetails");
        setUser(JSON.parse(value));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async (data) => {
    try {
      console.log(data);
      if (!data.email || !data.password) {
        setIsErrorLogin(true);
        setLoginErrorMessage("Email & Password is Required");
        return;
      }
      const res = await axiosPrivate.post("auth/login", data);
      await AsyncStorage.setItem(
        "userDetails",
        JSON.stringify(res.data.details)
      );
      setUser(res.data.details);
      setIsErrorLogin(false);
      setLoginErrorMessage("");
    } catch (error) {
      setIsErrorLogin(true);
      setLoginErrorMessage("Wrong password and Email");
    }
  };

  const handleLogout = async () => {
    console.log("Logging out");
    await AsyncStorage.removeItem("userDetails");
    setUser(null);
  };
  if (!user) {
    console.log(user);
    return (
      <LoginScreen
        setUser={setUser}
        handleLogin={handleLogin}
        setIsErrorLogin={setIsErrorLogin}
        isErrorLogin={isErrorLogin}
        loginErrorMessage={loginErrorMessage}
      />
    );
  }
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon focused={focused} type="Home" />
          ),
        }}
      >
        {() => <Home user={user} />}
      </Tab.Screen>
      <Tab.Screen
        name="Favourites"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon focused={focused} type="Favourites" />
          ),
        }}
      >
        {() => <Favourites user={user} />}
      </Tab.Screen>
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon focused={focused} type="Upload" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon focused={focused} type="Profile" />
          ),
        }}
      >
        {() => <Profile onLogout={handleLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="Notification"
        options={{
          tabBarIcon: ({ focused }) => (
            <CustomTabBarIcon focused={focused} type="Notification" />
          ),
        }}
      >
        {() => <Notification user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
