import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { FONT, SIZES, COLORS } from '../../../../constants/theme';
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

  const toggleDatePickerVisibility = () => {
   
    setIsFilterVisible(!isFilterVisible);
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

  const handleDateChangeFrom = (event, selectedFrom) => {
    if (selectedFrom) {
      setSelectedDateFrom(selectedFrom);
    }
    setShowDatePickerFrom(Platform.OS === 'ios');
  };

  const toggleDatePickerFrom = () => {
    setShowDatePickerFrom(!showDatePickerFrom);
  };

  const handleDateChangeTo = (event, selectedTo) => {
    if (selectedTo) {
      setSelectedDateTo(selectedTo);
    }
    setShowDatePickerTo(Platform.OS === 'ios');
  };

  const toggleDatePickerTo = () => {
    setShowDatePickerTo(!showDatePickerTo);
  };

  const formatDate = date => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleString('en-US', options);
  };

  // FETCH CHICKENS PER MONTH
  const fetchChickenPerMonthData = async () => {
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection('chickens_added');

      // Adjust the selectedDateFrom to the first day of the selected month
      const startOfMonth = new Date(selectedDateFrom);
      startOfMonth.setDate(1);

      // Adjust the selectedDateTo to the last day of the selected month
      const endOfMonth = new Date(selectedDateTo);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);

      
      const querySnapshot = await collectionRef
        .where('date_added', '>=', firebase.firestore.Timestamp.fromDate(startOfMonth))
        .where('date_added', '<=', firebase.firestore.Timestamp.fromDate(endOfMonth))
        .orderBy('date_added')
        .get();

      const fetchedData = [];
      const groupedData = {};

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const dateString = data.date_added;
        const dateTimestamp = data.date_added.toDate(); // Convert Firestore timestamp to JS Date
        const yearMonth = `${dateTimestamp.getFullYear()}-${dateTimestamp.getMonth() + 1}`;

        if (!groupedData[yearMonth]) {
          groupedData[yearMonth] = { count: 0 };
        }
        groupedData[yearMonth].count += data.count; // Add the count to the grouped data
      });

      Object.keys(groupedData).forEach(yearMonth => {
        fetchedData.push({
          count: groupedData[yearMonth].count,
          date_added: new Date(`${yearMonth}-01`), // Create a new Date object for the grouped month
        });
      });

      setFilteredChickenData(fetchedData);
      setIsLoading(false);
      console.log(fetchedData);
    } catch (error) {
      console.error('Error fetching mortality data:', error);
    }
  };


  // FETCH MORTALITY DATA
  const fetchMortalityData = async () => {
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection('chickens_mortality');

      // Adjust the selectedDateFrom to the first day of the selected month
      const startOfMonth = new Date(selectedDateFrom);
      startOfMonth.setDate(1);

      // Adjust the selectedDateTo to the last day of the selected month
      const endOfMonth = new Date(selectedDateTo);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);

      
      const querySnapshot = await collectionRef
        .where('mortality_date', '>=', firebase.firestore.Timestamp.fromDate(startOfMonth))
        .where('mortality_date', '<=', firebase.firestore.Timestamp.fromDate(endOfMonth))
        .orderBy('mortality_date')
        .get();

      const fetchedData = [];
      const groupedData = {};

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const dateString = data.mortality_date;
        const dateTimestamp = data.mortality_date.toDate(); // Convert Firestore timestamp to JS Date
        const yearMonth = `${dateTimestamp.getFullYear()}-${dateTimestamp.getMonth() + 1}`;

        if (!groupedData[yearMonth]) {
          groupedData[yearMonth] = { count: 0 };
        }
        groupedData[yearMonth].count += data.count; // Add the count to the grouped data
      });

      Object.keys(groupedData).forEach(yearMonth => {
        fetchedData.push({
          count: groupedData[yearMonth].count,
          mortality_date: new Date(`${yearMonth}-01`), // Create a new Date object for the grouped month
        });
      });

      setFilteredMortalityData(fetchedData);
      setIsLoading(false);
      console.log(fetchedData);
    } catch (error) {
      console.error('Error fetching mortality data:', error);
    }
  };

  // GET INITIAL MORTALITY DATA
  const fetchMortalityInitialData = async () => {
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection('chickens_mortality');
  
      // Adjust the selectedDateFrom to the first day of the selected month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
  
      // Adjust the selectedDateTo to the last day of the last month of the current year
      const currentDate = new Date();
      const lastMonthOfYear = new Date(currentDate.getFullYear(), 12, 0); // Last day of December of the current year
  
      const querySnapshot = await collectionRef
        .where('mortality_date', '>=', firebase.firestore.Timestamp.fromDate(startOfMonth))
        .where('mortality_date', '<=', firebase.firestore.Timestamp.fromDate(lastMonthOfYear))
        .orderBy('mortality_date')
        .get();
  
      const groupedData = {};
  
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const dateTimestamp = data.mortality_date.toDate();
        const yearMonth = `${dateTimestamp.getFullYear()}-${dateTimestamp.getMonth() + 1}`;
  
        if (!groupedData[yearMonth]) {
          groupedData[yearMonth] = { count: 0 };
        }
        groupedData[yearMonth].count += data.count;
      });
  
      const fetchedData = Object.keys(groupedData).map(yearMonth => ({
        count: groupedData[yearMonth].count,
        mortality_date: new Date(`${yearMonth}-01`), // Create a new Date object for the grouped month
      }));
  
      setInitialMortalityData(fetchedData);
      setIsLoading(false);
      setSelectedDateTo(lastMonthOfYear);
      // console.log(fetchedData);
    } catch (error) {
      console.error('Error fetching mortality data:', error);
    }
  };

  // GET INITIAL MORTALITY DATA
  const fetchChickenInitialData = async () => {
    try {
      const firestore = firebase.firestore();
      const collectionRef = firestore.collection('chickens_added');
  
      // Adjust the selectedDateFrom to the first day of the selected month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
  
      // Adjust the selectedDateTo to the last day of the last month of the current year
      const currentDate = new Date();
      const lastMonthOfYear = new Date(currentDate.getFullYear(), 12, 0); // Last day of December of the current year
  
      const querySnapshot = await collectionRef
        .where('date_added', '>=', firebase.firestore.Timestamp.fromDate(startOfMonth))
        .where('date_added', '<=', firebase.firestore.Timestamp.fromDate(lastMonthOfYear))
        .orderBy('date_added')
        .get();
  
      const groupedData = {};
  
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const dateTimestamp = data.date_added.toDate();
        const yearMonth = `${dateTimestamp.getFullYear()}-${dateTimestamp.getMonth() + 1}`;
  
        if (!groupedData[yearMonth]) {
          groupedData[yearMonth] = { count: 0 };
        }
        groupedData[yearMonth].count += data.count;
      });
  
      const fetchedData = Object.keys(groupedData).map(yearMonth => ({
        count: groupedData[yearMonth].count,
        date_added: new Date(`${yearMonth}-01`), // Create a new Date object for the grouped month
      }));
  
      setInitialChickenData(fetchedData);
      setIsLoading(false);
      setSelectedDateTo(lastMonthOfYear);
      // console.log(fetchedData);
    } catch (error) {
      console.error('Error fetching chickens data:', error);
    }
  };
  
  // useEffect(() => {
  //   fetchMortalityInitialData();
  //   fetchChickenInitialData();
  // }, []);
  
  // let initChicken = [];

  // if (filteredMortalityData.length > 0 ) {
  //   initChicken = filteredMortalityData.map(item => {
  //     const date = item.mortality_date;
  //     return `${date.toLocaleString('default', { month: 'short' })}`;
  //   });
  //   console.log("test");
  // } else {
  //   initChicken = initialMortalityData.map(item => {
  //     const date = item.mortality_date;
  //     return `${date.toLocaleString('default', { month: 'short' })}`;
  //   });
  // }
  // console.log(initChicken);
  const chickenCount = {
    labels: filteredChickenData.map(item => {
      const date = item.date_added;
      // return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      return `${date.toLocaleString('default', { month: 'short' })}`;
    }),
    datasets: [
      {
        data: filteredChickenData.map(item => item.count),
      },
    ],
  };

  const chickenMortality = {
    labels: 
    filteredMortalityData.map(item => {
      const date = item.mortality_date;
      // return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      return `${date.toLocaleString('default', { month: 'short' })}`;
    }),
    // initChicken,
    datasets: [
      {
        data: filteredMortalityData.map(item => item.count),
      },
    ],
  };

  const getOnlyMonth = new Date(selectedDateFrom);
  const options = { month: 'short' };
  const monthName = getOnlyMonth.toLocaleString('default', options);

  const getOnlyMonthTo = new Date(selectedDateTo);
  const optionsTo = { month: 'short' };
  const monthNameTo = getOnlyMonthTo.toLocaleString('default', optionsTo);

  const year = selectedDateTo.getFullYear();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={toggleDatePickerVisibility} style={styles.filterBtn}>
          <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: COLORS.lightWhite}}>Filter</Text>
          <Ionicons
              name="filter"
              size={18}
              color={COLORS.lightWhite}
          />
        </TouchableOpacity>
        { isFilterVisible && (
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
        )}
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
            <Text style={styles.chartDate}>{monthName} - {monthNameTo} {year}</Text>
          </View>
          {filteredChickenData.length > 0 ? (
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
            <Text style={styles.chartDate}>{monthName} - {monthNameTo} {year}</Text>
          </View>
          {filteredMortalityData.length > 0 ? (
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
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Coop