import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, Switch, Animated, TouchableOpacity } from 'react-native';
import { COLORS, FONT, SIZES } from '../../../../constants/theme';
import { RadioButton } from 'react-native-paper';

import styles from './feeding.style';
import firebase from '../../../../firebase';

const FeedingFarmer = () => {

  const [wateringState, setWateringState] = useState("OFF");
  const [feedingState, setFeedingState] = useState("OFF");

  const [waterToggle, setWaterToggle] = useState(false);
  const [feedToggle, setFeedToggle] = useState(false);
  
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const [stateDurationValue, setStateDurationValue] = useState('0-7 days');

  const handleRadioChange = (value) => {
    setStateDurationValue(value);
    console.log(stateDurationValue);
  };

  const handleStartButtonPress = () => {
    // Update the selected value in Firebase Realtime Database
    firebase.database().ref('stateDuration').set(stateDurationValue);
  };

  const toggleManualVisibility = () => {
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

  // Function to toggle Watering state in Firebase
  const toggleWatering = () => {
    const newWateringState = wateringState === "ON" ? "OFF" : "ON";
    firebase.database().ref('wateringState').set(newWateringState);
    setWateringState(newWateringState);
  };

   // Function to toggle Watering state in Firebase
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

  // Listen for changes to the Watering state in Firebase
  useEffect(() => {
    const feedingStateRef = firebase.database().ref('feedingState');
    feedingStateRef.on('value', (snapshot) => {
      const newFeedingState = snapshot.val();
      setFeedingState(newFeedingState);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.manualBtn} onPress={toggleManualVisibility}>
      <Text style={styles.manualBtnText}>
        Manual Control
      </Text>
      <Ionicons
        name="hand-left"
        size={20}
        color={COLORS.lightWhite}
      />
      </TouchableOpacity>
      { isFilterVisible && (
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
      )}
      
      <View style={styles.radioContianer}>
        <RadioButton.Group onValueChange={handleRadioChange} value={stateDurationValue}>
            <View>
                <RadioButton.Item label="0-7 days" value="0-7 days" labelStyle={{ fontFamily: FONT.medium }}/>
                <RadioButton.Item label="7-14 days" value="7-14 days" labelStyle={{ fontFamily: FONT.medium }}/>
                <RadioButton.Item label="14-28 days" value="14-28 days" labelStyle={{ fontFamily: FONT.medium }}/>
            </View> 
        </RadioButton.Group>

        <TouchableOpacity style={styles.startBtn} onPress={handleStartButtonPress}> 
          <Text style={styles.startBtnText}>
            Start
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default FeedingFarmer