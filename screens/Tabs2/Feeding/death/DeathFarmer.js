import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import { FONT, SIZES, COLORS } from '../../../../constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';

import firebase from '../../../../firebase';

import styles from './death.style';

const DeathFarmer = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [counter, setCounter] = useState(0);

  const [chickenData, setChickenData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const successToast = () => {
      //function to make Toast With Duration
      ToastAndroid.showWithGravity('Mortality Added', 
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  };

  const fetchChickensData = async () => {
    try {
      const collectionRef = firebase.firestore().collection('chickens');
      const querySnapshot = await collectionRef.get();

      const fetchedChickensData = [];
      querySnapshot.forEach((doc) => {
        fetchedChickensData.push({ id: doc.id, ...doc.data() });
      });

      // Update the state with fetched data
      setChickenData(fetchedChickensData);
      setIsLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error('Error fetching chickens data:', error);
    }
  };

  useEffect(() => {
    fetchChickensData();
  }, []);
  
  const addMortalityData = async () => {
    try {
      const firestore = firebase.firestore();
      const batch = firestore.batch();
      
      const chickenDocRef = firestore.collection('chickens').doc('jkrXmOvj1dOtfDdC1992'); // Replace with the actual document ID
      batch.update(chickenDocRef, { count: firebase.firestore.FieldValue.increment(-counter) });

      // Add a new document to the chickens_mortality collection
      const mortalityCollectionRef = firestore.collection('chickens_mortality');
      const newMortalityData = {
        count: counter,
        mortality_date: firebase.firestore.Timestamp.fromDate(selectedDate),
      };
      batch.set(mortalityCollectionRef.doc(), newMortalityData);

      if(counter >= 0){
        await batch.commit();
        fetchChickensData();
        successToast();
      }
      
      console.log('Mortality data added successfully');
    } catch (error) {
      console.error('Error adding mortality data:', error);
    }
  };

  const handleDateChange = (event, selected) => {
    if (selected) {
      setSelectedDate(selected);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const formatDate = date => {
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  };

  const resetCounter = () => {
    if (counter !== 0) {
      setCounter(0);
    }
  };

  const incrementCounter = () => {
    setCounter(counter + 1);
  };
          
  const decrementCounter = () => {
    if (counter !== 0) {
        setCounter(counter - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeader}>Total number of chicken</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          chickenData.map((chicken) => (
            <Text key={chicken.id} style={styles.contentValueText}> {chicken.count.toLocaleString()} </Text>
          ))
        )}
        
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeader}>Chicken died today</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 60, marginTop: 20}}>
          <TouchableOpacity style={styles.addAndMinBtn} onPress={incrementCounter}>
            <Ionicons
              name="add"
              size={28}
              color={COLORS.lightWhite}
            />
          </TouchableOpacity>
          <Text style={styles.contentValueText}> {counter} </Text>
          <TouchableOpacity style={styles.addAndMinBtn} onPress={decrementCounter}>
            <Ionicons
              name="remove"
              size={28}
              color={COLORS.lightWhite}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.confirmBtn} onPress={() =>{
          resetCounter();
          addMortalityData();
        }}>
          <Text style={styles.confirmBtnText}>
            Confirm
          </Text>
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Date: </Text>
          <TouchableOpacity onPress={toggleDatePicker} style={{ backgroundColor: COLORS.gray2, paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", gap: 15, borderRadius: SIZES.small }}>
            <Text style={styles.dateText}>
              {formatDate(selectedDate)}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={20}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeader}>Total Population</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          chickenData.map((chicken) => (
            <Text key={chicken.id} style={styles.contentValueText}> {chicken.count.toLocaleString()} </Text>
          ))
        )}
      </View>
    </SafeAreaView>
  )
}

export default DeathFarmer