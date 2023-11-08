import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DataTable } from 'react-native-paper';

import firebase from '../../../../firebase';

import styles from './death.style';
import { COLORS, FONT, SIZES, SHADOWS } from '../../../../constants/theme';
const Death = () => {

  const [batchNumbers, setBatchNumbers] = useState([]);
  const [batchMortalityData, setBatchMortalityData] = useState([]);
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

      // Set the state variable with the batch numbers array
      setBatchNumbers(batchNumbersArray);
    });
  }, []);

  
  useEffect(() => {
    // Reference to the Firestore collection
    const collectionRef = firebase.firestore().collection('mortality');

    // Fetch the data and sort by batch_no
    collectionRef.orderBy('batch_no').get().then((querySnapshot) => {
      const batchMortalityMap = new Map();

      querySnapshot.forEach((doc) => {
        const mortalityData = doc.data();
        const batchNo = mortalityData.batch_no;
        const mortalityCount = mortalityData.mortality_count;

        if (batchMortalityMap.has(batchNo)) {
          const existingCount = batchMortalityMap.get(batchNo);
          batchMortalityMap.set(batchNo, existingCount + mortalityCount);
        } else {
          batchMortalityMap.set(batchNo, mortalityCount);
        }
      });

      // Extract the summed mortality counts from the map and sort them by batch_no
      const summedMortalityCounts = [...batchMortalityMap.values()].sort((a, b) =>
        batchMortalityMap.get(a) - batchMortalityMap.get(b)
      );

      // Set the state variable with the summed mortality counts
      setBatchMortalityData(summedMortalityCounts);
      setIsLoading(false);
    });
  }, []);

  
  const mortData = {};

  if (batchNumbers.length > 0 && batchMortalityData.length > 0) {
    mortData.labels = batchNumbers;
    mortData.datasets = [
      {
        data: batchMortalityData,
      },
    ];
  } else {
    // Add a default label and empty dataset if either or both arrays are empty
    mortData.labels = ['No Data'];
    mortData.datasets = [
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
      const value = mortData.datasets[0].data[index];
      const label = mortData.labels[index];
      setTooltipData({ x: data.x, y: data.y, value, label, index });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollView}>
    <SafeAreaView style={styles.container}>
        <View style={styles.chartContainer}>
          <Text style={styles.headerTitle}>Mortality Rate</Text>
          { isLoading && batchNumbers.length <= 0 && batchMortalityData.length <= 0 ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <View>
              <LineChart
                bezier
                onDataPointClick={handleDataPointClick}
                data={mortData}
                width={390}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  strokeWidth: 2, // optional, default 3
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(230, 0, 0, ${opacity})`,
                }}
                style={styles.chart}
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
                    borderBottomLeftRadius: SIZES.small,
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
                    <Text style={{ fontFamily: FONT.medium }}>Date: </Text>
                    <Text style={{ fontFamily: FONT.regular }}>{tooltipData.label}</Text>
                  </View>
                  
                </View>
              )}
            </View>
          )}   
        </View>
        <View style={{ width: "90%"}}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ justifyContent: 'center' }}>Batch Number</DataTable.Title>
              <DataTable.Title style={{ justifyContent: 'center' }}>Batch Mortality</DataTable.Title>
            </DataTable.Header>

            {batchNumbers.map((batchNumber, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell style={{ justifyContent: 'center' }}>{batchNumber}</DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: 'center' }}>{batchMortalityData[index]}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
    </SafeAreaView>
    </ScrollView>
  )
}

export default Death