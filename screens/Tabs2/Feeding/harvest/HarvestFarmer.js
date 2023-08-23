import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { FONT, SIZES, COLORS } from '../../../../constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';

import styles from './harvest.style';

const HarvestFarmer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selected) => {
    if (selected) {
      setSelectedDate(selected);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const formatDate = date => {
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeader}>Number of good chicken</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inInput}
                placeholder='Input number'
                textAlign={'center'}
                keyboardType={'numeric'}
                // value={email}
                // onChangeText={setEmail}
              />
          </View>
        </View>
        <TouchableOpacity style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentHeader}>Number of reject chicken</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inInput}
                placeholder='Input number'
                keyboardType={'numeric'}
                textAlign={'center'}
                // value={email}
                // onChangeText={setEmail}
              />
          </View>
        </View>
        <TouchableOpacity style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>Date: </Text>
        <TouchableOpacity onPress={toggleDatePicker} style={{ backgroundColor: COLORS.gray2, paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", gap: 15, borderRadius: SIZES.small }}>
          <Text style={styles.dateText}>
            {formatDate(selectedDate)}
          </Text>
          <Ionicons
            name="calendar-outline"
            size={20}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default HarvestFarmer