import { useState, useEffect, createContext, useContext } from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from './login.style';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    // Perform your login logic here
    // ...

    // Navigate to the HomeScreen
    navigation.navigate('FarmerScreen'); // Replace 'HomeScreen' with the actual screen name
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
                            // value={email}
                            // onChangeText={setEmail}
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
                            // value={password}
                            // onChangeText={setPassword}
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
                    <TouchableOpacity style={styles.regBtn}>
                        <Text style={styles.regBtnText}>Register Now!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default LoginScreen