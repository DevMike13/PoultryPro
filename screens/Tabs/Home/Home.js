import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import firebase from '../../../firebase';

import { schedulePushNotification } from '../../../utils/notification';

import styles from './home.style';
const Home = ({ navigation }) => {
  const [humidity, setHumidity] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationSent, setNotificationSent] = useState(false); // Track if notification has been sent
  const [batchNo, setBatchNo] = useState('');

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
  
  const fetchBatchCounter = async () => {
    const db = firebase.firestore();
  
    try {
      const counterDocRef = db.collection('meta').doc('counters');
      const counterDoc = await counterDocRef.get();
  
      if (counterDoc.exists) {
        const batchCounterValue = counterDoc.data().batchCounter - 1;
        setBatchNo(batchCounterValue);
        console.log(batchCounterValue);
      } else {
        console.log('Counters document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching batch counter:', error);
    }
  };

  useEffect(() => {
    // Fetch the batch counter value and update batchNo state
    fetchBatchCounter();
  }, []);

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
        if (temperatureValue && temperatureValue.temperature > 32 && !notificationSent) {
          // Adjust the notification message as needed
          schedulePushNotification('High Temperature Alert', 'Temperature is above 32°C');
          setNotificationSent(true); // Mark notification as sent
        } else if (temperatureValue && temperatureValue.temperature < 18  && !notificationSent) {
          // Adjust the notification message as needed
          schedulePushNotification('Low Temperature Alert', 'Temperature is below 18°C');
          setNotificationSent(true); // Mark notification as sent
        } else if (temperatureValue && temperatureValue.temperature >= 18 && temperatureValue.temperature <= 32){
          setNotificationSent(false);
        }
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

  useEffect(() => {
    // Function to store data in Firestore
    const storeDataInFirestore = () => {
      console.log('Storing data in Firestore...');
      const db = firebase.firestore();
      const firestoreCollection = db.collection('temp&humid');

      // Combine temperature and humidity data into a single object with a timestamp
      const dataToStore = {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        batch_no: batchNo,
        temperature,
        humidity,

      };

      // Add the combined data to Firestore as a new document
      firestoreCollection.add(dataToStore)
        .then((docRef) => {
          console.log('Data stored in Firestore with ID:', docRef.id);
        })
        .catch((error) => {
          console.error('Error storing data in Firestore:', error);
        });
    };

    // Set up a timer to store data every 1 minute if both humidity and temperature are not null
    const timer = setInterval(() => {
      if (humidity !== null && temperature !== null) {
        storeDataInFirestore();
      } else {
        console.log('Humidity or temperature is null, skipping data storage.');
      }
    }, 600000); // 1 minute in milliseconds

    // Clean up the timer when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, [temperature, humidity]);

  const getMeasurementTextColor = () => {
    if (temperature && temperature.temperature > 32) {
      return 'red'; // Very high temperature, set color to red
    } else if (temperature && temperature.temperature < 18) {
      return 'lightblue'; // Very low temperature, set color to light blue
    } else {
      return '#90EE90'; // Normal temperature, set color to green
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

export default Home