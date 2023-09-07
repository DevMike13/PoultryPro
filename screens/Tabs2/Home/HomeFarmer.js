import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../firebase';

import styles from './home.style';
const HomeFarmer = ({ navigation }) => {
  const [humidity, setHumidity] = useState(null);
  const [temperature, setTemperature] = useState(null);

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

  useEffect(() => {
    // Set up Firebase real-time listeners
    const humidityRef = firebase.database().ref('humidity');
    const temperatureRef = firebase.database().ref('temperature');

    // Listen for changes in humidity data
    humidityRef.on('value', (snapshot) => {
      const humidityValue = snapshot.val();
      setHumidity(humidityValue);
    });

    // Listen for changes in temperature data
    temperatureRef.on('value', (snapshot) => {
      const temperatureValue = snapshot.val();
      setTemperature(temperatureValue);
    });

    // Clean up the listeners when the component unmounts
    return () => {
      humidityRef.off();
      temperatureRef.off();
    };
  }, []);

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
              {humidity ? `${humidity.humidity}%` : 'Loading...'}
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
              {temperature ? `${temperature.temperature}°C` : 'Loading...'}
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

export default HomeFarmer