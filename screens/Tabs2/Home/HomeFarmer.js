import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View } from 'react-native';

import styles from './home.style';
const HomeFarmer = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>
            Poultry Pro
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            May 25, 2023
          </Text>
          <Text style={styles.timeText}>
            2:36:28 PM
          </Text>
        </View>

        {/* HUMIDITY DATA */}
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons
                name="water"
                size={80}
            />
          </View>
          <View style={styles.cardData}>
            {/* Title */}
            <Text style={styles.cardTitle}>
              Humidity
            </Text>

            {/* Value */}
            <Text style={styles.cardValueText}>
              70%
            </Text>

            {/* Measurement */}
            <Text style={styles.cardMeasurementText}>
              Normal
            </Text>
          </View>
        </View>

        {/* TEMPERATURE DATA */}
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons
                name="thermometer-outline"
                size={80}
            />
          </View>
          <View style={styles.cardData}>
            {/* Title */}
            <Text style={styles.cardTitle}>
              Temperature
            </Text>

            {/* Value */}
            <Text style={styles.cardValueText}>
              32 C
            </Text>

            {/* Measurement */}
            <Text style={styles.cardMeasurementText}>
              Normal
            </Text>
          </View>
        </View>
    </SafeAreaView>
  )
}

export default HomeFarmer