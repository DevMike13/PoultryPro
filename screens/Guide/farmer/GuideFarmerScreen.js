import React from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FONT, COLORS, SHADOWS, SIZES } from '../../../constants/theme';
import styles from './guideFarmer.style';

const GuideFarmerScreen = () => {
  
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
              name="color-fill-outline"
              size={30}
              color={COLORS.gray4}
            />
            <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium, color: COLORS.gray4 }}>Feeding/Data</Text>
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
              name="color-fill"
              size={30}
              color={COLORS.tertiary}
            />
            <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium, color: COLORS.tertiary }}>Feeding/Data</Text>
          </View>
        </View>
        <Text style={styles.description}>
          The Feeding and Data Within this feature, farmers can tailor the feeding regimen for their chickens, ensuring optimal growth and others.
        </Text>

        <View style={styles.footerContainer}>
          <Text style={styles.description}>
            <Text style={{ fontFamily: FONT.bold }}>Set Feeding Parameters:</Text> Adjust the specific amounts of water and feed to provide to your chickens by selecting diffirent set.
          </Text>
          <Text style={styles.description}>
            <Text style={{ fontFamily: FONT.bold }}>Create New Batch:</Text> Start a new batch of chickens with ease. This function allows farmers to initiate a fresh group of birds, enabling efficient management of different poultry cycles.
          </Text>
          <Text style={styles.description}>
            <Text style={{ fontFamily: FONT.bold }}>Death Input:</Text> Log the number of chicken deaths for each day. Accurate record-keeping is essential for health monitoring and swift response to any issues that may arise.
          </Text>
          <Text style={styles.description}>
            <Text style={{ fontFamily: FONT.bold }}>Harvest Input:</Text> Input the quantity of both good and bad chickens harvested. This data helps you assess the success of each batch and identify areas for improvement.
          </Text>
          <Text style={styles.description}>
            <Text style={{ fontFamily: FONT.bold }}>Harvest Summary:</Text> Access a comprehensive summary of the harvested chickens for each batch. This summary provides a clear overview of the batch's performance, including the quantity of chickens harvested and their quality.
          </Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default GuideFarmerScreen