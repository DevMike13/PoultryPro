import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { FONT, SIZES, COLORS } from '../../../../constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

import styles from './harvest.style';

import firebase from '../../../../firebase';

const HarvestFarmer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [batchNo, setBatchNo] = useState('');
  const [btData, setBtData] = useState([]);

  const [goodChicken, setGoodChicken] = useState('');
  const [rejectChicken, setRejectChicken] = useState('');

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
              Are you sure you want save this harvest data?
            </Text>
            <Text style={{ textAlign: "center", fontFamily: FONT.regular, fontSize: SIZES.small, marginBottom: 30, color: "red" }}>(Your last cycle will be ended after this!)</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={() => {
                  saveHarvestData();
                  setIsConfirmationModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={() => {
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

  const noBatchToast = () => {
    Toast.show({
      type: 'info',
      text1: "There's no ongoing cycle. Create a new batch!",
      visibilityTime: 5000, // Adjust as needed
    });
  };

  const emptyInputToast = () => {
    Toast.show({
      type: 'error',
      text1: "Please fill in all fields.",
      visibilityTime: 5000, // Adjust as needed
    });
  };

  const successInsertToast = () => {
    Toast.show({
      type: 'success',
      text1: "Harvest Data Saved!",
      visibilityTime: 5000, // Adjust as needed
    });
  };

  const matchingTotalToast = () => {
    Toast.show({
      type: 'error',
      text1: "Total cannot exceed the total population available.",
      visibilityTime: 5000, // Adjust as needed
    });
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

  const formatFirestoreTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    return format(date, 'MMM d, yyyy');
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

  useEffect(() => {
    const fetchData = async () => {
      await fetchBatchByBatchNo(batchNo);
    };
    fetchData();
  }, [batchNo]); // Trigger when batchNo changes

  useEffect(() => {
    // Fetch the batch counter value and update batchNo state
    fetchBatchCounter();
  }, []);

  const calculateDaysDifference = (startDate, endDate) => {
    
    // Calculate the time difference in milliseconds between the two dates
    const timeDiff = endDate - startDate;
  
    // Convert the time difference to days
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  
    return daysDiff;
  }

  const startDate = btData.cycle_started ? btData.cycle_started.toDate() : null;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1)
  const daysBetweenRounded = startDate ? Math.round(calculateDaysDifference(startDate, endDate)) : null;

  // HARVEST

  const saveHarvestData = async () => {
    try {
      setIsSaving(true); 
      const db = firebase.firestore();
      
      // Check if the 'goodChicken' and 'rejectChicken' values are not empty
      if (!goodChicken || !rejectChicken) {
        // Show an error message or perform any other desired action
        emptyInputToast();
        return; // Exit the function without saving data
      }

      // Convert the input values to integers
      const goodChickenCount = parseInt(goodChicken);
      const rejectChickenCount = parseInt(rejectChicken);

      // Check if the sum of good chicken and reject chicken is greater than the total chickens available
      if (goodChickenCount + rejectChickenCount > btData.no_of_chicken || goodChickenCount + rejectChickenCount < btData.no_of_chicken) {
        // Show an error message or perform any other desired action
        matchingTotalToast();
        return; // Exit the function without saving data
      }

      // Define the data to be saved in the harvest collection
      const harvestData = {
        batch_no: btData.batch_no,
        good_chicken: parseInt(goodChicken),
        reject_chicken: parseInt(rejectChicken),
        harvest_date: selectedDate,
      };
  
      // Add a new document to the 'harvest' collection
      await db.collection('harvest').add(harvestData);
  
      // Update the 'batch' collection with the new data
      await db
        .collection('batch')
        .where('batch_no', '==', btData.batch_no)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            // Update the 'batch' document with the new data
            await db.collection('batch').doc(doc.id).update({
              // Update the fields you want to change in the 'batch' document
              // For example, you can update 'isHarvested' to true
              isHarvested: true,
              cycle_expected_end_date: new Date(),
            });
          });
        });
  
      // Clear the input fields or perform any other necessary actions
      setGoodChicken('');
      setRejectChicken('');
      setSelectedDate(new Date());
      successInsertToast();
      await fetchBatchByBatchNo(btData.batch_no);
      // You can also show a success message or perform any UI updates
    } catch (error) {
      console.error('Error saving harvest data:', error);
      // Handle errors or show an error message to the user
    } finally {
      setIsSaving(false); // End loading state
      await fetchBatchByBatchNo(btData.batch_no);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ConfirmationModal />
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingVertical: 20 }}>
      { btData.isHarvested != true ? (
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
      ) : (
        <></>
      )}
      
      { btData.isHarvested != true ? (
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
      ) : (
        <></>
      )}
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeader}>Number of good chicken</Text>
        <View style={[styles.inputContainer, {marginBottom: 50}]}>
          <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inInput}
                placeholder='Input number'
                textAlign={'center'}
                keyboardType={'numeric'}
                value={goodChicken}
                onChangeText={setGoodChicken}
              />
          </View>
        </View>
        <Text style={styles.contentHeader}>Number of reject chicken</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inInput}
                placeholder='Input number'
                keyboardType={'numeric'}
                textAlign={'center'}
                value={rejectChicken}
                onChangeText={setRejectChicken}
              />
          </View>
        </View>
        { btData.length <=0 || btData.isHarvested != false ? (
          <TouchableOpacity style={[styles.confirmBtn, { opacity: 0.5 }]} onPress={noBatchToast}>
            <Text style={styles.confirmBtnText}>
              Confirm
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmModal}>
           {isSaving ? ( // Show Activity Indicator when saving/loading
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.confirmBtnText}>Confirm</Text>
            )}
          </TouchableOpacity>
          
        )}
        
      </View>
      {/* <View style={styles.contentContainer}>
        <Text style={styles.contentHeader}>Number of reject chicken</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inInput}
                placeholder='Input number'
                keyboardType={'numeric'}
                textAlign={'center'}
                // value={email}
                // onChangeText={setEmail}
              />
          </View>
        </View>
        <TouchableOpacity style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>
            Confirm
          </Text>
        </TouchableOpacity>
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
      </View>
      </ScrollView>
      <Toast position="bottom"/>
      
    </SafeAreaView>
  )
}

export default HarvestFarmer