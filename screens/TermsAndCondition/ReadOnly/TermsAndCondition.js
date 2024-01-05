import { useState, useEffect, createContext, useContext } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, Modal, ScrollView  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import styles from '../terms.style';
import { FONT } from '../../../constants/theme';

const TermsAndConditionReadOnly = () => {
    const navigation = useNavigation();
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
                    <Text style={styles.title}>Poultry Pro Mobile Application - Terms and Conditions</Text>
                </View>
            
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>1. Acceptance of Terms</Text>  By downloading, installing, or using the Poultry Pro mobile application ("the App"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree with these terms, please refrain from using the App.</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>2. User Accounts</Text></Text>
                    <Text style={{marginLeft: 15, marginTop: 10}}>
                        <Text style={{fontFamily: FONT.bold}}>a. Owners:</Text> The App allows poultry farm owner to visualize data related to their farm. Owners are responsible for maintaining the confidentiality of their account credentials and ensuring that all activities under their account comply with these terms.
                    </Text>
                    <Text style={{marginLeft: 15, marginTop: 10}}>
                        <Text style={{fontFamily: FONT.bold}}>b. Caretakers:</Text> Caretakers can input data related to the poultry farm they manage. Caretakers are accountable for the accuracy and reliability of the data they enter into the App.
                    </Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>3. Data Privacy and Security</Text> </Text>
                    <Text style={{marginLeft: 15, marginTop: 10}}>
                        <Text style={{fontFamily: FONT.bold}}>a.</Text> Owners and Caretakers both acknowledge that data entered into the App may be stored and processed. The App employs industry-standard security measures to protect this data. However, users should be cautious about sharing sensitive information.
                    </Text>
                    <Text style={{marginLeft: 15, marginTop: 10}}>
                        <Text style={{fontFamily: FONT.bold}}>b.</Text>  Poultry Pro retains the right to use anonymized and aggregated data for statistical and analytical purposes.
                    </Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>4. Responsibilities and Use of Data</Text> </Text>
                    <Text style={{marginLeft: 15, marginTop: 10}}>
                        <Text style={{fontFamily: FONT.bold}}>a. Owners:</Text>  The App provides data visualization tools for farm management. Owners are responsible for interpreting and utilizing the information provided by the App in their decision-making processes.
                    </Text>
                    <Text style={{marginLeft: 15, marginTop: 10}}>
                        <Text style={{fontFamily: FONT.bold}}>b. Caretakers:</Text>  Caretakers must ensure the accuracy of data entered, promptly update information, and adhere to best practices in data management.
                    </Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>5. Prohibited Activities</Text> Users must not engage in any activity that may harm the functionality or security of the App. This includes, but is not limited to, attempting to access restricted areas, introducing malicious code, or violating any applicable laws.</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>6. Updates and Modifications</Text> Poultry Pro reserves the right to update or modify these terms at any time. Users will be notified of significant changes. Continued use of the App after modifications constitutes acceptance of the revised terms.</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>7. Termination</Text> Poultry Pro may, at its discretion, terminate or suspend user accounts for violation of these terms or any unlawful activity.</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text><Text style={{fontFamily: FONT.bold}}>8. Governing Law</Text> These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Poultry Pro operates.</Text>
                </View>

                <View style={{ marginVertical: 20 }}>
                    <Text>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Poultry Pro operates.</Text>
                </View>
                <View style={{ marginVertical: 20 }}>
                    <Text style={{fontFamily: FONT.bold}}>Contact Information:</Text>
                    <Text>For any inquiries regarding these terms, please contact Poultry Pro at <Text style={{fontFamily: FONT.bold}}>Johnzen.jb@gmail.com</Text></Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleRejectTerms}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>   
        </ScrollView>
    </SafeAreaView>
  )
}

export default TermsAndConditionReadOnly