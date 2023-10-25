import React, { useState, useCallback } from 'react'
import { Text, View, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity, Button  } from 'react-native';
import { COLORS, SIZES } from '../../../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './data.style';

import Tabs from './tabs/tabs';
import Coop from './coop/Coop';
import Temp from './temp/Temp';
import Death from './death/Death';
import Harvest from './harvest/Harvest';
import Summary from './summary/Summary';

const tabList = ["Coop", "Temp Chart", "Death Chart", "Harvest", "Summary"];

const Data = () => {

  const [activeTab, setActiveTab] = useState(tabList[0]);

  const displayTabContent = () => {
    switch (activeTab) {
        case "Coop":
            return <Coop
                title='Coop'
            />
        case "Temp Chart":
            return <Temp
                title='Temp'
            />
        case "Death Chart":
          return <Death
              title='Death'
          />
        case "Harvest":
          return <Harvest
              title='Harvest'
          />
        case "Summary":
          return <Summary
              title='Summary'
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

export default Data