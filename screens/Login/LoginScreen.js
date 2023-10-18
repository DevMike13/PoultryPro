import { useState, useEffect, createContext, useContext } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, Modal  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import firebase from '../../firebase';
import styles from './login.style';
import { FONT } from '../../constants/theme';

const LoginScreen = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const errorToast = () => {
    //function to make Toast With Duration
    Toast.show({
      type: 'error',
      text1: 'Login Failed',
      text2: 'Please check your username and password.',
      visibilityTime: 3000,
    });
  };
  
  useEffect(() => {
    const checkUserType = async () => {
      try {
        // Check if user type exists in AsyncStorage
        const userType = await AsyncStorage.getItem('userType');
        const hasSeenGuide = await AsyncStorage.getItem('hasSeenGuide');
        
        if (userType === 'owner' && hasSeenGuide == 'true') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainScreen' }],
          });
        } else if (userType === 'farmer' && hasSeenGuide == 'true') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'FarmerScreen' }],
          }); 
        }
      } catch (error) {
        console.error('AsyncStorage Error:', error);
      }
    };

    checkUserType();
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);

      const userDoc = await firebase.firestore().collection('users').doc(userCredential.user.uid).get();
      const userType = userDoc.data().userType; // Retrieve user type from Firestore

      // Store user type in AsyncStorage
      const acceptedTerms = await AsyncStorage.getItem('acceptedTerms');
      await AsyncStorage.setItem('userType', userType);

      if (acceptedTerms === 'true') {
        // User has accepted the terms, navigate to the corresponding screen
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
        } else {
          // Handle other user types or scenarios
        }
      } else {
        // User hasn't accepted the terms, navigate to the terms and conditions screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'TermsAndConditionScreen' }],
        });
      }
    } catch (error) {
      // console.error('Login Error:', error);
      // Show a toast message for login failure
      errorToast();
    }
  };

  const handleResetPassword = async () => {
    navigation.navigate("ResetPasswordScreen");
  }

  const handleTermsAndCondition = async () => {
    navigation.navigate("TermsAndConditionReadOnly");
  }

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
  };
  
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 80, height: 80}}
              source={require('../../assets/adaptive-icon.png')}
            />
             <Text style={styles.appTitle}>PoultryPro</Text>
          </View>
          <Text style={styles.appSubTitle}>We are the best poultry in town</Text>
        </View>
        <View style={styles.contentContainer}>
            <View style={{ width: "90%"}}>
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
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.inInput}
                            placeholder='Password'
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "90%"}}>
              <Text style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT.regular}}>Forgot password? </Text>
              <TouchableOpacity style={{ justifyContent: "center", alignItems: "center"}} onPress={handleResetPassword}><Text style={{ justifyContent: "center", alignItems: "center", textDecorationLine: "underline", color: "#277df8", fontFamily: FONT.regular }}>Reset it here</Text></TouchableOpacity>
            </View>
            <View style={styles.divider}>
                <View style={styles.dividerLineLeft}>

                </View>
                <Text style={styles.dividerLineText}>Or sign in with</Text>
                <View style={styles.dividerLineRight}>

                </View>
            </View>
            <View style={{ width: "90%"}}>
                <View style={styles.regContainer}>
                    <View style={styles.regWrapper}>
                        <Text style={styles.regText}>I don't have an account?</Text>
                    </View>
                    <TouchableOpacity style={styles.regBtn} onPress={handleRegister}>
                        <Text style={styles.regBtnText}>Register Now!</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ width: "70%" }}>
              <Text style={{ textAlign: "center", alignItems: "center" }}>
                  By opening the app you agree to PoultryPro's{' '}
                  <Text style={{ textDecorationLine: 'underline', color: "#277df8", fontFamily: FONT.regular }} onPress={handleTermsAndCondition}>Terms of Use</Text>{' '}
                  and Privacy Policy
              </Text>
          </View>
        </View>
        <Toast position="top"/>
    </SafeAreaView>
  )
}

export default LoginScreen