import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import styles from './death.style';
const Death = () => {

  const mortData = {
    labels: ['Day 1', 'Day 2', 'Day 3', ' Day 4', 'Day 5', 'Day 6'],
    datasets: [
      {
        data: [5, 8, 6, 3, 4, 7],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.chartContainer}>
          <Text style={styles.headerTitle}>Mortality Rate</Text>
          <LineChart
            data={mortData}
            width={390}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />
        </View>
    </SafeAreaView>
  )
}

export default Death