import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, Switch, Animated, TouchableOpacity } from 'react-native';
import { COLORS, FONT, SIZES } from '../../../../constants/theme';
import { RadioButton } from 'react-native-paper';

import styles from './feeding.style';
import firebase from '../../../../firebase';

const FeedingFarmer = () => {

  const [ledState, setLedState] = useState("OFF");
  const [waterToggle, setWaterToggle] = useState(false);
  const [feedToggle, setFeedToggle] = useState(false);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const [selectedValue, setSelectedValue] = useState('1');

  const handleRadioChange = (value) => {
    setSelectedValue(value);
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

  // Function to toggle LED state in Firebase
  const toggleLED = () => {
    const newLEDState = ledState === "ON" ? "OFF" : "ON";
    firebase.database().ref('ledState').set(newLEDState);
    setLedState(newLEDState);
  };

   // Listen for changes to the LED state in Firebase
   useEffect(() => {
    const ledStateRef = firebase.database().ref('ledState');
    ledStateRef.on('value', (snapshot) => {
      const newLEDState = snapshot.val();
      setLedState(newLEDState);
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
              value={ledState === "ON"}
              onValueChange={toggleLED}
              trackColor={{ false: COLORS.gray4, true: COLORS.tertiary}}
              thumbColor={waterToggle ? COLORS.primary : COLORS.white}
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], marginTop: 20 }}
            />
          </View>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Feeding</Text>
            <Switch
              value={feedToggle}
              onValueChange={value => setFeedToggle(value)}
              trackColor={{ false: COLORS.gray4, true: COLORS.tertiary}}
              thumbColor={feedToggle ? COLORS.primary : COLORS.white}
              style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }], marginTop: 20 }}
            />
          </View>
        </Animated.View>
      )}
      
      <View style={styles.radioContianer}>
        <RadioButton.Group onValueChange={handleRadioChange} value={selectedValue}>
            <View>
                <RadioButton.Item label="0-7 days" value="1" labelStyle={{ fontFamily: FONT.medium }}/>
                <RadioButton.Item label="7-14 days" value="2" labelStyle={{ fontFamily: FONT.medium }}/>
                <RadioButton.Item label="14-28 days" value="3" labelStyle={{ fontFamily: FONT.medium }}/>
            </View> 
        </RadioButton.Group>

        <TouchableOpacity style={styles.startBtn}> 
          <Text style={styles.startBtnText}>
            Start
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default FeedingFarmer