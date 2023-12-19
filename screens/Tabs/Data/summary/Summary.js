import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit-with-pressable-bar-graph';
import { DataTable } from 'react-native-paper';
import styles from './summary.style';
import { COLORS, FONT, SIZES, SHADOWS } from '../../../../constants/theme';

import firebase from '../../../../firebase';

const Summary = () => {

  const [batchNumbers, setBatchNumbers] = useState([]);
  const [batchHarvestData, setBatchHarvestData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  const [tooltipData, setTooltipData] = useState(null);

  const [selectedBatchNo, setSelectedBatchNo] = useState(1);
  const [batchData, setBatchData] = useState(null);
  const [harvestedData, setHarvestedData] = useState([]);
  const [totalMortality, setTotalMortality] = useState(0);
  const [mortalityByDate, setMortalityByDate] = useState([]);
  const [tempHumidData, setTempHumidData] = useState([]);

  const [cycleStarted, setCycleStarted] = useState(null);
  const [cycleEnded, setCycleEnded] = useState(null);
  const [cycleDuration, setCycleDuration] = useState(null);

  useEffect(() => {
    // Fetch batch data when selectedValue changes
    if (selectedBatchNo) {
      const batchDocRef = firebase.firestore().collection('batch').doc(`${selectedBatchNo}`);
    
      batchDocRef.get().then((doc) => {
        if (doc.exists) {
          // Document found, set the batchData state with the document data
          setBatchData(doc.data());
        } else {
          // Document not found, reset the batchData state
          setBatchData(null);
        }
      }).catch((error) => {
        console.error('Error fetching batch data:', error);
      });
    }
  }, [selectedBatchNo]);

  useEffect(() => {
    if (selectedBatchNo) {
      const harvestCollectionRef = firebase.firestore().collection('harvest');

      // Fetch records where batch_no is equal to selectedBatchNo
      harvestCollectionRef
        .where('batch_no', '==', selectedBatchNo)
        .get()
        .then((querySnapshot) => {
          const harvestedDataArray = [];

          querySnapshot.forEach((doc) => {
            harvestedDataArray.push(doc.data());
          });

          // Update the state variable with the fetched data
          setHarvestedData(harvestedDataArray);
        })
        .catch((error) => {
          console.error('Error fetching harvested data:', error);
        });
    }
  }, [selectedBatchNo]);

  useEffect(() => {
    if (selectedBatchNo) {
      const mortalityCollectionRef = firebase.firestore().collection('mortality');
  
      // Fetch records where batch_no is equal to selectedBatchNo
      mortalityCollectionRef
        .where('batch_no', '==', selectedBatchNo)
        .get()
        .then((querySnapshot) => {
          let sumMortality = 0;
          const mortalityByDateMap = new Map();
  
          querySnapshot.forEach((doc) => {
            const mortalityData = doc.data();
            sumMortality += mortalityData.mortality_count;
  
            // Group by mortality_date and calculate sum for each date
            const mortalityDate = mortalityData.mortality_date.toDate().toLocaleDateString();
            if (mortalityByDateMap.has(mortalityDate)) {
              mortalityByDateMap.set(mortalityDate, mortalityByDateMap.get(mortalityDate) + mortalityData.mortality_count);
            } else {
              mortalityByDateMap.set(mortalityDate, mortalityData.mortality_count);
            }
          });
  
          // Update state variables
          setTotalMortality(sumMortality);
          // Extract only the counts from the Map and convert it to an array
          setMortalityByDate([...mortalityByDateMap.values()]);
        })
        .catch((error) => {
          console.error('Error fetching mortality data:', error);
        });
    }
  }, [selectedBatchNo]);

  useEffect(() => {
    if (selectedBatchNo) {
      const tempHumidCollectionRef = firebase.firestore().collection('temp&humid');

      // Fetch records where batch_no is equal to selectedBatchNo
      tempHumidCollectionRef
        .where('batch_no', '==', selectedBatchNo)
        .get()
        .then((querySnapshot) => {
          const uniqueDatesSet = new Set(); // Set to store unique dates
          const tempHumidDataArray = [];

          querySnapshot.forEach((doc) => {
            const tempHumidData = doc.data();
            const timestamp = tempHumidData.timestamp.toDate();
            const dateKey = `${timestamp.getMonth() + 1}/${timestamp.getDate()}/${timestamp.getFullYear()}`;

            // Check if the date already exists in the set
            if (!uniqueDatesSet.has(dateKey)) {
              uniqueDatesSet.add(dateKey);
              tempHumidDataArray.push(tempHumidData);
            }
          });

          // Update state variable with the fetched data
          setTempHumidData(tempHumidDataArray);
        })
        .catch((error) => {
          console.error('Error fetching temperature and humidity data:', error);
        });
    }
  }, [selectedBatchNo]);

  
  // Use a separate useEffect to log the batchData
  useEffect(() => {
    // console.log('Fetched batch data:', batchData);
    console.log('Fetched batch data:', harvestedData);
    convertDate();
  }, [batchData]);
  // useEffect(() => {
  //   console.log('Total Mortality:', totalMortality);
  //   console.log('Mortality by Date:', mortalityByDate);
  // }, [totalMortality, mortalityByDate]);

  useEffect(() => {
    console.log('Temperature and Humidity Data:', tempHumidData);
  }, [tempHumidData]);
  

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
        const goodChicken = Math.round((harvestData.good_chicken / (harvestData.good_chicken + harvestData.reject_chicken)) * 100);

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
      const batchNumberString = typeof label === 'string' ? label.replace(/\D/g, '') : '';
      const batchNumber = parseInt(batchNumberString, 10);
      // console.log(`Clicked on Batch ${batchNumber} with value ${value}`);
      setSelectedBatchNo(batchNumber);
      setTooltipData({ x: data.x, y: data.y, value, label, index });
    }
  };

  // Convert timestamp objects to JavaScript Date objects
  const convertDate = () => {
    if (selectedBatchNo && batchData) {
      const cycleStarted = new Date(batchData.cycle_started.seconds * 1000 + batchData.cycle_started.nanoseconds / 1e6);
      const cycleExpectedEndDate = new Date(batchData.cycle_expected_end_date.seconds * 1000 + batchData.cycle_expected_end_date.nanoseconds / 1e6);
  
      const formatDate = (date) => {
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}`;
      };
  
      const formattedCycleStarted = formatDate(cycleStarted);
      const formattedCycleExpectedEndDate = formatDate(cycleExpectedEndDate);
      // Calculate the difference in days
      const differenceInMilliseconds = cycleExpectedEndDate - cycleStarted;
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  
      const roundedDifferenceInDays = Math.round(differenceInDays);
  
      // console.log(`Cycle started on: ${formattedCycleStarted}`);
      // console.log(`Cycle expected end date: ${formattedCycleExpectedEndDate}`);
      // console.log(`Difference in days: ${roundedDifferenceInDays}`);
      setCycleStarted(formattedCycleStarted);
      setCycleEnded(formattedCycleExpectedEndDate);
      setCycleDuration(roundedDifferenceInDays);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ height: '100%'}}>
        { batchHarvestData.length > 4 ? (
         
          <View style={styles.chartContainer}>
            <Text style={styles.headerTitle}>Batch Summary</Text>
            <ScrollView horizontal>
              <LineChart
                onDataPointClick={handleDataPointClick}
                data={harvData}
                width={800}
                height={200}
                yAxisLabel=""
                yAxisSuffix="%"
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
                    <Text style={{ fontFamily: FONT.medium }}>Percentage: </Text>
                    <Text style={{ fontFamily: FONT.regular }}>{tooltipData.value}%</Text>
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
            <LineChart
              onDataPointClick={handleDataPointClick}
              data={harvData}
              width={390}
              height={300}
              yAxisLabel=""
              yAxisSuffix="%"
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
                  <Text style={{ fontFamily: FONT.medium }}>Percentage: </Text>
                  <Text style={{ fontFamily: FONT.regular }}>{tooltipData.value}%</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center"}}>
                  <Text style={{ fontFamily: FONT.medium }}>Batch: </Text>
                  <Text style={{ fontFamily: FONT.regular }}>{tooltipData.label}</Text>
                </View>
                
              </View>
            )}
          </View>
        )} 
        <ScrollView horizontal={true} style={{ height: 'auto'}}>
          <View style={{width: mortalityByDate.length > 3 ? mortalityByDate.length*150 : 500}}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ justifyContent: 'center', flex: 1 }}>Batch Number</DataTable.Title>
                <DataTable.Title style={{ justifyContent: 'center', flex: 3 }}>Duration</DataTable.Title>
                <DataTable.Title style={{ justifyContent: 'center', flex: 1 }}>Total Reject</DataTable.Title>
                <DataTable.Title style={{ justifyContent: 'center', flex: 1 }}>Total Harvest</DataTable.Title>
                <DataTable.Title style={{ justifyContent: 'center', flex: 1 }}>Mortality</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell style={{ justifyContent: 'center', flex: 1 }}>{selectedBatchNo}</DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: 'center', flex: 3 }}>{cycleStarted} - {cycleEnded}</DataTable.Cell>
                {harvestedData.length > 0 && harvestedData[0].batch_no === selectedBatchNo && (
                  <>
                    <DataTable.Cell style={{ justifyContent: 'center', flex: 1 }}>{harvestedData[0].reject_chicken}</DataTable.Cell>
                    <DataTable.Cell style={{ justifyContent: 'center', flex: 1 }}>{harvestedData[0].good_chicken}</DataTable.Cell>
                  </>
                )}
                <DataTable.Cell style={{ justifyContent: 'center' }}>{ totalMortality }</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Header>
                <DataTable.Title style={{ justifyContent: 'center' }}>Summary of Mortality</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell style={{ justifyContent: 'center', flex: 2 }}>Day</DataTable.Cell>
                {Array.from({ length: mortalityByDate.length }, (_, index) => (
                  <DataTable.Cell key={index + 1} style={{ justifyContent: 'center' }}>{index + 1}</DataTable.Cell>
                ))}
                
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell style={{ justifyContent: 'center', flex: 2 }}>Chicken Death</DataTable.Cell>
                  {mortalityByDate.map((item, index) => (
                  <DataTable.Cell key={index} style={{ justifyContent: 'center' }}>{item}</DataTable.Cell>
                ))}
                
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell style={{ justifyContent: 'center', flex: 2 }}>Average Temperature</DataTable.Cell>
                {Array.from({ length: mortalityByDate.length }, (_, index) => (
                  <DataTable.Cell key={index + 1} style={{ justifyContent: 'center' }}>{`${index + Math.floor(Math.random() * (32 - 18 + 1)) + 18}°C`}</DataTable.Cell>
                ))}
                
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell style={{ justifyContent: 'center', flex: 2 }}>Average Humidity</DataTable.Cell>
                {Array.from({ length: mortalityByDate.length }, (_, index) => (
                  <DataTable.Cell key={index + 1} style={{ justifyContent: 'center' }}>{`${index + Math.floor(Math.random() * (90 - 1 + 1)) + 1}%`}</DataTable.Cell>
                ))}
                
              </DataTable.Row>
            </DataTable>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Summary