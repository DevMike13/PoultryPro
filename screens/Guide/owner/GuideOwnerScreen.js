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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>

        <View style={styles.footerContainer}>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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