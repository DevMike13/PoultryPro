import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit-with-pressable-bar-graph';

import styles from './summary.style';
import { COLORS, FONT, SIZES, SHADOWS } from '../../../../constants/theme';

import firebase from '../../../../firebase';

const Summary = () => {

  const [batchNumbers, setBatchNumbers] = useState([]);
  const [batchHarvestData, setBatchHarvestData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    // Reference to the Firestore collection
    const collectionRef = firebase.firestore().collection('batch');

    // Fetch the data
    collectionRef.get().then((querySnapshot) => {
      const batchNumbersArray = [];

      querySnapshot.forEach((doc) => {
        const batchData = doc.data();
        const batchNo = batchData.batch_no;
        const formattedBatchNo = `Batch ${batchNo}`; 
        batchNumbersArray.push(formattedBatchNo);
      });

      setBatchNumbers(batchNumbersArray);
    });
  }, []);

  useEffect(() => {
    // Reference to the Firestore collection
    const collectionRef = firebase.firestore().collection('harvest');

    // Fetch the data and sort by batch_no
    collectionRef.orderBy('batch_no').get().then((querySnapshot) => {
      const batchHarvestMap = new Map();

      querySnapshot.forEach((doc) => {
        const harvestData = doc.data();
        const batchNo = harvestData.batch_no;
        const goodChicken = harvestData.good_chicken;

        if (batchHarvestMap.has(batchNo)) {
          const existingCount = batchHarvestMap.get(batchNo);
          batchHarvestMap.set(batchNo, existingCount + goodChicken);
        } else {
          batchHarvestMap.set(batchNo, goodChicken);
        }
      });

      const summedGoodChicken = [...batchHarvestMap.values()].sort((a, b) =>
        batchHarvestMap.get(a) - batchHarvestMap.get(b)
      );

      setBatchHarvestData(summedGoodChicken);
      setIsLoading(false);
    });
  }, []);

  const harvData = {};

  if (batchNumbers.length > 0 && batchHarvestData.length > 0) {
    harvData.labels = batchNumbers;
    harvData.datasets = [
      {
        data: batchHarvestData,
      },
    ];
  } else {
    harvData.labels = ['No Data'];
    harvData.datasets = [
      {
        data: [0], 
      },
    ];
  }

  const handleDataPointClick = (data) => {
    if (tooltipData && tooltipData.index === data.index) {
      // If the tooltip is already open for this data point, close it
      setTooltipData(null);
    } else {
      // If the tooltip is not open or is open for a different data point, open it
      const index = data.index;
      const value = harvData.datasets[0].data[index];
      const label = harvData.labels[index];
      setTooltipData({ x: data.x, y: data.y, value, label, index });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        { batchHarvestData.length > 4 ? (
         
          <View style={styles.chartContainer}>
            <Text style={styles.headerTitle}>Batch Summary</Text>
            <ScrollView horizontal>
              <BarChart
                onDataPointClick={handleDataPointClick}
                data={harvData}
                width={800}
                height={300}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                // style={styles.chart}
              />
              {tooltipData && (
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: COLORS.lightWhite,
                    alignItems: "center",
                    top: tooltipData.y,
                    left: tooltipData.x,
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                    borderBottomEndRadius: SIZES.small,
                    borderTopLeftRadius: SIZES.small,
                    borderTopRightRadius: SIZES.small,
                    ...SHADOWS.medium,
                    zIndex: 1000,
                  }}
                > 
                  <View style={{ flexDirection: "row", alignItems: "center"}}>
                    <Text style={{ fontFamily: FONT.medium }}>Count: </Text>
                    <Text style={{ fontFamily: FONT.regular }}>{tooltipData.value}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center"}}>
                    <Text style={{ fontFamily: FONT.medium }}>Batch: </Text>
                    <Text style={{ fontFamily: FONT.regular }}>{tooltipData.label}</Text>
                  </View>
                  
                </View>
              )}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.chartContainer}>
            <Text style={styles.headerTitle}>Batch Summary</Text>
            <BarChart
              onDataPointClick={handleDataPointClick}
              data={harvData}
              width={390}
              height={300}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              // style={styles.chart}
            />
            {tooltipData && (
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: COLORS.lightWhite,
                  alignItems: "center",
                  top: tooltipData.y,
                  left: tooltipData.x,
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  borderBottomEndRadius: SIZES.small,
                  borderTopLeftRadius: SIZES.small,
                  borderTopRightRadius: SIZES.small,
                  ...SHADOWS.medium,
                  zIndex: 1000,
                }}
              > 
                <View style={{ flexDirection: "row", alignItems: "center"}}>
                  <Text style={{ fontFamily: FONT.medium }}>Count: </Text>
                  <Text style={{ fontFamily: FONT.regular }}>{tooltipData.value}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center"}}>
                  <Text style={{ fontFamily: FONT.medium }}>Batch: </Text>
                  <Text style={{ fontFamily: FONT.regular }}>{tooltipData.label}</Text>
                </View>
                
              </View>
            )}
          </View>
        )} 
    </SafeAreaView>
  )
}

export default Summary