import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import firebase from '../../../../firebase';

import styles from './temp.style';
import { FONT, SIZES, COLORS } from '../../../../constants/theme';
const Temp = () => {

  const [chartData, setChartData] = useState([]);
  const [formattedDates, setFormattedDates] = useState([]);
  const [maxTemperatures, setMaxTemperatures] = useState([]);

  const [humData, setHumData] = useState([]);
  const [maxHumidity, setMaxHumidity] = useState([]);

  const [batchNo, setBatchNo] = useState('');

  const fetchBatchCounter = async () => {
    const db = firebase.firestore();
  
    try {
      const counterDocRef = db.collection('meta').doc('counters');
      const counterDoc = await counterDocRef.get();
  
      if (counterDoc.exists) {
        const batchCounterValue = counterDoc.data().batchCounter - 1;
        setBatchNo(batchCounterValue);
        // console.log(batchCounterValue);
      } else {
        console.log('Counters document does not exist.');
      }
    } catch (error) {
      console.error('Error fetching batch counter:', error);
    }
  };

  useEffect(() => {
    // Fetch the batch counter value and update batchNo state
    fetchBatchCounter();
  }, []);

  useEffect(() => {
    // Fetch data from Firestore and organize it
    const fetchData = async () => {
      
      const db = firebase.firestore();
      const collection = db.collection('temp&humid');

      try {
        const querySnapshot = await collection.where('batch_no', '==', batchNo).get();
        const dataMap = new Map();

        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          const timestamp = docData.timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date
          const date = timestamp.toISOString().split('T')[0]; // Extract the date part

          // Check if temperature data is available and not NaN
          if (!isNaN(docData.temperature)) {
            // If the date exists in the map, update the highest temperature
            if (dataMap.has(date)) {
              const currentMaxTemp = dataMap.get(date);
              const newMaxTemp = Math.max(currentMaxTemp, docData.temperature);
              dataMap.set(date, newMaxTemp);
            } else {
              // If the date doesn't exist, create a new entry
              dataMap.set(date, docData.temperature);
            }
          }
        });

        // Convert the map back to an array
        const dataArray = [...dataMap.entries()].map(([date, maxTemperature]) => ({
          date,
          maxTemperature,
        }));

        // Sort the data by date
        dataArray.sort((a, b) => a.date.localeCompare(b.date));

        // Format the dates as "MMM d" (e.g., "Aug 10")
        const formattedDateArray = dataArray.map((item) => {
          const [year, month, day] = item.date.split('-');
          const dateObj = new Date(year, month - 1, day);
          return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        });
        const maxTempArray = dataArray.map((item) => item.maxTemperature);

        // Set the organized data and separate arrays in state
        setChartData(dataArray);
        setFormattedDates(formattedDateArray);
        setMaxTemperatures(maxTempArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [batchNo]);

  useEffect(() => {
    // Fetch data from Firestore and organize it
    const fetchHum = async () => {
      const db = firebase.firestore();
      const collection = db.collection('temp&humid');

      try {
        const querySnapshot = await collection.where('batch_no', '==', batchNo).get();
        const dataMap = new Map();

        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          const timestamp = docData.timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date
          const date = timestamp.toISOString().split('T')[0]; // Extract the date part

          // Check if temperature data is available and not NaN
          if (!isNaN(docData.humidity)) {
            if (dataMap.has(date)) {
              const currentMaxHum = dataMap.get(date);
              const newMaxHum = Math.max(currentMaxHum, docData.humidity);
              dataMap.set(date, newMaxHum);
            } else {
              dataMap.set(date, docData.humidity);
            }
          }
        });

        // Convert the map back to an array
        const dataArray = [...dataMap.entries()].map(([date, maxHumidity]) => ({
          date,
          maxHumidity,
        }));

        // Sort the data by date
        dataArray.sort((a, b) => a.date.localeCompare(b.date));

        // Format the dates as "MMM d" (e.g., "Aug 10")
        const formattedDateArray = dataArray.map((item) => {
          const [year, month, day] = item.date.split('-');
          const dateObj = new Date(year, month - 1, day);
          return dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        });
        const maxHumArray = dataArray.map((item) => item.maxHumidity);

        // Set the organized data and separate arrays in state
        setHumData(dataArray);
        setFormattedDates(formattedDateArray);
        setMaxHumidity(maxHumArray);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchHum();
  }, [batchNo]);
   
  const degreeSymbol = '\u00B0C';
  const tempData = {
    // labels: ['Day 1', 'Day 2', 'Day 3', ' Day 4'],
    labels: formattedDates,
    datasets: [
      {
        // data: [32, 35, 31, 32],
        data: maxTemperatures
      },
    ],
  };

  const humidData = {
    // labels: ['Day 1', 'Day 2', 'Day 3', ' Day 4'],
    labels: formattedDates,
    datasets: [
      {
        // data: [32, 35, 31, 32],
        data: maxHumidity
      },
    ],
  };

  return (
    <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <View style={{ marginBottom: 20, justifyContent: "center", alignItems: "center"}}>
          <Text style={{ fontFamily: FONT.bold, fontSize: SIZES.large }}>Temperature & Humidity</Text>
          <Text style={styles.batchText}>Batch {batchNo}</Text>
        </View>
        
        <View style={styles.chartContainer}>
          <Text style={styles.headerTitle}>Temperature</Text>
          { batchNo != null && maxTemperatures.length > 0 ? (
            <LineChart
              bezier
              data={tempData}
              width={390}
              height={220}
              yAxisLabel=""
              yAxisSuffix={degreeSymbol}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(230, 0, 0, ${opacity})`,
              }}
              style={styles.chart}
            />
          ) : (
            <ActivityIndicator size="large" color="blue" />
          )
          }
          
        </View>
        <View style={styles.chartContainer}>
          <Text style={styles.headerTitle}>Humidity</Text>
          { batchNo != null && maxHumidity.length > 0 ? (
            <LineChart
              bezier
              data={humidData}
              width={390}
              height={220}
              yAxisLabel=""
              yAxisSuffix="%"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 230, ${opacity})`,
              }}
              style={styles.chart}
            />
          ) : (
            <ActivityIndicator size="large" color="blue" />
          )
          }
          
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

export default Temp