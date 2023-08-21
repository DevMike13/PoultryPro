import React, { useEffect, useState }from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/Login/LoginScreen';
import Onboarding from '../screens/Onboarding/Onboarding';
import MainScreen from '../screens/Tabs/MainScreen';


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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
});

export default AppNavigator;
