import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, Animated, TextInput, ToastAndroid } from 'react-native';
import { FONT, SIZES, COLORS } from '../../../../constants/theme';
import { addDays, format } from 'date-fns';

import firebase from '../../../../firebase';

import styles from './summary.style';

const SummaryFarmer = () => {

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const [currentDate, setCurrentDate] = useState('');
  const [futureDate, setFutureDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSame, setIsSame] = useState(false);

  const [numberOfChickens, setNumberOfChickens] = useState('');

  const [batchNo, setBatchNo] = useState('');
  const [btData, setBtData] = useState([]);

  useEffect(() => {
    // Get the current date and set it to the state
    const date = new Date();
    const formattedDate = format(date, 'MMM d, yyyy');
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    // Get the current date
    const currentDate = new Date();

    // Calculate future date by adding 45 days using date-fns
    const futureDate = addDays(currentDate, 45);

    // Format the future date using date-fns
    const formattedFutureDate = format(futureDate, 'MMM d, yyyy');

    setFutureDate(formattedFutureDate);
  }, []);

  const toggleCreateVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  useEffect(() => {
    const newValue = isFilterVisible ? 1 : 0;
    
    Animated.timing(animation, {
      toValue: newValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFilterVisible]);
  
  const filterStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0], // Adjust the values as needed
        }),
      },
    ],
  };

  // FIREBASE CREATE NEW BATCH
  const handleConfirm = async () => {
    const db = firebase.firestore();

    // Get the current counter value
    const counterDocRef = db.collection('meta').doc('counters');
    const counterDoc = await counterDocRef.get();

    let batchNumber = 1; // Default value if counter document doesn't exist

    if (counterDoc.exists) {
      batchNumber = counterDoc.data().batchCounter;
    }
    // Create an empty document to get an auto-incremented ID
    const newBatchDocRef = db.collection('batch').doc(batchNumber.toString());
  
    const currentDate = new Date();
    const futureDate = addDays(currentDate, 45);
  
    const batchData = {
      batch_no: batchNumber,
      cycle_started: firebase.firestore.FieldValue.serverTimestamp(),
      cycle_expected_end_date: futureDate,
      no_of_chicken: parseInt(numberOfChickens),
    };
  
    // Set the document data with the specified fields
    await newBatchDocRef.set(batchData);

    // Update the counter value
    if (counterDoc.exists) {
      await counterDocRef.update({ batchCounter: batchNumber + 1 });
    } else {
      await counterDocRef.set({ batchCounter: batchNumber + 1 });
    }
    
    console.log('Batch added successfully');
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

  const fetchBatchByBatchNo = async (batchNo) => {
    const db = firebase.firestore();
  
    try {
      const batchQuery = await db.collection('batch').where('batch_no', '==', batchNo).get();
  
      if (!batchQuery.empty) {
        batchQuery.forEach((doc) => {
          const batchData = doc.data();
          setBtData(batchData);
          console.log('Batch Data :', batchData);
          setIsLoading(false);
        });
      } else {
        console.log('No batch documents found for the specified batch_no.');
      }
    } catch (error) {
      console.error('Error fetching batch:', error);
    }
  };

  const checkDateDifference = (compareFrom, compareTo)=> {
    
    if (!compareFrom || !compareTo) {
      return false; // If either date is null or undefined, they can't be equal
    }
    return compareFrom.getTime() === compareTo.getTime();
  }

  useEffect(() => {
    fetchBatchByBatchNo(batchNo); // Fetch batch data based on the updated batchNo
  }, [batchNo]); // Trigger when batchNo changes

  useEffect(() => {
    // Fetch the batch counter value and update batchNo state
    fetchBatchCounter();
  }, []);

  useEffect(() => {
    const endDate = btData.cycle_expected_end_date ? btData.cycle_expected_end_date.toDate() : null;
    const dateNow = new Date();
    
    const datesEqual = checkDateDifference(endDate, dateNow);
    setIsSame(datesEqual); // Move this into the useEffect to avoid infinite re-renders
    console.log(isSame);

  }, [btData.cycle_expected_end_date]);

  const successToast = () => {
    //function to make Toast With Duration
    ToastAndroid.showWithGravity('Your last cycle is not finished!', 
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  };
  return (
    <SafeAreaView style={styles.container}>
        { isSame != false ? (
          <TouchableOpacity style={styles.createBtn} onPress={toggleCreateVisibility}>
            <Text style={styles.createBtnText}>
              Create New Batch
            </Text>
            <Ionicons
              name="add"
              size={20}
              color={COLORS.lightWhite}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.createBtn, {backgroundColor: COLORS.gray2}]} onPress={successToast}>
            <Text style={styles.createBtnText}>
              Create New Batch
            </Text>
            <Ionicons
              name="add"
              size={20}
              color={COLORS.lightWhite}
            />
          </TouchableOpacity>
        )}
        {isFilterVisible && (
          <Animated.View style={[styles.createContainer, filterStyle]}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitleText}>Batch No.: </Text>
              <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inInput}
                    placeholder='Auto-Generated'
                    textAlign={'center'}
                    keyboardType={'numeric'}
                    editable={false}
                    // value={email}
                    // onChangeText={setEmail}
                  />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitleText}>Number of chicken: </Text>
              <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inInput}
                    placeholder='Input number of chicken'
                    textAlign={'center'}
                    keyboardType={'numeric'}
                    value={numberOfChickens}
                    onChangeText={setNumberOfChickens}
                  />
              </View>
            </View>
            <View style={styles.cycleContainer}>
              <View>
                <Text style={styles.cycleContainerTitle}>
                  Cycle Duration: 
                </Text>
              </View>
              <View style={styles.cycleDatesContainer}>
                <Text style={styles.cycleDateText}>
                  {currentDate}
                </Text>
                <Ionicons
                  name="remove"
                  size={20}
                />
                <Text style={styles.cycleDateText}>
                  {futureDate}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
    </SafeAreaView>
  )
}

export default SummaryFarmer