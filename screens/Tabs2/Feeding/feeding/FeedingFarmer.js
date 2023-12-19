import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, Switch, Animated, TouchableOpacity, Modal } from 'react-native';
import { COLORS, FONT, SIZES } from '../../../../constants/theme';
import { BlurView } from 'expo-blur';
import { RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import { schedulePushNotification } from '../../../../utils/notification';
import styles from './feeding.style';
import firebase from '../../../../firebase';
import { tr } from 'date-fns/locale';
import { format, addDays, eachDayOfInterval } from 'date-fns';

const FeedingFarmer = () => {

  const [wateringState, setWateringState] = useState("OFF");
  const [feedingState, setFeedingState] = useState("OFF");

  const [waterToggle, setWaterToggle] = useState(false);
  const [feedToggle, setFeedToggle] = useState(false);
  
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const [isSchedVisible, setIsSchedVisible] = useState(false);

  const [stateDurationValue, setStateDurationValue] = useState('0-7 days');
  const [stateDuration, setStateDuration] = useState('');

  const [notificationSent, setNotificationSent] = useState(false); // Track if notification has been sent
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [selectedDate2, setSelectedDate2] = useState(new Date());

  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  // GET SCHEDULE DATE
  const [schedDateValue, setSchedDateValue] = useState("OFF");
  const [schedDurationValue, setSchedDurationValue] = useState(null);

  const [schedArrayDates, setSchedArrayDates] = useState(null);

  const [sixAM, setSixAM] = useState(null);
  const [tenAM, setTenAM] = useState(null);
  const [onePM, setOnePM] = useState(null);
  const [tenPM, setTenPM] = useState(null);

  const [loading, setLoading] = useState(true);

  const generateDateArray = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = eachDayOfInterval({ start, end });

    return dates.map(date => format(date, 'MM/dd/yyyy'));
  };

  const handleConfirmSchedule = () => {
    // Generate the array of dates between the selected dates
    const selectedDatesArray = generateDateArray(selectedDate, selectedDate2);
    setSchedArrayDates(selectedDatesArray);
    // Do something with the array, like storing it in state
    console.log(selectedDatesArray);
  };

  const handlePushToRTDB = () =>{
    firebase.database().ref('scheduleArrayDates').set(schedArrayDates);
  };

  const currenSchedToast = () => {
    Toast.show({
      type: 'info',
      text1: "There's current schedule!",
      visibilityTime: 5000, // Adjust as needed
    });
  };
  
  // GET SCHEDULES INDIVIDUALY
  useEffect(() => {
    // Set up Firebase real-time listeners
    const schedDateRef = firebase.database().ref('scheduleDate');
    const schedDurationRef = firebase.database().ref('stateDuration');

    const sixAMRef = firebase.database().ref('6AM');
    const tenAMRef = firebase.database().ref('10AM');
    const onePMRef = firebase.database().ref('1PM');
    const tenPMRef = firebase.database().ref('10PM');

    // Start loading
    setLoading(true);

    // Listen for changes in scheduleDate data
    schedDateRef.on('value', (snapshot) => {
      try {
        const schedValue = snapshot.val();
        setSchedDateValue(schedValue);
        setLoading(false); // Stop loading when data is available
      } catch (error) {
        console.error('Error reading schedule:', error);
        setLoading(false); // Stop loading in case of an error
      }
    });

    // Listen for changes in stateDuration data
    schedDurationRef.on('value', (snapshot) => {
      try {
        const schedDuraValue = snapshot.val();
        setSchedDurationValue(schedDuraValue);
        setLoading(false); // Stop loading when data is available
      } catch (error) {
        console.error('Error reading duration:', error);
        setLoading(false); // Stop loading in case of an error
      }
    });

    // Listen for changes in 6AM data
    sixAMRef.on('value', (snapshot) => {
      try {
        const sixAMValue = snapshot.val();
        setSixAM(sixAMValue);
        setLoading(false); // Stop loading when data is available
      } catch (error) {
        console.error('Error reading 6AM:', error);
        setLoading(false); // Stop loading in case of an error
      }
    });

    // Listen for changes in 10AM data
    tenAMRef.on('value', (snapshot) => {
      try {
        const tenAMValue = snapshot.val();
        setTenAM(tenAMValue);
        setLoading(false); // Stop loading when data is available
      } catch (error) {
        console.error('Error reading 10AM:', error);
        setLoading(false); // Stop loading in case of an error
      }
    });

    // Listen for changes in 1PM data
    onePMRef.on('value', (snapshot) => {
      try {
        const onePMValue = snapshot.val();
        setOnePM(onePMValue);
        setLoading(false); // Stop loading when data is available
      } catch (error) {
        console.error('Error reading 1PM:', error);
        setLoading(false); // Stop loading in case of an error
      }
    });

    // Listen for changes in 10PM data
    tenPMRef.on('value', (snapshot) => {
      try {
        const tenPMValue = snapshot.val();
        setTenPM(tenPMValue);
        setLoading(false); // Stop loading when data is available
      } catch (error) {
        console.error('Error reading 10PM:', error);
        setLoading(false); // Stop loading in case of an error
      }
    });

   
    // Clean up the listeners when the component unmounts
    return () => {
      
      schedDateRef.off();
      schedDurationRef.off();
      sixAMRef.off();
      tenAMRef.off();
      onePMRef.off();
      tenPMRef.off();
    };
  }, []);

  const handleRadioChange = (value) => {
    setStateDurationValue(value);
    console.log(stateDurationValue);
  };

  const handleScheduleButtonPress = () => {
    // Update the selected value in Firebase Realtime Database
    firebase.database().ref('scheduleDate').set(formatDate(selectedDate));
    firebase.database().ref('stateDuration').set(stateDurationValue);
    
    // Update the values to On Going
    firebase.database().ref('6AM').set("Sched");
    firebase.database().ref('10AM').set("Sched");
    firebase.database().ref('1PM').set("Sched");
    firebase.database().ref('10PM').set("Sched");
  };

  
  const toggleManualVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const toggleSchedVisibility = () => {
    setIsSchedVisible(!isSchedVisible);
  };

  const handleDateChange = (event, selected) => {
    if (selected) {
      setSelectedDate(selected);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  const handleDateChange2 = (event, selected) => {
    if (selected) {
      setSelectedDate2(selected);
    }
    setShowDatePicker2(Platform.OS === 'ios');
  };

  const toggleDatePicker2 = () => {
    setShowDatePicker2(!showDatePicker2);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${month}/${day}/${year}`;
  };

  const handleConfirmModal = () => {
    setIsConfirmationModalVisible(true);
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
              Are you sure you want to set this schedule?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={() => {
                  handleScheduleButtonPress();
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

  useEffect(() => {
    const newValue = isFilterVisible ? 1 : 0;
    
    Animated.timing(animation, {
      toValue: newValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFilterVisible]);
  
  useEffect(() => {
    const newValue = isSchedVisible ? 1 : 0;
    
    Animated.timing(animation, {
      toValue: newValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSchedVisible]);

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

  // Function to toggle Watering state in Firebase
  const toggleWatering = () => {
    const newWateringState = wateringState === "ON" ? "OFF" : "ON";
    firebase.database().ref('wateringState').set(newWateringState);
    setWateringState(newWateringState);
  };

   // Function to toggle Feeding state in Firebase
   const toggleFeeding = () => {
    const newFeedingState = feedingState === "ON" ? "OFF" : "ON";
    firebase.database().ref('feedingState').set(newFeedingState);
    setFeedingState(newFeedingState);
  };

   // Listen for changes to the Watering state in Firebase
   useEffect(() => {
    const wateringStateRef = firebase.database().ref('wateringState');
    wateringStateRef.on('value', (snapshot) => {
      const newWateringState = snapshot.val();
      setWateringState(newWateringState);
    });
  }, []);

  // Listen for changes to the Feeding state in Firebase
  useEffect(() => {
    const feedingStateRef = firebase.database().ref('feedingState');
    feedingStateRef.on('value', (snapshot) => {
      const newFeedingState = snapshot.val();
      setFeedingState(newFeedingState);
    });
  }, []);

  // Listen for changes to the stateDuration in Firebase Realtime Database
  useEffect(() => {
    const stateDurationRef = firebase.database().ref('stateDuration');

     // Listen for changes in temperature data
     stateDurationRef.on('value', (snapshot) => {
      try {
        const stateDurationVal = snapshot.val();
        setStateDuration(stateDurationVal);
      } catch (error) {
        console.error('Error reading temperature:', error);
        setLoading(false); // Stop loading in case of an error
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      stateDurationRef.off();
    };
  }, [stateDuration]);

  return (
    <SafeAreaView style={styles.container}>
      <ConfirmationModal/>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingVertical: 20 }}>
        {/* <TouchableOpacity style={styles.manualBtn} onPress={toggleManualVisibility}>
        <Text style={styles.manualBtnText}>
          Manual Control
        </Text>
        <Ionicons
          name="hand-left"
          size={20}
          color={COLORS.lightWhite}
        />
        </TouchableOpacity> */}
        {/* { isFilterVisible && (
          <Animated.View style={[styles.animatedContainer, filterStyle]}>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Watering</Text>
              <Switch
                value={wateringState === "ON"}
                onValueChange={toggleWatering}
                trackColor={{ false: COLORS.gray4, true: COLORS.tertiary}}
                thumbColor={waterToggle ? COLORS.primary : COLORS.white}
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], marginTop: 20 }}
              />
            </View>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Feeding</Text>
              <Switch
                value={feedingState === "ON"}
                onValueChange={toggleFeeding}
                trackColor={{ false: COLORS.gray4, true: COLORS.tertiary}}
                thumbColor={feedToggle ? COLORS.primary : COLORS.white}
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], marginTop: 20 }}
              />
            </View>
          </Animated.View>
        )} */}

        
       
        { schedDateValue == "OFF" ? (
          <></>
        ) : (
          <TouchableOpacity style={[styles.manualBtn, { marginTop: 20 }]} onPress={toggleSchedVisibility}>
            <Text style={styles.manualBtnText}>
              See Schedule
            </Text>
            <Ionicons
              name="hand-left"
              size={20}
              color={COLORS.lightWhite}
            />
          </TouchableOpacity>
        )}
 

        { schedDateValue == "OFF" ? (
          null
        ) : (
          isSchedVisible && (
            <Animated.View style={[styles.animatedContainer, filterStyle]}>
              { schedDateValue == "OFF" && schedDurationValue == "OFF" ? (
                  <Text>No Set Schedule.</Text>
                ) : (
                  <View style={styles.scheduleContainer}>
                    <View>
                      <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large }}> 
                        {schedDateValue ? `${schedDateValue}` : 'N/A'}
                      </Text>
                      <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.medium }}> 
                        {schedDurationValue ? `${schedDurationValue}` : 'N/A'}
                      </Text>
                    </View>
                    <View>
                      <View style={styles.timeContainer}>
                        <Text style={{ fontFamily: FONT.regular }} >6 AM -</Text>
                        { sixAM == "Done" ? (
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5}}>
                            <Text style={{ fontFamily: FONT.bold }}> 
                              {sixAM ? `${sixAM}` : 'N/A'}
                            </Text>
                            <Ionicons
                              name="checkmark-circle"
                              size={15}
                              color={"#86B049"}
                            />
                          </View>
                        ) : (
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5}}>
                            <Ionicons
                              name="alarm"
                              size={15}
                              color={COLORS.primary}
                            />
                          </View>
                        )}
                      </View>
                      <View style={styles.timeContainer}>
                        <Text>10 AM -</Text>
                        { tenAM == "Done" ? (
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5}}>
                            <Text style={{ fontFamily: FONT.bold }}> 
                              {tenAM ? `${tenAM}` : 'N/A'}
                            </Text>
                            <Ionicons
                              name="checkmark-circle"
                              size={15}
                              color={"#86B049"}
                            />
                          </View>
                        ) : (
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5}}>
                            <Ionicons
                              name="alarm"
                              size={15}
                              color={COLORS.primary}
                            />
                          </View>
                        )}
                      </View>
                      <View style={styles.timeContainer}>
                        <Text>1 PM -</Text>
                        { onePM == "Done" ? (
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5}}>
                            <Text style={{ fontFamily: FONT.bold }}> 
                              {onePM ? `${onePM}` : 'N/A'}
                            </Text>
                            <Ionicons
                              name="checkmark-circle"
                              size={15}
                              color={"#86B049"}
                            />
                          </View>
                        ) : (
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5}}>
                            <Ionicons
                              name="alarm"
                              size={15}
                              color={COLORS.primary}
                            />
                          </View>
                        )}
                      </View>
                      <View style={styles.timeContainer}>
                        <Text>10 PM -</Text>
                        { tenPM == "Done" ? (
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5}}>
                            <Text style={{ fontFamily: FONT.bold }}> 
                              {tenPM ? `${tenPM}` : 'N/A'}
                            </Text>
                            <Ionicons
                              name="checkmark-circle"
                              size={15}
                              color={"#86B049"}
                            />
                          </View>
                        ) : (
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5}}>
                            <Ionicons
                              name="alarm"
                              size={15}
                              color={COLORS.primary}
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                )
              }
            </Animated.View>
          )
        )}
        
        <View style={styles.radioContianer}>
          <RadioButton.Group onValueChange={handleRadioChange} value={stateDurationValue}>
              <View>
                  <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large }}>Select days:</Text>
                  <View style={{ width: 120, height: 2, backgroundColor: COLORS.primary, marginTop: 5 }}></View>
                  <RadioButton.Item label="0-7 days" value="0-7 days" labelStyle={{ fontFamily: FONT.medium, fontSize: SIZES.medium }}/>
                  <RadioButton.Item label="7-14 days" value="7-14 days" labelStyle={{ fontFamily: FONT.medium, fontSize: SIZES.medium }}/>
                  <RadioButton.Item label="14-28 days" value="14-28 days" labelStyle={{ fontFamily: FONT.medium, fontSize: SIZES.medium }}/>
              </View> 
          </RadioButton.Group>
          <View style={{ marginTop: 50 }}>
            <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large }}>Select Date: </Text>
            <View style={{ width: 120, height: 2, backgroundColor: COLORS.primary, marginTop: 5 }}></View>
          </View>
          <View style={styles.dateContainer}>
            <TouchableOpacity onPress={toggleDatePicker} style={{ backgroundColor: COLORS.gray2, paddingHorizontal: 50, paddingVertical: 10, flexDirection: "row", gap: 15, borderRadius: SIZES.small, alignItems: "center" }}>
              <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium }}>
                {formatDate(selectedDate)}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={30}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                minimumDate={(new Date().getTime() + 24 * 60 * 60 * 1000)}
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* <View style={styles.dateContainer}>
            <TouchableOpacity onPress={toggleDatePicker2} style={{ backgroundColor: COLORS.gray2, paddingHorizontal: 50, paddingVertical: 10, flexDirection: "row", gap: 15, borderRadius: SIZES.small, alignItems: "center" }}>
              <Text style={{ fontFamily: FONT.medium, fontSize: SIZES.medium }}>
                {formatDate(selectedDate2)}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={30}
              />
            </TouchableOpacity>
            {showDatePicker2 && (
              <DateTimePicker
                value={selectedDate2}
                mode="date"
                display="default"
                minimumDate={(new Date().getTime() + 24 * 60 * 60 * 1000)}
                onChange={handleDateChange2}
              />
            )}
          </View> */}
          
          { schedDateValue == "OFF" && schedDurationValue == "OFF" ? (
            <TouchableOpacity style={styles.startBtn} onPress={handleConfirmModal}> 
              <Text style={styles.startBtnText}>
                Schedule
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.startBtn, { backgroundColor : COLORS.gray }]} onPress={currenSchedToast}> 
              <Text style={styles.startBtnText}>
                Schedule
              </Text>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity style={styles.startBtn} onPress={() => {handleConfirmSchedule(); handlePushToRTDB();}}> 
            <Text style={styles.startBtnText}>
              Schedule
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      <Toast position="bottom"/>
    </SafeAreaView>
  )
}

export default FeedingFarmer