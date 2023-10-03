import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, Animated, TextInput, ToastAndroid, ActivityIndicator, Modal } from 'react-native';
import { FONT, SIZES, COLORS } from '../../../../constants/theme';
import { BlurView } from 'expo-blur';
import { RadioButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { addDays, format } from 'date-fns';
import { tr } from 'date-fns/locale';

import firebase from '../../../../firebase';

import styles from './summary.style';

const SummaryFarmer = () => {

  const [isLoading, setIsLoading] = useState(true);

  const [currentDays, setCurrentDays] = useState(null);
  const [daysValue, setDaysValue] = useState('0-7 days');


  const [batchNo, setBatchNo] = useState('');
  const [btData, setBtData] = useState([]);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  const toggleManualVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleConfirmModal = () => {
    setIsConfirmationModalVisible(true);
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
          outputRange: [0, 0],
        }),
      },
    ],
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

  const handleChangedCurrentDays = () => {
    // Update the selected value in Firebase Realtime Database
    firebase.database().ref('currentDays').set(daysValue);
    
  };

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
              Are you sure you want to set this as current days?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={() => {
                  handleChangedCurrentDays();
                  setIsConfirmationModalVisible(false);
                  setIsFilterVisible(false)
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

  const successSaveCurrentDaysToast = () => {
    Toast.show({
      type: 'success',
      text1: "Current days successfuly changed!",
      visibilityTime: 5000, // Adjust as needed
    });
  };

  const startDate = btData.cycle_started ? btData.cycle_started.toDate() : null;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1)
  const daysBetweenRounded = startDate ? Math.round(calculateDaysDifference(startDate, endDate)) : null;

  useEffect(() => {
    // Set up Firebase real-time listeners
    const currentDaysRef = firebase.database().ref('currentDays');
   
    // Start loading
    setIsLoading(true);

    // Listen for changes in humidity data
    currentDaysRef.on('value', (snapshot) => {
      try {
        const currentDaysValue = snapshot.val();
        setCurrentDays(currentDaysValue);
        setIsLoading(false); // Stop loading when data is available
      } catch (error) {
        console.error('Error reading humidity:', error);
        setIsLoading(false); // Stop loading in case of an error
      }
    });

    // Clean up the listeners when the component unmounts
    return () => {
      currentDaysRef.off();
    };
  }, []);

  const handleRadioChange = (value) => {
    setDaysValue(value);
    console.log(daysValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ConfirmationModal/>
      {btData.length == 0 ? (
        <ActivityIndicator size="large" color="blue" style={{ alignSelf: "center", marginVertical: 50}} />
      ) : (
        btData.isHarvested != true ? (
          <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingVertical: 20, gap: 20 }}>
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
                    {isLoading || !startDate ? (
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
                      <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small }}>
                        {btData.cycle_expected_end_date
                          ? formatFirestoreTimestamp(btData.cycle_expected_end_date)
                          : 'N/A'} {/* Check if cycle_expected_end_date is defined */}
                      </Text>
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
                  {isLoading || !btData.no_of_chicken ? (
                    <ActivityIndicator size="large" color="blue" />
                  ) : (
                    <Text style={styles.contentValueText}>
                      {btData.no_of_chicken.toLocaleString()}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            
            <View style={styles.currentDaysContainer}>
              <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.medium, marginBottom: 10 }}>Currrent Days</Text>
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.medium }}>{currentDays}</Text>
            </View>
            
  
            <TouchableOpacity style={styles.manualBtn} onPress={toggleManualVisibility}>
              <Text style={styles.manualBtnText}>
                Edit Current Days
              </Text>
              <Ionicons
                name="create-outline"
                size={20}
                color={COLORS.lightWhite}
              />
            </TouchableOpacity>
  
            { isFilterVisible && (
                <Animated.View style={[styles.animatedContainer, filterStyle]}>
                  <RadioButton.Group onValueChange={handleRadioChange} value={daysValue}>
                    <View>
                      <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large }}>Select days:</Text>
                      <View style={{ width: 120, height: 2, backgroundColor: COLORS.primary, marginTop: 5 }}></View>
                      <RadioButton.Item label="0-7 days" value="0-7 days" labelStyle={{ fontFamily: FONT.medium, fontSize: SIZES.medium }}/>
                      <RadioButton.Item label="7-14 days" value="7-14 days" labelStyle={{ fontFamily: FONT.medium, fontSize: SIZES.medium }}/>
                      <RadioButton.Item label="14-28 days" value="14-28 days" labelStyle={{ fontFamily: FONT.medium, fontSize: SIZES.medium }}/>
                    </View> 
                  </RadioButton.Group>
                  <TouchableOpacity style={{ backgroundColor: COLORS.tertiary, paddingHorizontal: 20, width: 100, alignSelf: "center", alignItems: "center", justifyContent: "center", paddingVertical: 5, borderRadius: SIZES.small }} onPress={handleConfirmModal}>
                    <Text style={{ fontFamily: FONT.medium, color: COLORS.lightWhite }}>Save</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
          </ScrollView>
        ) : (
          <Text style={{ fontFamily: FONT.medium, alignSelf: "center", marginVertical: 50 }}>There's no ongoing batch.</Text>
        )
      )}
    </SafeAreaView>
  )
}

export default SummaryFarmer