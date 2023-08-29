import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, Animated, TextInput, ToastAndroid } from 'react-native';
import { FONT, SIZES, COLORS } from '../../../../constants/theme';
import { addDays, format } from 'date-fns';

import firebase from '../../../../firebase';

import styles from './summary.style';

const SummaryFarmer = () => {

  return (
    <SafeAreaView style={styles.container}>
        
    </SafeAreaView>
  )
}

export default SummaryFarmer