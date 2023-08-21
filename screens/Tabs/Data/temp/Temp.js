import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import styles from './temp.style';
const Temp = () => {

  const degreeSymbol = '\u00B0C';
  const tempData = {
    labels: ['Day 1', 'Day 2', 'Day 3', ' Day 4'],
    datasets: [
      {
        data: [32, 35, 31, 32],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.chartContainer}>
          <Text style={styles.headerTitle}>Temperature & Humidity</Text>
          <LineChart
            data={tempData}
            width={390}
            height={220}
            yAxisLabel=""
            yAxisSuffix={degreeSymbol}
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

export default Temp