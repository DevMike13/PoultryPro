import { useState, useEffect, createContext, useContext } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, Modal, ScrollView  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import firebase from '../../firebase';
import styles from './terms.style';
import { FONT } from '../../constants/theme';

const TermsAndConditionScreen = () => {
    const navigation = useNavigation();
   
    const handleAcceptTerms = async () => {
        // Store the user's decision to accept the terms in AsyncStorage.
        try {
            await AsyncStorage.setItem('acceptedTerms', 'true');
            const userType = await AsyncStorage.getItem('userType');
            
            if (userType === 'owner') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'OwnerGuide' }],
              });
            } else if (userType === 'farmer') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'FarmerGuide' }],
              });
            }
          } catch (error) {
            console.error('AsyncStorage Error:', error);
          }
    };

    const handleRejectTerms = async () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.contentConatiner}>
                <View style={{ justifyContent: "center", alignItems: "center", marginVertical: 20}}>
                    <Text style={styles.title}>Terms and Conditions</Text>
                </View>
            
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>1. Acceptance of Terms:</Text>  By using the Poultrypro mobile application, you agree to comply with the following terms and conditions.</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>2. Usage:</Text>  Poultrypro is designed to provide information and resources related to poultry farming in Sariaya, Quezon. Users are advised to use the app for lawful and legitimate purposes only.</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>3. Information Accuracy:</Text> While we strive to provide accurate and updated information, we do not guarantee the accuracy, completeness, or reliability of any content within the application. Users should verify any critical information from other reliable sources before making business decisions.</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>4. Privacy:</Text> We respect user privacy and handle personal data in accordance with our Privacy Policy. By using the app, you agree to the collection, use, and sharing of your information as outlined in the Privacy Policy.</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>5. Intellectual Property:</Text> All content within the Poultrypro app, including but not limited to text, graphics, logos, and software, is the property of the app owners and protected by copyright and other intellectual property laws.</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>6. Prohibited Conduct:</Text> Users must not engage in any conduct that violates applicable laws, infringes on the rights of others, or disrupts the functionality of the app. This includes the use of any automated system or software to extract data from the application without explicit consent.</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>7. Governing Law:</Text> These terms and conditions shall be governed by and construed in accordance with the laws of the Philippines.</Text>
                </View>

                <View style={{ marginVertical: 20 }}>
                    <Text>By using the Poultrypro mobile application, you acknowledge that you have read, understood, and agreed to these terms and conditions.</Text>
                </View>
            </View>
           
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleRejectTerms}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={handleAcceptTerms}>
                    <Text style={[styles.buttonText, {color: "white"}]}>Accept</Text>
                </TouchableOpacity>
            </View>   
        </ScrollView>
    </SafeAreaView>
  )
}

export default TermsAndConditionScreen