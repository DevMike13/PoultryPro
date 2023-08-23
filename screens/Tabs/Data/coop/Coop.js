import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity } from 'react-native';
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

  const [filteredData, setFilteredData] = useState([]);

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

      setFilteredData(fetchedData);
      console.log(fetchedData);
    } catch (error) {
      console.error('Error fetching mortality data:', error);
    }
  };

  useEffect(() => {
    fetchMortalityData();
  }, []);
  
  const chickenCount = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        data: [10, 25, 15, 30],
      },
    ],
  };

  const chickenMortality = {
    labels: filteredData.map(item => {
      const date = item.mortality_date;
      return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    }),
    datasets: [
      {
        data: filteredData.map(item => item.count),
      },
    ],
  };

  const initialchickenMortality = {
    labels: [''],
    datasets: [
      {
        data: filteredData.map(item => item.count),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
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
          <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: 20 }}>
            <TouchableOpacity style={{ backgroundColor: COLORS.tertiary, width: 100, paddingVertical: 5, borderRadius: SIZES.small, alignItems: "center" }} onPress={fetchMortalityData}>
              <Text style={{ fontFamily: FONT.medium, color: COLORS.lightWhite }}>
                Filter
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
            {/* <Text style={styles.chartDate}>Jan - Apr 2023</Text> */}
          </View>
          {filteredData.length > 0 ? (
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
          ) : (
            <Text>No data available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Coop