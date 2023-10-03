import React, { useEffect, useState} from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

import styles from './harvest.style';
import { FONT, SIZES, COLORS, SHADOWS } from '../../../../constants/theme';

import firebase from '../../../../firebase';
 
const Harvest = () => {

  const [isLoading, setIsLoading] = useState(true);

  const [batchList, setBatchList] = useState([]);
  const [batchNoList, setBatchNoList] = useState([]);
  const [batchInfo, setBatchInfo] = useState([]);

  const [selectedOption, setSelectedOption] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [goodChick, setGoodChick] = useState(0);
  const [rejectChick, setRejectChick] = useState(0);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const formatDateToString = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
    
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
      fetchBatchInfo(fetchedBatchNoList[0]);
      fetchHarvestData(fetchedBatchNoList[0])
      setIsLoading(false); 
    }); 
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
      setIsLoading(false);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchHarvestData = async (selectedBatchNo) => {
    try {
      // Fetch harvest data for the selected batch
      const harvestRef = firebase.firestore().collection('harvest');
      const harvestQuerySnapshot = await harvestRef.where('batch_no', '==', selectedBatchNo).get();
  
      let goodChicken = 0;
      let rejectChicken = 0;
  
      // Loop through the documents to calculate good_chicken and reject_chicken
      harvestQuerySnapshot.forEach((doc) => {
        const harvestData = doc.data();
        goodChicken += harvestData.good_chicken || 0;
        rejectChicken += harvestData.reject_chicken || 0;
      });
  
      // Set the state variables here
      setGoodChick(goodChicken);
      setRejectChick(rejectChicken);
  
      console.log('Good Chicken:', goodChicken);
      console.log('Reject Chicken:', rejectChicken);
    } catch (error) {
      console.error('Error fetching harvest data:', error);
    }
  };
  
  useEffect(() => {
    getBatchList()
  }, []);

  const handleOptionSelect = (no) => {
    setSelectedOption(no);
    fetchBatchInfo(no);
    fetchHarvestData(no); 
    setIsDropdownOpen(false);
  };

  const data = [
    { name: 'Good', population: goodChick, color: '#1ABC9C' },
    { name: 'Reject', population: rejectChick, color: '#E74C3C'  },
  ];

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
                  onPress={() => {handleOptionSelect(no);}}
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
              { batchNoList.length > 0 ? (
                
                <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small }}>{formatDateToString(batchInfo.cycle_started)}</Text>
                
              ) : (
                <ActivityIndicator size="large" color="blue" />
              )}
              
            </View>
            <View style={styles.tempHumidityContent}>
              <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small, color: "red" }}>End</Text>
              { batchNoList.length > 0 ? (
                <Text style={{ fontFamily: FONT.regular, fontSize: SIZES.small }}>{formatDateToString(batchInfo.cycle_expected_end_date)}</Text>
              ) : (
                <ActivityIndicator size="large" color="blue" />
              )}
            </View>
          </View>
          <View style={styles.statusContainer}>
            <Text style={{ fontFamily: FONT.medium }}>Status: </Text>
            { batchNoList.length > 0 ? (
              <Text style={{ fontFamily: FONT.regular, color: new Date() > batchInfo.cycle_expected_end_date ? "red" : "green", }}>{new Date() > batchInfo.cycle_expected_end_date ? "Ended" : "Ongoing"}</Text>
            ) : (
              <ActivityIndicator size="large" color="blue" />
            )}
          </View>
        </View>
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.headerTitle}>Good & Reject Chicken</Text>
        <PieChart
          data={data}
          width={400}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          // absolute // Optional, use absolute values for the data
        />
      </View>
    </SafeAreaView>
  )
}

export default Harvest