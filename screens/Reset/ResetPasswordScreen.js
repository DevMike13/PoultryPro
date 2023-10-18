import { useState, useEffect, createContext, useContext } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, Modal  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import firebase from '../../firebase';
import styles from './reset.style';
import { FONT } from '../../constants/theme';

const ResetPasswordScreen = () => {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        try {
          await firebase.auth().sendPasswordResetEmail(email);
          // Display a success message
          Toast.show({
            type: 'success',
            text1: 'Password Reset Email Sent',
            text2: 'Please check your email to reset your password.',
            visibilityTime: 3000,
          });
          // Navigate back to the login screen or any other desired screen
          navigation.goBack();
        } catch (error) {
          // Display an error message
          Toast.show({
            type: 'error',
            text1: 'Password Reset Failed',
            text2: 'An error occurred while sending the reset email.',
            visibilityTime: 3000,
          });
        }
    };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.containerTitle}>Forgot your password?</Text>
            <Text style={styles.subTitle}>Please, enter your email address below to receive your user and a new password.</Text>
        </View>
        <View style={styles.emailContainer}>
            <Text style={{ marginLeft: 10, fontFamily: FONT.regular, marginBottom: 5 }}>Email Address</Text>
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inInput}
                        placeholder='Email'
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        textContentType='emailAddress'
                    />
                </View>
            </View>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
                <Text style={[styles.buttonText, {color: "white"}]}>Reset password</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default ResetPasswordScreen