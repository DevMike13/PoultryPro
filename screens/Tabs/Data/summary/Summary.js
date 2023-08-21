import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

import styles from './summary.style';
const Summary = () => {

  const summary = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        data: [10, 25, 15, 30],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.chartContainer}>
          <Text style={styles.headerTitle}>Yearly Summary</Text>
          <BarChart
            data={summary}
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

export default Summary