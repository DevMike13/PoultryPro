import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { FONT, SIZES, COLORS, SHADOWS } from '../../../../constants/theme';
import { BarChart, LineChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';

import firebase from '../../../../firebase';
import styles from './coop.style';



const Coop = () => {

  const screenWidth = Dimensions.get("window").width;
  const [isLoading, setIsLoading] = useState(true);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  // NEW
  const [batchList, setBatchList] = useState([]);
  const [batchNoList, setBatchNoList] = useState([]);
  const [batchInfo, setBatchInfo] = useState([]);

  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [chickMort, setChickMort] = useState([]);

  const [mortLabel, setMortLabel] = useState([]);
  const [mortCount, setMortCount] = useState([]);

  const [tooltipData, setTooltipData] = useState(null);

  const [harvestData, setHarvestData] = useState([]);
  const [totalMortalityCount, setTotalMortalityCount] = useState(0);
  const [currentPopulation, setCurrentPopulation] = useState(0);

  const [pieData, setPieData] = useState([]);

  const [mortalityChartData, setMortalityChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });
  
  const formatDate = (timestamp) => {
    if (timestamp && timestamp instanceof firebase.firestore.Timestamp) {
      const date = timestamp.toDate(); // Convert Firestore timestamp to Date
      const options = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
    return '';
  };

  const formatDateToString = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
    
  };

  const formatGetSpecificMonth = (isoDate) => {
    const date = new Date(isoDate);

    const monthYearOptions = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', monthYearOptions);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // useEffect(() => {
  //   const newValue = isFilterVisible ? 1 : 0;
    
  //   Animated.timing(animation, {
  //     toValue: newValue,
  //     duration: 300,
  //     useNativeDriver: true,
  //   }).start();
  // }, [isFilterVisible]);
  
  // const filterStyle = {
  //   opacity: animation,
  //   transform: [
  //     {
  //       translateY: animation.interpolate({
  //         inputRange: [0, 1],
  //         outputRange: [0, 0], // Adjust the values as needed
  //       }),
  //     },
  //   ],
  // };

  const getBatchList = () => {
    // Reference to the Firestore collection
    const collectionRef = firebase.firestore().collection('batch');

    // Fetch the data
    collectionRef.get().then((querySnapshot) => {

      const fetchedBatchList = [];
      const fetchedBatchNoList = [];

      querySnapshot.forEach((doc) => {
        const batchData = doc.data();
        fetchedBatchList.push(batchData);
        fetchedBatchNoList.push(batchData.batch_no); 
      });
      setBatchList(fetchedBatchList); 
      setBatchNoList(fetchedBatchNoList); 
      setSelectedOption(fetchedBatchNoList[0]);
      fetchMortalityData(fetchedBatchNoList[0]);
      fetchBatchInfo(fetchedBatchNoList[0]);
      fetchPieData(fetchedBatchNoList[0]);
      setIsLoading(false); 
    }); 
  };

  useEffect(() => {
      getBatchList()
  }, []);

  const handleOptionSelect = (no) => {
    setSelectedOption(no);
    fetchMortalityData(no);
    fetchBatchInfo(no);
    fetchPieData(no);
    setIsDropdownOpen(false);
  };
  
  const fetchPieData = async (selectedBatchNo) => {
    try {
      const db = firebase.firestore();
      
      // Fetch current population (no_of_chickens)
      const batchRef = db.collection('batch'); // Replace with your collection name
      const query = batchRef.where('batch_no', '==', selectedBatchNo);
      const querySnapshot = await query.get();
      
      const chickensData = [];
  
      // Loop through the documents (there should be only one document matching the batch_no)
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Assuming 'no_of_chickens' is a numeric field in Firestore
        const noOfChickens = data.no_of_chicken;
        chickensData.push(noOfChickens);
      });
      
      // Get the first (and only) element of the array
      const currentPopulation = chickensData[0];

      // Now, fetch the sum of mortality_count
      const mortalityRef = db.collection('mortality'); // Replace with your "mortality" collection name
      const mortalityQuery = mortalityRef.where('batch_no', '==', selectedBatchNo);
      const mortalityQuerySnapshot = await mortalityQuery.get();
  
      let mortalityTotal = 0;
  
      mortalityQuerySnapshot.forEach((mortalityDoc) => {
        const mortalityData = mortalityDoc.data();
        mortalityTotal += mortalityData.mortality_count;
      });
  
      // Calculate the percentages
      
      const mortality = mortalityTotal;
  
      setCurrentPopulation(currentPopulation); 
      setTotalMortalityCount(mortality);
      setIsLoading(false);
      // Now, you can safely log the values
      
    } catch (error) {
      console.error('Error fetching mortality data:', error);
      // Handle the error as needed
    }
  };
  
  const fetchMortalityData = async (selectedBatchNo) => {
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection('mortality');
  
      const querySnapshot = await collectionRef
        .where('batch_no', '==', parseInt(selectedBatchNo))
        .orderBy('mortality_date')
        .get();
  
      const mortalityData = querySnapshot.docs.map((doc) => doc.data());
  
      const mergedData = {};
      const mergedLabels = {};
  
      mortalityData.forEach((item) => {
        const date = formatDate(item.mortality_date);
  
        if (!mergedData[date]) {
          mergedData[date] = 0;
          mergedLabels[date] = date;
        }
  
        mergedData[date] += item.mortality_count;
      });
  
      const mergedMortalityData = Object.keys(mergedData).map((date) => ({
        mortality_date: date,
        mortality_count: mergedData[date],
      }));
  
      setChickMort(mergedMortalityData);
  
      const formattedMortalityLabels = Object.keys(mergedLabels).map((date) => mergedLabels[date]);
      setMortLabel(formattedMortalityLabels);
  
      const mortalityCounts = Object.keys(mergedData).map((date) => mergedData[date]);
      setMortCount(mortalityCounts);
  
      const newChartData = {
        labels: formattedMortalityLabels,
        datasets: [
          {
            data: mortalityCounts,
          },
        ],
      };
  
      setMortalityChartData(newChartData);
      setTooltipData(null);
    } catch (error) {
      console.error('Error fetching mortality data:', error);
    }
  };
  
  const fetchBatchInfo = async (selectedBatchNo) => {
    try {
      // Fetch batch data
      const batchDocumentRef = firebase.firestore().collection('batch').doc(`${selectedBatchNo}`);
      const batchDocumentSnapshot = await batchDocumentRef.get();
      const batchInfo = batchDocumentSnapshot.data();

      // Convert timestamp fields to JavaScript Date objects
      batchInfo.cycle_expected_end_date = batchInfo.cycle_expected_end_date.toDate();
      batchInfo.cycle_started = batchInfo.cycle_started.toDate();
  
      setBatchInfo(batchInfo);
      // console.log(batchInfo);
      setIsLoading(false);
      // ... Your existing mortality data fetching logic ...
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const mortLineData = {
    labels: mortLabel,
    datasets: [
      {
        data: mortCount,
      },
    ],
  };


  const pieTempData = [
    { name: 'Population', population: currentPopulation, color: '#1ABC9C' },
    { name: 'Mortality', population: totalMortalityCount, color: '#E74C3C'  },
  ]
  
  const handleDataPointClick = (data) => {
    if (tooltipData && tooltipData.index === data.index) {
      // If the tooltip is already open for this data point, close it
      setTooltipData(null);
    } else {
      // If the tooltip is not open or is open for a different data point, open it
      const index = data.index;
      const value = mortLineData.datasets[0].data[index];
      const label = mortLineData.labels[index];
      setTooltipData({ x: data.x, y: data.y, value, label, index });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.firstContainer}> 
        {/* CYCLE */}
        <View style={Platform.OS === 'ios' ? {zIndex: 999} : {}}>
          <TouchableOpacity style={styles.cycleContainer} onPress={toggleDropdown}>
            { batchNoList.length > 0 ? (
              <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.xxLarge}}>
              {selectedOption}
              </Text>
            ) : (
              <ActivityIndicator size="large" color="blue" />
            )}
            <View style={{ flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "center" }}>
              {
                isDropdownOpen == true ? (
                  <Ionicons
                    name="caret-up"
                    size={18}
                  />
                ) : (
                  <Ionicons
                    name="caret-down"
                    size={18}
                  />
                )
              }
              
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.xSmall }}>
                Select Batch No.
              </Text>
            </View>
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={{ position:"absolute", top: 100, right: 5, backgroundColor: COLORS.lightWhite, ...SHADOWS.medium, borderBottomEndRadius: SIZES.small, borderBottomLeftRadius: SIZES.small, borderTopLeftRadius: SIZES.small, zIndex: 1, marginTop: 10, elevation: 2, paddingVertical: 20, width: 118 }}>
              {batchNoList.map((no, index) => (
                <TouchableOpacity
                  key={index} 
                  onPress={() => {handleOptionSelect(no); fetchMortalityData(no);}}
                  style={{ fontFamily: FONT.medium, alignItems: "center", paddingVertical: 10 }}
                >
                  <Text style={{ fontFamily: FONT.medium }}>Batch No. {no}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* HUMIDITY AND TEMP */}
        <View style={styles.batchInfoContainer}>
          <View style={styles.batchContainerHeader}>
            <Text style={{ fontFamily: FONT.bold }}>Batch Infomation</Text>
          </View>
          <View style={styles.tempHumidityContainer}>
            <View style={styles.tempHumidityContent}>
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: "green" }}>Start</Text>
              { mortCount.length > 0 ? (
                
                <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small }}>{formatDateToString(batchInfo.cycle_started)}</Text>
                
              ) : (
                <ActivityIndicator size="large" color="blue" />
              )}
              
            </View>
            <View style={styles.tempHumidityContent}>
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: "red" }}>End</Text>
              { mortCount.length > 0 ? (
                <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small }}>{formatDateToString(batchInfo.cycle_expected_end_date)}</Text>
              ) : (
                <ActivityIndicator size="large" color="blue" />
              )}
            </View>
          </View>
          <View style={styles.statusContainer}>
            <Text style={{ fontFamily: FONT.medium }}>Status: </Text>
            { mortCount.length > 0 ? (
              <Text style={{ fontFamily: FONT.regular, color: new Date() > batchInfo.cycle_expected_end_date ? "red" : "green", }}>{new Date() > batchInfo.cycle_expected_end_date ? "Ended" : "Ongoing"}</Text>
            ) : (
              <ActivityIndicator size="large" color="blue" />
            )}
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollView}>
          <View style={styles.chartContainer}>
            <Text style={{ fontFamily: FONT.medium, alignSelf: "flex-start", paddingLeft: 10, fontSize: SIZES.medium }}>Population & Mortality</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              
                <PieChart
                  data={pieTempData}
                  width={400}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  avoidFalseZero={true}
                  accessor="population"
                  backgroundColor="transparent"
                />
          
            )}
        </View>
        { mortCount.length > 7 ? (
          <ScrollView horizontal>
            <View style={styles.chartContainer}>
              <View style={styles.chartHeaderContainer}>
                <Text style={styles.chartTitle}>No. of Chicken Deaths</Text>
                {mortCount.length > 0 ? (
                  <Text style={styles.chartDate}>{formatGetSpecificMonth(batchInfo.cycle_started)} - {formatGetSpecificMonth(batchInfo.cycle_expected_end_date)}</Text>
                ) : (
                  <ActivityIndicator size="large" color="blue" />
                )}
              </View>
            
              {mortCount.length > 0 ? (
                  <View>
                  <LineChart
                    onDataPointClick={handleDataPointClick}
                    data={mortLineData}
                    width={800}
                    height={270}
                    yAxisLabel=""
                    yAxisSuffix=""
                    bezier
                    verticalLabelRotation={30}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                  
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
              ) : (
                <ActivityIndicator size="large" color="blue" />
              )}
            
            </View>
          </ScrollView>
        ) : (
          <View style={styles.chartContainer}>
            <View style={styles.chartHeaderContainer}>
              <Text style={styles.chartTitle}>No. of Chicken Deaths</Text>
              {mortCount.length > 0 ? (
                <Text style={styles.chartDate}>{formatGetSpecificMonth(batchInfo.cycle_started)} - {formatGetSpecificMonth(batchInfo.cycle_expected_end_date)}</Text>
              ) : (
                <ActivityIndicator size="large" color="blue" />
              )}
            </View>
          
            {mortCount.length > 0 ? (
              <View>
                <LineChart
                  onDataPointClick={handleDataPointClick}
                  data={mortLineData}
                  width={screenWidth}
                  height={270}
                  yAxisLabel=""
                  yAxisSuffix=""
                  bezier
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                
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
            ) : (
              <ActivityIndicator size="large" color="blue" />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Coop