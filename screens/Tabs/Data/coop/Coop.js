import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { FONT, SIZES, COLORS, SHADOWS } from '../../../../constants/theme';
import { BarChart, LineChart } from 'react-native-chart-kit';
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
    setIsDropdownOpen(false);
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
      { mortCount.length > 7 ? (
        <ScrollView horizontal>
        {/* Broiler Chicken Graph */}
          <View style={styles.chartContainer}>
            <View style={styles.chartHeaderContainer}>
              <Text style={styles.chartTitle}>No. of Boiler Chicken</Text>
              {mortCount.length > 0 ? (
                <Text style={styles.chartDate}>{formatGetSpecificMonth(batchInfo.cycle_started)} - {formatGetSpecificMonth(batchInfo.cycle_expected_end_date)}</Text>
              ) : (
                <ActivityIndicator size="large" color="blue" />
              )}
            </View>
            {mortCount.length > 0 ? (
              <BarChart
                data={mortLineData}
                width={800}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                }}
                style={styles.chart}
              />
            ) : (
              <ActivityIndicator size="large" color="blue" />
            )} 
          </View>
        </ScrollView>
      ) : (
        <View style={styles.chartContainer}>
          <View style={styles.chartHeaderContainer}>
            <Text style={styles.chartTitle}>No. of Boiler Chicken</Text>
            {mortCount.length > 0 ? (
              <Text style={styles.chartDate}>{formatGetSpecificMonth(batchInfo.cycle_started)} - {formatGetSpecificMonth(batchInfo.cycle_expected_end_date)}</Text>
            ) : (
              <ActivityIndicator size="large" color="blue" />
            )}
          </View>
          {mortCount.length > 0 ? (
            <BarChart
              data={mortLineData}
              width={screenWidth}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              }}
              style={styles.chart}
            />
          ) : (
            <ActivityIndicator size="large" color="blue" />
          )} 
        </View>
      )}
      
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
                
                  <LineChart
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
                      skipLabels: 2, // Skip every 2nd label
                      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                  
                  />
                
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
                <LineChart
                  data={mortLineData}
                  width={screenWidth}
                  height={270}
                  yAxisLabel=""
                  yAxisSuffix=""
                  bezier
                  // verticalLabelRotation={30}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    skipLabels: 2, // Skip every 2nd label
                    color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                
                />
              
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