import { useState } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import firebase from '../../firebase';

import styles from './register.style';
import { COLORS, FONT } from '../../constants/theme';

const RegisterScreen = () => {

  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState('farmer');

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [verificationCode, setVerificationCode] = useState(''); // State to store the verification code

  const [isRequested, setIsRequested] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };

  const errorToast = () => {
    //function to make Toast With Duration
    Toast.show({
      type: 'error',
      text1: 'Registration Failed',
      text2: 'Passwords do not match or the verification code is incorrect',
      visibilityTime: 3000,
    });
  };

  const handleRegistration = async () => {
    try {

        setIsVerifying(true);
        const verificationRef = firebase.database().ref('VerificationCode');

        // Get the current verification code from the database
        const snapshot = await verificationRef.once('value');
        const veriCode = snapshot.val();

      if (password !== confirmPassword || verificationCode !== veriCode) {
        throw new Error("Passwords do not match or the verification code is incorrect");
      }

      // Register user with email and password
      await firebase.auth().createUserWithEmailAndPassword(email, password);

      // Get the authenticated user's UID
      const userUID = firebase.auth().currentUser.uid;

      // Store user data in Firestore
      const userRef = firebase.firestore().collection('users').doc(userUID);
      await userRef.set({
        firstname,
        lastname,
        email,
        userType: 'farmer'
      });

      setIsVerifying(false);

      // Navigate based on user type
        if (selectedValue === 'farmer') {
            navigation.reset({
                index: 0,
                routes: [{ name: 'FarmerScreen' }],
            });
        }

    } catch (error) {
    //   console.error('Registration Error:', error);
        setIsVerifying(false);
        errorToast();
    }
  };

  const generateVerificationCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6; // You can adjust the length as needed

    let code = '';
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  };

  const handleSendVerification = () => {
    
    try {
        // if (password !== confirmPassword) {
        //     throw new Error("Passwords do not match");
        // }
        const code = generateVerificationCode();
        // Update the selected value in Firebase Realtime Database
        firebase.database().ref('VerificationCode').set(code);
        setIsRequested(true);
    } catch (error) {
    //   console.error('Registration Error:', error);
        errorToast();
    }
  }; 
 
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                style={{ width: 70, height: 70}}
                source={require('../../assets/fortopicon.png')}
                />
                <Text style={styles.appTitle}>PoultryPro</Text>
            </View>
            <Text style={styles.appSubTitle}>We are the best poultry in town</Text>
        </View>
        <View style={{ width: "90%", marginVertical: 20, paddingLeft: 10, justifyContent: "center", alignItems: "center" }}>
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inInput}
                        placeholder='Firstname'
                        value={firstname}
                        onChangeText={(value) => setFirstname(value)}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inInput}
                        placeholder='Lastname'
                        value={lastname}
                        onChangeText={(value) => setLastname(value)}
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inInput}
                        placeholder='Email'
                        value={email}
                        onChangeText={(value) => setEmail(value)}
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
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry={true}
                    />
                </View>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inInput}
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChangeText={(value) => setConfirmPassword(value)}
                        secureTextEntry={true}
                    />
                </View>
            </View>
            <View style={{ marginTop: 30 }}>
                <Text style={{ marginLeft: 10, marginVertical: 10, fontFamily: FONT.bold}}>Verification Code: </Text>
                <View style={styles.inputContainer2}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.inInput}
                            placeholder='Verification Code'
                            value={verificationCode}
                            onChangeText={(value) => setVerificationCode(value)}
                        />
                    </View>
                </View>
            </View>
            
            {/* CONFIRM BTN */}
            {isRequested === false ? (
                <TouchableOpacity style={styles.loginBtn} onPress={handleSendVerification}>
                    <Text style={styles.loginBtnText}>Request Verification</Text>
                </TouchableOpacity>
            ) : isVerifying ? (
                <TouchableOpacity style={styles.loginBtn}>
                    <ActivityIndicator size="small" color={COLORS.lightWhite} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.loginBtn} onPress={handleRegistration}>
                    <Text style={styles.loginBtnText}>Verify Account</Text>
                </TouchableOpacity>
            )}

            {isRequested == false ? (
               <></>
            ) : (
               
                <Text style={{ fontFamily: FONT.regular, textAlign: "center", color: COLORS.gray}}>Your verification code has been sent to your admin/owner.</Text>
            )}
            
        </View>
        <Toast position="top"/>
    </SafeAreaView>
  )
}

export default RegisterScreen