import React, { useEffect, useState, useRef }from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { registerForPushNotificationsAsync, requestNotificationPermission } from '../utils/notification';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/Login/LoginScreen';
import Onboarding from '../screens/Onboarding/Onboarding';
import MainScreen from '../screens/Tabs/MainScreen';
import FarmerScreen from '../screens/Tabs2/FarmerScreen';
import RegisterScreen from '../screens/Registration/RegisterScreen';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const Stack = createStackNavigator();

const AppNavigator = () => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    // Inside your App component 
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        requestNotificationPermission();
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="Onboarding" 
                    component={Onboarding} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="MainScreen" 
                    component={MainScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="FarmerScreen" 
                    component={FarmerScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="RegisterScreen" 
                    component={RegisterScreen} 
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
