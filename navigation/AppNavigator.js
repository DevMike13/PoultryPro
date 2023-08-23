import React, { useEffect, useState }from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/Login/LoginScreen';
import Onboarding from '../screens/Onboarding/Onboarding';
import MainScreen from '../screens/Tabs/MainScreen';
import FarmerScreen from '../screens/Tabs2/FarmerScreen';
import RegisterScreen from '../screens/Registration/RegisterScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
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
