import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import firebase from '../../../firebase';
import { schedulePushNotification } from '../../../utils/notification';

import styles from './home.style';
const HomeFarmer = ({ navigation }) => {
  const [humidity, setHumidity] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationSent, setNotificationSent] = useState(false); // Track if notification has been sent

  const [currentDate, setCurrentDate] = useState(new Date());

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

        // Check if temperature is greater than 32°C and send a notification
        // if (temperatureValue && temperatureValue.temperature > 32 && !notificationSent) {
        //   // Adjust the notification message as needed
        //   schedulePushNotification('High Temperature Alert', 'Temperature is above 32°C');
        //   setNotificationSent(true); // Mark notification as sent
        // } else if (temperatureValue && temperatureValue.temperature < 18  && !notificationSent) {
        //   // Adjust the notification message as needed
        //   schedulePushNotification('Low Temperature Alert', 'Temperature is below 18°C');
        //   setNotificationSent(true); // Mark notification as sent
        // } else if (temperatureValue && temperatureValue.temperature >= 18 && temperatureValue.temperature <= 32){
        //   setNotificationSent(false);
        // }
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
  }, [notificationSent]);

  const getMeasurementTextColor = () => {
    if (temperature && temperature.temperature > 32) {
      return 'red'; // Very high temperature, set color to red
    } else if (temperature && temperature.temperature < 18) {
      return 'lightblue'; // Very low temperature, set color to light blue
    } else {
      return '#90EE90'; // Normal temperature, set color to green
    }
  };

  useEffect(() => {
    // ... (your Firebase real-time listeners)

    // Update the current date and time every second
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
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
            {format(currentDate, "MMM. d, yyyy")}
          </Text>
          <Text style={styles.timeText}>
            {format(currentDate, "h:mm:ss a")}
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
           { loading ? (
             <ActivityIndicator size="large" color="#0000ff" style={{ width: 50 }} />
            ) : (
              <Text style={styles.cardValueText}>
              {temperature ? `${temperature.temperature}°C` : 'N/A'}
            </Text>
            )} 
            

           {/* Measurement */}
           <Text style={[styles.cardMeasurementText, {color: getMeasurementTextColor()}]}>
              {
                temperature && temperature.temperature > 32
                ? 'Very high'
                : temperature && temperature.temperature < 18
                ? 'Very low'
                : 'Normal'
              }
            </Text>
          </View>
        </View>
    </SafeAreaView>
  )
}

export default HomeFarmer