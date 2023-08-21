import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView } from 'react-native';
import { FONT, SIZES } from '../../../../constants/theme';
import { BarChart, LineChart } from 'react-native-chart-kit';

import styles from './coop.style';

const Coop = () => {
  const chickenCount = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        data: [10, 25, 15, 30],
      },
    ],
  };

  const chickenMortality = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        data: [4, 8, 10, 2],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.firstContainer}>
          {/* CYCLE */}
          <View style={styles.cycleContainer}>
            <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.xxLarge}}>
              1
            </Text>
            <View style={{ flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "center" }}>
              <Ionicons
                  name="refresh"
                  size={18}
              />
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.xSmall }}>
                Cycle in 2023
              </Text>
            </View>
          </View>

          {/* HUMIDITY AND TEMP */}
          <View style={styles.tempHumidityContainer}>
            <View style={styles.tempHumidityContent}>
              <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large }}>70%</Text>
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: "#90EE90" }}>Normal</Text>
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small }}>Average Humidity</Text>
            </View>
            <View style={styles.tempHumidityContent}>
              <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large }}>32 C°</Text>
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: "#90EE90" }}>Normal</Text>
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small }}>Average Temperature</Text>
            </View>
          </View>
        </View>

        {/* Broiler Chicken Graph */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeaderContainer}>
            <Text style={styles.chartTitle}>No. of Boiler Chicken</Text>
            <Text style={styles.chartDate}>Jan - Apr 2023</Text>
          </View>
          <BarChart
            data={chickenCount}
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

        {/* Death Graph */}
         {/* Broiler Chicken Graph */}
         <View style={styles.chartContainer}>
          <View style={styles.chartHeaderContainer}>
            <Text style={styles.chartTitle}>No. of Chicken Deaths</Text>
            <Text style={styles.chartDate}>Jan - Apr 2023</Text>
          </View>
          <LineChart
            data={chickenMortality}
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default Coop