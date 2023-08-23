import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, Text, View, ScrollView, Switch } from 'react-native';
import { COLORS, FONT, SIZES } from '../../../../constants/theme';

import styles from './feeding.style';

const FeedingFarmer = () => {

  const [waterToggle, setWaterToggle] = useState(false);
  const [feedToggle, setFeedToggle] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Watering</Text>
        <Switch
          value={waterToggle}
          onValueChange={value => setWaterToggle(value)}
          trackColor={{ false: COLORS.gray4, true: COLORS.tertiary}}
          thumbColor={waterToggle ? COLORS.primary : COLORS.white}
          style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }], marginTop: 20 }}
        />
      </View>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Feeding</Text>
        <Switch
          value={feedToggle}
          onValueChange={value => setFeedToggle(value)}
          trackColor={{ false: COLORS.gray4, true: COLORS.tertiary}}
          thumbColor={feedToggle ? COLORS.primary : COLORS.white}
          style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }], marginTop: 20 }}
        />
      </View>
    </SafeAreaView>
  )
}

export default FeedingFarmer