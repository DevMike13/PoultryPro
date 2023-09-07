import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import firebase from '../../../firebase';

import styles from './home.style';
const Home = ({ navigation }) => {
  const [humidity, setHumidity] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // Start loading
    setLoading(true);

   // Listen for changes in humidity data
    humidityRef.on('value', (snapshot) => {
      try {
        const humidityValue = snapshot.val();
        setHumidity(humidityValue);
        setLoading(false); // Stop loading when data is available
      } catch (error) {
        console.error('Error reading humidity:', error);
        setLoading(false); // Stop loading in case of an error
      }
    });

    // Listen for changes in temperature data
    temperatureRef.on('value', (snapshot) => {
      try {
        const temperatureValue = snapshot.val();
        setTemperature(temperatureValue);
        setLoading(false); // Stop loading when data is available
      } catch (error) {
        console.error('Error reading temperature:', error);
        setLoading(false); // Stop loading in case of an error
      }
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

            { loading ? (
             <ActivityIndicator size="large" color="#0000ff" style={{ width: 50 }} />
            ) : (
              <Text style={styles.cardValueText}> 
                {humidity ? `${humidity.humidity}%` : 'N/A'}
              </Text>
            )}
           
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

export default Home