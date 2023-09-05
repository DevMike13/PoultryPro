import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator, ToastAndroid, Modal, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

import { FONT, SIZES, COLORS } from '../../../../constants/theme';
import styles from './death.style';

import firebase from '../../../../firebase';


const DeathFarmer = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [counter, setCounter] = useState(0);

  const [chickenData, setChickenData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [batchNo, setBatchNo] = useState('');
  const [btData, setBtData] = useState([]);

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  const ConfirmationModal = () => {
    return (
      <Modal
        visible={isConfirmationModalVisible}
        transparent={true}
        animationType="fade"
      >
        <BlurView intensity={20} style={styles.overlay}></BlurView>
        {/* Modal content */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to add this mortality?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={() => {
                  addMortalityData();
                  resetCounter();
                  setIsConfirmationModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={() => {
                  resetCounter();
                  setIsConfirmationModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    );
  };

  const handleConfirmModal = () => {
    setIsConfirmationModalVisible(true);
  };

  const successToast = () => {
      //function to make Toast With Duration
    //   ToastAndroid.showWithGravity('Mortality Added', 
    //   ToastAndroid.LONG,
    //   ToastAndroid.CENTER
    // );
    Toast.show({
      type: 'success',
      text1: 'Mortality Added',
      visibilityTime: 5000, // Adjust as needed
    });
  };

  const addMortalityData = async () => {
    try {
      const firestore = firebase.firestore();
      const batch = firestore.batch();
  
      const chickenDocRef = firestore.collection('batch').doc(`${batchNo}`);
      batch.update(chickenDocRef, { no_of_chicken: firebase.firestore.FieldValue.increment(-counter) });
  
      // Add a new document to the chickens_mortality collection
      const mortalityCollectionRef = firestore.collection('mortality');
      const newMortalityData = {
        batch_no: batchNo, // Assuming you have the batchNo available
        mortality_count: counter,
        mortality_date: firebase.firestore.Timestamp.fromDate(selectedDate),
      };
      batch.set(mortalityCollectionRef.doc(), newMortalityData);
  
      if (counter >= 0) {
        await batch.commit();
        fetchBatchByBatchNo(batchNo); // Fetch batch data after the update
        successToast();
        setSelectedDate(new Date());
      }
  
      console.log('Mortality data added successfully');
    } catch (error) {
      console.error('Error adding mortality data:', error);
      console.log(batchNo);
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

  const calculateDaysDifference = (startDate, endDate) => {
    
    // Calculate the time difference in milliseconds between the two dates
    const timeDiff = endDate - startDate;
  
    // Convert the time difference to days
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  
    return daysDiff;
  }
  
  
  const formatFirestoreTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    return format(date, 'MMM d, yyyy');
  };

  useEffect(() => {
    fetchBatchByBatchNo(batchNo); // Fetch batch data based on the updated batchNo
  }, [batchNo]); // Trigger when batchNo changes

  useEffect(() => {
    // Fetch the batch counter value and update batchNo state
    fetchBatchCounter();
  }, []);

  const startDate = btData.cycle_started ? btData.cycle_started.toDate() : null;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1)
  const daysBetweenRounded = startDate ? Math.round(calculateDaysDifference(startDate, endDate)) : null;
  
  return (
    
    <SafeAreaView style={styles.container}>
      <ConfirmationModal/>
      <ScrollView showsVerticalScrollIndicator={true} style={{ paddingVertical: 30 }}>
        <View style={styles.firstContainer}>
          {/* CYCLE */}
          <View style={styles.cycleContainer}>
            
              {isLoading ? (
                <ActivityIndicator size="large" color="blue" />
              ) : (
                <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.xxLarge}}>{btData.batch_no}</Text>
              )}
          
            <View style={{ flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "center" }}>
              <Ionicons
                  name="logo-buffer"
                  size={18}
              />
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.xSmall }}>
                Batch No.
              </Text>
            </View>
          </View>

          {/* HUMIDITY AND TEMP */}
          <View style={styles.tempHumidityContainer1}>
            <View>
              <Text style={{ fontFamily: FONT.bold}}>
                Cycle Duration
              </Text>
            </View>
            <View style={styles.tempHumidityContainer}>
              <View style={styles.tempHumidityContent}>
                {/* <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large }}>70%</Text> */}
                <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: "#FF5733" }}>Start</Text>
                {isLoading ? (
                  <ActivityIndicator size="large" color="blue" />
                ) : (
                  <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small }}>{formatFirestoreTimestamp(btData.cycle_started)}</Text>
                )}
              </View>
              <View style={styles.tempHumidityContent}>
                {/* <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large }}>32 C°</Text> */}
                <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: "#ff0000" }}>End</Text>
                {isLoading ? (
                  <ActivityIndicator size="large" color="blue" />
                ) : (
                  <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small }}>{formatFirestoreTimestamp(btData.cycle_expected_end_date)}</Text>
                )}
                
              </View>
            </View>
          </View>
        </View>

        <View style={styles.firstContainer}>
          {/* CYCLE */}
          <View style={styles.cycleContainer}>
            
              {isLoading ? (
                <ActivityIndicator size="large" color="blue" />
              ) : (
                <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.xxLarge}}>{daysBetweenRounded}</Text>
              )}
          
            <View style={{ flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "center" }}>
              <Ionicons
                  name="sunny"
                  size={18}
              />
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.xSmall }}>
                Day No.   
              </Text>
            </View>
          </View>

          {/* HUMIDITY AND TEMP */}
          <View style={[styles.tempHumidityContainer1, {gap: 10}]}>
            <View>
              <Text style={{ fontFamily: FONT.bold}}>
                Total Population
              </Text>
            </View>
            <View style={styles.tempHumidityContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="blue" />
              ) : (
                <Text style={styles.contentValueText}>{btData.no_of_chicken.toLocaleString()}</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentHeader}>Chicken died today</Text>
          <View style={styles.divider}></View>
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
            handleConfirmModal();
          }}>
            <Text style={styles.confirmBtnText}>
              Confirm
            </Text>
          </TouchableOpacity>

          {/* <View style={{ width: "100%", flexDirection : "row", justifyContent: "space-around", marginTop: 50 }}>
            <View style={styles.contentContainer}>
              <Text style={styles.contentHeader}>Total Population</Text>
              {isLoading ? (
                <ActivityIndicator size="large" color="blue" />
              ) : (
                <Text style={styles.contentValueText}>{btData.no_of_chicken.toLocaleString()}</Text>
              )}
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.contentHeader}>Population after </Text>
              {isLoading ? (
                <ActivityIndicator size="large" color="blue" />
              ) : (
                <Text style={styles.contentValueText}>{btData.no_of_chicken.toLocaleString()}</Text>
              )}
            </View>
          </View> */}

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
            {/* <Text style={styles.dateText}>{`Your're in day ${daysBetweenRounded} in current cycle.`}</Text>
            <View style={styles.divider}></View> */}
          </View> 
        </View>
      </ScrollView>
      <Toast position="bottom"/>
    </SafeAreaView>
  )
}

export default DeathFarmer