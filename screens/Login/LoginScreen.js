import { useState, useEffect, createContext, useContext } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, Modal  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from '../../firebase';
import styles from './login.style';

const LoginScreen = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
      await AsyncStorage.setItem('userType', userType);
      
      // Navigate to the corresponding screen based on user type
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
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const handleRegister = () => {
    navigation.navigate('RegisterScreen');
  };
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.appTitle}>Poultry Pro</Text>
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
        </View>
    </SafeAreaView>
  )
}

export default LoginScreen