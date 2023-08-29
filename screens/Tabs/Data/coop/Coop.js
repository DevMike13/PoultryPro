import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { FONT, SIZES, COLORS, SHADOWS } from '../../../../constants/theme';
import { BarChart, LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';

import firebase from '../../../../firebase';
import styles from './coop.style';
  
const Coop = () => {

  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date());
  const [showDatePickerFrom, setShowDatePickerFrom] = useState(false);

  const [selectedDateTo, setSelectedDateTo] = useState(new Date());
  const [showDatePickerTo, setShowDatePickerTo] = useState(false);

  const [filteredMortalityData, setFilteredMortalityData] = useState([]);
  const [filteredChickenData, setFilteredChickenData] = useState([]);

  const [initialMortalityData, setInitialMortalityData] = useState([]);
  const [initialChickenData, setInitialChickenData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  // NEW
  const [batchList, setBatchList] = useState([]);
  const [batchNoList, setBatchNoList] = useState([]);

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
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const newValue = isFilterVisible ? 1 : 0;
    
    Animated.timing(animation, {
      toValue: newValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isFilterVisible]);
  
  const filterStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0], // Adjust the values as needed
        }),
      },
    ],
  };


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
      setIsLoading(false); 
      // console.log(selectedOption);
    }); 
  };

  useEffect(() => {
      getBatchList()
  }, []);

  // useEffect(() => {
  //   if (batchNoList.length > 0) {
  //     setSelectedOption(batchNoList[0]);
  //   }
  // }, [batchNoList]);

  // useEffect(() => {
  //   fetchMortalityData(selectedOption)
  // }, [batchNoList]);
  
  const handleOptionSelect = (no) => {
    setSelectedOption(no);
    fetchMortalityData(no);
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
  
      // console.log(selectedBatchNo);
      // console.log(mergedMortalityData);
      // console.log(formattedMortalityLabels);
      // console.log(mortalityCounts);
    } catch (error) {
      console.error('Error fetching mortality data:', error);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <TouchableOpacity onPress={toggleDatePickerVisibility} style={styles.filterBtn}>
          <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.lightWhite}}>Filter</Text>
          <Ionicons
              name="filter"
              size={18}
              color={COLORS.lightWhite}
          />
        </TouchableOpacity> */}
        {/* { isFilterVisible && (
          <Animated.View style={[styles.filterContainer, filterStyle]}>
            <View style={styles.filterDateContainer}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>From Date: </Text>
                <TouchableOpacity onPress={toggleDatePickerFrom} style={{ backgroundColor: COLORS.gray2, paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", gap: 15, borderRadius: SIZES.small }}>
                  <Text style={styles.dateText}>
                    {formatDate(selectedDateFrom)}
                  </Text>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                  />
                </TouchableOpacity>
                {showDatePickerFrom && (
                  <DateTimePicker
                    value={selectedDateFrom}
                    mode="date"
                    display="default"
                    onChange={handleDateChangeFrom}
                  />
                )}
              </View>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>To Date: </Text>
                <TouchableOpacity onPress={toggleDatePickerTo} style={{ backgroundColor: COLORS.gray2, paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", gap: 15, borderRadius: SIZES.small }}>
                  <Text style={styles.dateText}>
                    {formatDate(selectedDateTo)}
                  </Text>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                  />
                </TouchableOpacity>
                {showDatePickerTo && (
                  <DateTimePicker
                    value={selectedDateTo}
                    mode="date"
                    display="default"
                    onChange={handleDateChangeTo}
                  />
                )}
              </View>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 20, flexDirection: "row", gap: 80 }}>
              <TouchableOpacity style={{ backgroundColor: COLORS.tertiary, width: 100, paddingVertical: 5, borderRadius: SIZES.small, alignItems: "center" }} onPress={() => { fetchMortalityData(); fetchChickenPerMonthData(); }}>
                <Text style={{ fontFamily: FONT.medium, color: COLORS.lightWhite }}>
                  Apply
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: COLORS.tertiary, width: 110, paddingVertical: 5, borderRadius: SIZES.small, alignItems: "center" }} onPress={() => { fetchMortalityInitialData(); fetchChickenInitialData(); }}>
                <Text style={{ fontFamily: FONT.medium, color: COLORS.lightWhite }}>
                  Remove Filter
                </Text>
              </TouchableOpacity>
            </View>
            
          </Animated.View>
        )} */}
        <View style={styles.firstContainer}> 
          {/* CYCLE */}
          <View>
            <TouchableOpacity style={styles.cycleContainer} onPress={toggleDropdown}>
              <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.xxLarge}}>
                {selectedOption}
              </Text>
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
              <View style={{ backgroundColor: COLORS.lightWhite, ...SHADOWS.medium, borderBottomEndRadius: SIZES.small, borderBottomLeftRadius: SIZES.small, borderTopLeftRadius: SIZES.small, marginTop: 10 }}>
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
            {/* <Text style={styles.chartDate}>{monthName} - {monthNameTo} {year}</Text> */}
          </View>
          {mortCount.length > 0 ? (
            <BarChart
              data={mortLineData}
              width={390}
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

        {/* Death Graph */}
         {/* Broiler Chicken Graph */}
         <View style={styles.chartContainer}>
          <View style={styles.chartHeaderContainer}>
            <Text style={styles.chartTitle}>No. of Chicken Deaths</Text>
            {/* <Text style={styles.chartDate}>{monthName} - {monthNameTo} {year}</Text> */}
          </View>
          {/* {filteredMortalityData.length > 0 ? (
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
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />
          ) : (
            <ActivityIndicator size="large" color="blue" />
          )} */}
         {mortCount.length > 0 ? (
          <LineChart
            data={mortLineData}
            width={390}
            height={220}
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
        ) : (
          <ActivityIndicator size="large" color="blue" />
        )}

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Coop