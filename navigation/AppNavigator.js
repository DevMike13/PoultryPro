import React, { useEffect, useState, useRef }from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/Login/LoginScreen';
import Onboarding from '../screens/Onboarding/Onboarding';
import FarmerGuideScreen from '../screens/Guide/farmer/GuideFarmerScreen';
import OwnerGuideScreen from '../screens/Guide/owner/GuideOwnerScreen';
import MainScreen from '../screens/Tabs/MainScreen';
import FarmerScreen from '../screens/Tabs2/FarmerScreen';
import RegisterScreen from '../screens/Registration/RegisterScreen';
import ResetPasswordScreen from '../screens/Reset/ResetPasswordScreen';
import TermsAndConditionScreen from '../screens/TermsAndCondition/TermsAndConditionScreen';
import TermsAndConditionReadOnly from '../screens/TermsAndCondition/ReadOnly/TermsAndCondition';

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
                    name="FarmerGuide" 
                    component={FarmerGuideScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="OwnerGuide"
                    component={OwnerGuideScreen} 
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
                {/* <Stack.Screen 
                    name="RegisterScreen" 
                    component={RegisterScreen} 
                    options={{ headerShown: false }}
                /> */}
                <Stack.Screen 
                    name="ResetPasswordScreen" 
                    component={ResetPasswordScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="TermsAndConditionScreen" 
                    component={TermsAndConditionScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="TermsAndConditionReadOnly" 
                    component={TermsAndConditionReadOnly} 
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
