import React, { useState, useCallback } from 'react'
import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity, Button  } from 'react-native';
import { COLORS, FONT, SIZES } from '../../../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import styles from './feeding.style';

import Tabs from './tabs/tabs';
import CoopFarmer from './coop/CoopFarmer';
import FeedingFarmer from './feeding/FeedingFarmer';
import DeathFarmer from './death/DeathFarmer';
import HarvestFarmer from './harvest/HarvestFarmer';
import SummaryFarmer from './summary/SummaryFarmer';

const tabList = ["Coop", "Feeding", "Death", "Harvest", "Batch Info"];

const Feeding = () => {

  const [activeTab, setActiveTab] = useState(tabList[0]);
  const currentDate = moment().format('MMM D, YYYY');

  const displayTabContent = () => {
    switch (activeTab) {
        case "Coop":
            return <CoopFarmer
                title='Coop'
            />
        case "Feeding":
            return <FeedingFarmer
                title='Feed'
            />
        case "Death":
          return <DeathFarmer
              title='Death'
          />
        case "Harvest":
          return <HarvestFarmer
              title='Harvest'
          />
        case "Batch Info":
          return <SummaryFarmer
              title='Batch Info'
          />
        default:
            break;
    }
  }

  return (
    <SafeAreaView style={{backgroundColor: COLORS.lightWhite, flex: 1}}>
      <View style={styles.chatsHeader}>
        <View style={styles.titleContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 40, height: 40}}
              source={require('../../../assets/fortopicon.png')}
            />
             <Text style={styles.headerTitle}>PoultryPro</Text>
          </View>
          
          <Text style={{ fontFamily: FONT.medium, paddingRight: 20 }}>{currentDate}</Text>
        </View>
        <Tabs 
          tabs={tabList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </View>
      {displayTabContent()}
    </SafeAreaView>
  )
}

export default Feeding