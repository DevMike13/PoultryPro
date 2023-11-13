import { useCallback, useEffect, useState, useRef } from "react";
import { Vibration, Platform } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { useFonts } from 'expo-font';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';


import { usePushNotifications } from "./useNotifications";

import firebase from './firebase';

import UserContext from './UserContext'; 


Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
  }),
});


const App = () => {
  
  useEffect(() => {
    // Request permissions for notifications
    const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission to receive push notifications denied.');
        return;
      }

      // if (Platform.OS === "android") {
      //   Notifications.setNotificationChannelAsync("default", {
      //     name: "default",
      //     importance: Notifications.AndroidImportance.MAX,
      //     vibrationPattern: [0, 250, 250, 250],
      //     lightColor: "#FF231F7C",
      //     sound: "alarm",
      //     vibrate: false
      //   });
      // }
    };

    registerForPushNotificationsAsync();
  }, []);

  const { expoPushToken } = usePushNotifications();
  // console.log(expoPushToken);

  // Handle push notifications when the app is killed or closed
  useEffect(() => {
    const notificationListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const temperatureValue = response.notification.request.content.data.temperature;
      // Handle the temperature value here when the app is launched from a push notification.
      console.log(`Received push notification with temperature: ${temperatureValue}`);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  const [userData, setUserData] = useState(null);
  const [loaded] = useFonts({
    "DMBold": require('./assets/fonts/DMSans-Bold.ttf'),
    "DMMedium": require('./assets/fonts/DMSans-Medium.ttf'),
    "DMRegular": require('./assets/fonts/DMSans-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <AppNavigator />
    </UserContext.Provider>
  );
  
};

export default App;
