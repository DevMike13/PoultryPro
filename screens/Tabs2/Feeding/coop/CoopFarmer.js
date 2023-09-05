import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity,ToastAndroid, Animated, TextInput, FlatList, ActivityIndicator, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, FONT, SIZES } from '../../../../constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDays, format } from 'date-fns';
import Toast from 'react-native-toast-message';

import firebase from '../../../../firebase';
import styles from './coop.style';

const CoopFarmer = () => {
  // const [selectedDate, setSelectedDate] = useState(new Date());
  // const [selectedTime, setSelectedTime] = useState(new Date());

  // const [showDatePicker, setShowDatePicker] = useState(false);
  // const [showTimePicker, setShowTimePicker] = useState(false);

  // const handleDateChange = (event, selected) => {
  //   if (selected) {
  //     setSelectedDate(selected);
  //   }
  //   setShowDatePicker(Platform.OS === 'ios');
  // };

  // const handleTimeChange = (event, selected) => {
  //   if (selected) {
  //     setSelectedTime(selected);
  //   }
  //   setShowTimePicker(Platform.OS === 'ios');
  // };

  // const toggleDatePicker = () => {
  //   setShowDatePicker(!showDatePicker);
  // };

  // const toggleTimePicker = () => {
  //   setShowTimePicker(!showTimePicker);
  // };

  // const formatDate = date => {
  //   return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  // };

  // const formatTime = time => {
  //   const hours = time.getHours();
  //   const minutes = time.getMinutes();
  //   const amPM = hours >= 12 ? 'PM' : 'AM';
  //   const formattedHours = hours % 12 || 12;
  //   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  //   return `${formattedHours}:${formattedMinutes} ${amPM}`;
  // };

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const [currentDate, setCurrentDate] = useState('');
  const [futureDate, setFutureDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSame, setIsSame] = useState(false);

  const [numberOfChickens, setNumberOfChickens] = useState('');

  const [batchNo, setBatchNo] = useState('');
  const [btData, setBtData] = useState([]);

  const [batchList, setBatchList] = useState([]);
  const [showCreateButton, setShowCreateButton] = useState(false);

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
              Are you sure you want to create a new batch?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={() => {
                  handleConfirm();
                  setIsFilterVisible(false);
                  getBatchList();
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={() => {
                  setIsConfirmationModalVisible(false);
                  setIsFilterVisible(false);
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
    setIsConfirmationModalVisible(false);
  };

  const handleConfirmModal = () => {
    setIsConfirmationModalVisible(true);
  };

  const fetchBatchCounter = async () => {
    const db = firebase.firestore();
  
    try {
      const counterDocRef = db.collection('meta').doc('counters');
      const counterDoc = await counterDocRef.get();
  
      if (counterDoc.exists) {
        const batchCounterValue = counterDoc.data().batchCounter - 1;
        setBatchNo(batchCounterValue);
        // console.log(batchCounterValue);
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
          // console.log('Batch Data :', batchData);
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
    if (endDate && endDate <= dateNow) {
      setIsSame(datesEqual); 
      // console.log(isSame);
      // console.log('Current date is greater or equal to Firestore date');
    } else {
      setIsSame(datesEqual); 
      // console.log(isSame);
      // console.log('Current date is smaller than Firestore date');
    }
    

  }, [btData.cycle_expected_end_date]);

  const successToast = () => {
    //function to make Toast With Duration
    Toast.show({
      type: 'error',
      text1: 'Your last cycle is not finished!',
      visibilityTime: 3000, // Adjust as needed
    });
  };

  useEffect(() => {
    getBatchList();
  }, []);

  const getBatchList = () => {
    // Reference to the Firestore collection
    const collectionRef = firebase.firestore().collection('batch');

    // Fetch the data
    collectionRef.get().then((querySnapshot) => {
      const fetchedData = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push(doc.data());
      });
      setBatchList(fetchedData);
      setIsLoading(false);
    });
  };

  const formatFirestoreTimestamp = (timestamp) => {
    const date = timestamp.toDate();
    return format(date, 'MMM d, yyyy');
  };

   // Condition to determine if the button should be shown
  const shouldShowCreateButton = btData.length <= 0 ||
  (btData.cycle_expected_end_date &&
    new Date() >= new Date(
      btData.cycle_expected_end_date.seconds * 1000 +
      btData.cycle_expected_end_date.nanoseconds / 1000000
    ));

  // Function to handle the "Create New Batch" button press
  const handleCreateButtonPress = () => {
    if (shouldShowCreateButton) {
      toggleCreateVisibility();
    } else {
      successToast();
    }
  };

  useEffect(() => {
    // Update the visibility state based on the condition
    setShowCreateButton(shouldShowCreateButton);
  }, [btData]);

  const renderItemList = ({ item }) => (
    
    <View style={styles.list}>
      <View style={styles.batchContainer}>
        <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large }}>{item.batch_no}</Text>
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
      <View style={styles.listInfo}>
        <Text style={{ fontFamily: FONT.bold, alignSelf: "center" }}>
          Cycle Duration
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around"}}>
          <View style={{ alignItems: "center"}}>
            <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.xSmall }}>Start</Text>
            <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small }}>{formatFirestoreTimestamp(item.cycle_started)}</Text>
          </View>
          <View style={{ alignItems: "center"}}>
            <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.xSmall }}>End</Text>
            <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small}}>{formatFirestoreTimestamp(item.cycle_expected_end_date)}</Text>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 10, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontFamily: FONT.bold }}>Status</Text>
        {
          new Date() >= new Date(item.cycle_expected_end_date.seconds * 1000 + item.cycle_expected_end_date.nanoseconds / 1000000) ? (
            <Text style={{ fontFamily: FONT.regular, backgroundColor: "#FF7377", paddingHorizontal: 5, borderRadius: SIZES.xSmall, paddingVertical: 2}}>Ended</Text>
          ) : (
            <Text style={{ fontFamily: FONT.regular, backgroundColor: "#90EE90", paddingHorizontal: 5, borderRadius: SIZES.xSmall, paddingVertical: 2}}>Ongoing</Text>
          )
        }
      </View> 
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ConfirmationModal />
      { btData.length <= 0 ? (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 10 }}/>
      ) : (
        <TouchableOpacity
          style={[
            styles.createBtn,
            !showCreateButton && { backgroundColor: COLORS.gray2 }
          ]}
          onPress={handleCreateButtonPress}
        >
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
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmModal}>
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      <View style={{ paddingHorizontal: 10, marginTop: 50, marginBottom: 10}}>
        <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.xLarge}}>
          Batch List
        </Text>
        <View style={{ width: 50, height: 2, backgroundColor: COLORS.primary }}></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollView}>
        {
          isLoading ? (
            <ActivityIndicator size="large" color="blue" style={{ marginTop: 40 }}/>
          ) : (
            batchList && batchList.length > 0 ? (
              batchList.map((item) => ( 
                <View key={item.batch_no}>
                  {renderItemList({ item })}
                </View>
              ))
            ) : (
              <Text style={{ fontFamily: FONT.medium }}>No Data Found</Text>
            )
          )
        }
      </ScrollView>
      <Toast position="bottom"/>
    </SafeAreaView>
  )
}

export default CoopFarmer