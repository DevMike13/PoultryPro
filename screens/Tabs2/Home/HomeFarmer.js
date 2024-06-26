import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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
      await AsyncStorage.removeItem('hasSeenGuide');
      await AsyncStorage.removeItem('acceptedTerms');
     
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

  const getMeasurementTextColorHumid = () => {
    if (humidity && humidity.humidity > 90) {
      return 'red'; // Very high temperature, set color to red
    } else if (humidity && humidity.humidity < 28) {
      return 'lightblue'; // Very low temperature, set color to light blue
    } else {
      return '#90EE90'; // Normal temperature, set color to green
    }
  };

  useEffect(() => {
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={styles.icon}
              source={require('../../../assets/fortopicon.png')}
            />
            <Text style={styles.headerTitle}>
              PoultryPro
            </Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>
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
            <Text style={[styles.cardMeasurementText, {color: getMeasurementTextColorHumid()}]}>
              {
                humidity && humidity.humidity > 90
                ? 'Very high'
                : humidity && humidity.humidity < 28
                ? 'Very low'
                : 'Normal'
              }
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