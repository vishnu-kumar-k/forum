import { Image } from 'react-native';
export default function CustomTabBarIcon({ focused,type }) {
    // Define the source for your logo or image
    var iconSource;
    
      switch(type){
        case "Home":
          iconSource=require("../assets/home.png");
          break;
        case "Upload":
          iconSource=require("../assets/plus.png");
          break;
        case "Profile":
          iconSource=require("../assets/profile.png");
          break;
        case "Notification":
          iconSource=require("../assets/notification.png");
          break;
        case "MyPost":
          iconSource=require("../assets/mypost.png");
          break;
        case "Favourites":
          iconSource=require("../assets/favourite.png");
          break;

        
      }
    
  
    return (
      <Image
        source={iconSource}
        style={{
          width: 24, // Adjust the width and height as needed
          height: 24,
          borderRadius: focused ? 12 : 0,

        }}
      />
    );
  }
  