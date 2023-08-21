import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './Home/Home';
import Data from './Data/Data';

import { COLORS, FONT, SIZES } from '../../constants/theme';

const Tab = createBottomTabNavigator();

const MainScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1}}>
        <Tab.Navigator 
          screenOptions={{
            tabBarStyle: {
              height: 60,
              paddingTop: 10,
              paddingBottom: 10,
              marginBottom: 30,
              marginHorizontal: 15,
              borderRadius: SIZES.medium
            },
          }}
        >
            <Tab.Screen 
              name="Home" 
              component={Home} 
              options={{
                tabBarLabel: (tabInfo) => {
                  return (
                    <Text
                      style={{ 
                        color: tabInfo.focused ? COLORS.tertiary : COLORS.gray4, 
                        fontFamily: tabInfo.focused ? FONT.bold : FONT.regular, 
                        fontSize: SIZES.small
                      }}
                    >
                      Home
                    </Text>
                  );
                },
                tabBarIcon: (iconInfo) => {
                  return (
                    <Ionicons
                      name={iconInfo.focused ? "home" : "home-outline"}
                      size={iconInfo.focused ? 24 : 20}
                      color={iconInfo.focused ? COLORS.tertiary : COLORS.gray4}
                    />
                  );
                },
                headerTitle: "",
                headerStyle:{
                  backgroundColor:COLORS.lightWhite,
                },
                headerShown: false,
                headerShadowVisible: false
              }}
            />

            <Tab.Screen 
              name="Data" 
              component={Data} 
              options={{
                tabBarLabel: (tabInfo) => {
                  return (
                    <Text
                      style={{ 
                        color: tabInfo.focused ? COLORS.tertiary : COLORS.gray4, 
                        fontFamily: tabInfo.focused ? FONT.bold : FONT.regular,
                        fontSize: SIZES.small
                      }}
                    >
                      Data
                    </Text>
                  );
                },
                tabBarIcon: (iconInfo) => {
                  return (
                    <Ionicons
                      name={iconInfo.focused ? "bar-chart" : "bar-chart-outline"} 
                      size={iconInfo.focused ? 24 : 20}
                      color={iconInfo.focused ? COLORS.tertiary : COLORS.gray4}
                    />
                  );
                },
                headerTitle: "",
                headerStyle:{
                  backgroundColor:COLORS.lightWhite,
                },
                headerShadowVisible: false,
                headerShown: false,
              }}
            />
        </Tab.Navigator>
    </SafeAreaView>
  )
}

export default MainScreen