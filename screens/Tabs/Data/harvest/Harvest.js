import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import styles from './harvest.style';
const Harvest = () => {

  const data = [
    { name: 'Good', population: 25, color: '#1ABC9C' },
    { name: 'Reject', population: 40, color: '#E74C3C'  },
  ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.chartContainer}>
          <Text style={styles.headerTitle}>Good & Reject Chicken</Text>
          <PieChart
            data={data}
            width={400}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            // absolute // Optional, use absolute values for the data
          />
        </View>
    </SafeAreaView>
  )
}

export default Harvest