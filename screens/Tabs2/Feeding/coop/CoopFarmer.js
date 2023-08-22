import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONT, SIZES } from '../../../../constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';

import styles from './coop.style';

const CoopFarmer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event, selected) => {
    if (selected) {
      setSelectedDate(selected);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  const handleTimeChange = (event, selected) => {
    if (selected) {
      setSelectedTime(selected);
    }
    setShowTimePicker(Platform.OS === 'ios');
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const formatDate = date => {
    return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
  };

  const formatTime = time => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const amPM = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${amPM}`;
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={{ marginTop: 30 }}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Set timer for date:</Text>
            <TouchableOpacity onPress={toggleDatePicker} style={{ backgroundColor: COLORS.gray2, paddingHorizontal: 20, paddingVertical: 5, flexDirection: "row", gap: 10, borderRadius: SIZES.small }}>
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

          {/* TIME */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Set timer for time:</Text>
            <TouchableOpacity
              onPress={toggleTimePicker}
              style={{
                backgroundColor: COLORS.gray2,
                paddingHorizontal: 20,
                paddingVertical: 5,
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: SIZES.small,
                gap: 10
              }}
            >
              <Text style={styles.dateText}>{formatTime(selectedTime)}</Text>
              <Ionicons name="time-outline" size={20} />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
        </View>

        {/* Confirm Button */}
        <View style={styles.confirmBtnContainer}>
          <TouchableOpacity style={styles.confirmBtn}>
            <Text style={styles.confirmBtnText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CoopFarmer