import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import firebase from './firebase';
import Constants from "expo-constants";

import { Platform } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePushNotifications = () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldShowAlert: true,
        shouldSetBadge: false,
      }),
    });
  
    // Initialize expoPushToken and notification using useState
    const [expoPushToken, setExpoPushToken] = useState(undefined);
    const [notification, setNotification] = useState(undefined);
  
    const notificationListener = useRef();
    const responseListener = useRef();
  
    async function registerForPushNotificationsAsync() {
      let token;
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
  
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification");
          return;
        }
  
        token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        });
      } else {
        alert("Must be using a physical device for Push notifications");
      }
  
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
  
      // Set the expoPushToken using the setter function
      setExpoPushToken(token);
  
      return token;
    }
  
    useEffect(() => {
      registerForPushNotificationsAsync().then((token) => {
        // Set the expoPushToken using the setter function
        setExpoPushToken(token);
      });
  
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          // Set the notification using the setter function
          setNotification(notification);
        });
  
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
  
      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
  
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

    const storeDeviceTokenInFirestore = async (token) => {
      try {
        // Store the device token in Firestore only if it hasn't been stored before
        const tokenExists = await AsyncStorage.getItem('expoPushTokenStored');
        if (!tokenExists) {
          const db = firebase.firestore();
          const deviceTokensRef = db.collection('deviceTokens');

          await deviceTokensRef.add({
              token: token,
          });

          console.log('Device Token stored in Firestore:', token);

          // Mark that the token has been stored to prevent redundant storage
          await AsyncStorage.setItem('expoPushTokenStored', 'true');
        }
      } catch (error) {
        console.error('Error storing device token in Firestore:', error);
      }
    };

    useEffect(() => {
      registerForPushNotificationsAsync().then((token) => {
        // Set the expoPushToken using the setter function
        setExpoPushToken(token);
  
        // Store the device token in Firestore
        storeDeviceTokenInFirestore(token);
      });
  
      // ... (rest of your existing code)
    }, []);
  
    return {
      expoPushToken,
      notification,
    };
  };
  