import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true, // Enable sound
      shouldSetBadge: false,
    }),
  });
  

export const schedulePushNotification = async (title, body, trigger) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
        },
        trigger: { seconds: 2 },
    });
}

export const requestNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();;
    if (status !== 'granted') {
        console.warn('Notification permission denied.');
    }
};
  
export const registerForPushNotificationsAsync = async () => {
    let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'f91f8f13-5d0c-4816-a622-c9cc3c5773ce' })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}