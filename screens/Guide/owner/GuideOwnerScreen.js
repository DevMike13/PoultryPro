import React from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FONT, COLORS, SHADOWS, SIZES } from '../../../constants/theme';
import styles from './guideOwner.style';
const GuideOwnerScreen = () => {

  const navigation = useNavigation();

  const handleContinue = async () => {
    // Set the flag in AsyncStorage to indicate that the user has seen the guide
    try {
      await AsyncStorage.setItem('hasSeenGuide', 'true');
      const userType = await AsyncStorage.getItem('userType');

      if (userType === 'owner') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainScreen' }],
        });
      } else if (userType === 'farmer') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'FarmerScreen' }],
        });
      }
    } catch (error) {
      console.error('AsyncStorage Error:', error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ justifyContent: "center", alignItems: "center", paddingVertical: 50 }}>
        <View style={styles.headerContainer}>
            <Image
                style={styles.icon}
                source={require('../../../assets/adaptive-icon.png')}
            />
            <Text style={styles.headerText}>Poultry Pro</Text>
        </View>
        <View style={styles.guideContainer}>
          <View style={styles.guideTiles}>
            <Ionicons
              name="home"
              size={30}
              color={COLORS.tertiary}
            />
            <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium, color: COLORS.tertiary }}>Home</Text>
          </View>

          <View style={styles.guideTiles}>
            <Ionicons
              name="bar-chart-outline"
              size={30}
              color={COLORS.gray4}
            />
            <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium, color: COLORS.gray4 }}>Data</Text>
          </View>
        </View>
        <Text style={styles.description}>
          The Home Button in our poultry farm mobile application serves as the central hub for users to access essential real-time information about their poultry house. When you tap on the Home Button, it provides you with an instant snapshot of the current environmental conditions inside your poultry house. This includes the temperature and humidity levels, vital factors for ensuring the well-being and productivity of your poultry.
        </Text>
        <View style={[styles.guideContainer, {marginTop : 20}]}>
          <View style={styles.guideTiles}>
            <Ionicons
              name="home"
              size={30}
              color={COLORS.gray4}
            />
            <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium, color: COLORS.gray4 }}>Home</Text>
          </View>

          <View style={styles.guideTiles}>
            <Ionicons
              name="bar-chart"
              size={30}
              color={COLORS.tertiary}
            />
            <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium, color: COLORS.tertiary }}>Data</Text>
          </View>
        </View>
        <Text style={styles.description}>
          The Data Button in our poultry farm mobile application is your gateway to a comprehensive repository of critical data related to the poultry farm data. It provides valuable insights and historical records to help you make informed decisions. 
        </Text>

        <View style={styles.footerContainer}>
          <Text style={styles.description}>
            <Text style={{ fontFamily: FONT.bold }}>Mortality Data:</Text> This section displays data related to the mortality rate of your chickens. It tracks and records the number of chickens that have passed away, helping you monitor and analyze any health issues or potential concerns.
          </Text>
          <Text style={styles.description}>
            <Text style={{ fontFamily: FONT.bold }}>Average Temperature:</Text> Here, you can access historical data on the average temperature inside your poultry house. This information assists you in maintaining the ideal climate conditions for your birds.
          </Text>
          <Text style={styles.description}>
            <Text style={{ fontFamily: FONT.bold }}>Chicken Data:</Text> This section presents a breakdown of the number of chickens in various categories, including healthy ones, those in need of special attention, and any that have been rejected for sale or consumption. This data allows you to manage your poultry population effectively.
          </Text>
          <Text style={styles.description}>
            <Text style={{ fontFamily: FONT.bold }}>Harvest Summary:</Text> The Harvest Summary provides a batch-wise overview of the number of chickens harvested. It includes data on the weight, quality, and other relevant information for each batch. This helps you evaluate the success of your harvests and make improvements as needed.
          </Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default GuideOwnerScreen