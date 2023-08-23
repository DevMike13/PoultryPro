import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import firebase from '../../../firebase';

import styles from './home.style';
const Home = ({ navigation }) => {

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userType');
  
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            Poultry Pro
          </Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            May 25, 2023
          </Text>
          <Text style={styles.timeText}>
            2:36:28 PM
          </Text>
        </View>

        {/* HUMIDITY DATA */}
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons
                name="water"
                size={80}
            />
          </View>
          <View style={styles.cardData}>
            {/* Title */}
            <Text style={styles.cardTitle}>
              Humidity
            </Text>

            {/* Value */}
            <Text style={styles.cardValueText}>
              70%
            </Text>

            {/* Measurement */}
            <Text style={styles.cardMeasurementText}>
              Normal
            </Text>
          </View>
        </View>

        {/* TEMPERATURE DATA */}
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons
                name="thermometer-outline"
                size={80}
            />
          </View>
          <View style={styles.cardData}>
            {/* Title */}
            <Text style={styles.cardTitle}>
              Temperature
            </Text>

            {/* Value */}
            <Text style={styles.cardValueText}>
              32 C
            </Text>

            {/* Measurement */}
            <Text style={styles.cardMeasurementText}>
              Normal
            </Text>
          </View>
        </View>
    </SafeAreaView>
  )
}

export default Home