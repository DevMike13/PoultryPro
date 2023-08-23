import { useState } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';

import firebase from '../../firebase';

import styles from './register.style';

const RegisterScreen = () => {

  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState('owner');

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRadioChange = (value) => {
    setSelectedValue(value);
  };

  const handleRegistration = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
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
        userType: selectedValue
      });

      
      // Navigate based on user type
        if (selectedValue === 'owner') {
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainScreen' }],
            });
        } else if (selectedValue === 'farmer') {
            navigation.reset({
                index: 0,
                routes: [{ name: 'FarmerScreen' }],
            });
        }

    } catch (error) {
      console.error('Registration Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.appTitle}>Poultry Pro</Text>
            <Text style={styles.appSubTitle}>We are the best poultry in town</Text>
        </View>
        <View style={{ width: "90%", marginVertical: 20 }}>
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

            <RadioButton.Group onValueChange={handleRadioChange} value={selectedValue}>
                <View style={styles.radioContainer}>
                    <RadioButton.Item label="Owner" value="owner" />
                    <RadioButton.Item label="Farmer" value="farmer" />
                </View> 
            </RadioButton.Group>

            {/* CONFIRM BTN */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleRegistration}>
                <Text style={styles.loginBtnText}>Create account</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default RegisterScreen