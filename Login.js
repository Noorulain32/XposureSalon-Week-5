import React, { useState, useEffect } from 'react';
import { firebase } from '../Config';
import { ScrollView, Text, StyleSheet, TextInput, Pressable, Alert, Image, TouchableOpacity } from 'react-native';

const Login = ({ navigation, onLogin }) => {
  const [user, setuser] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const userRef = firebase.firestore().collection('user');
    const unsubscribe = userRef.onSnapshot((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setuser(data);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setEmail('');
        setPassword('');
        console.log('Logged in successfully!');
        navigation.navigate('JoinScreens');
      })
      .catch((error) => {
        console.log('Error logging in: ', error);
        Alert.alert('Invalid Credentials', 'Please enter a valid email and password.');
      });
      
      //onLogin();
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={require('../src/XposureLogo.png')} style={styles.image} />
      <Text style={styles.LoginText}>Login to continue</Text>
      <TextInput
        style={styles.inputBox}
        value={email}
        onChangeText={setEmail}
        placeholder="email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.inputBox}
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
      />
      <Pressable onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Log in</Text>
      </Pressable>
      <TouchableOpacity>
        <Pressable onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.regularText}>Don't have an account? SignUp</Text>
        </Pressable>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerText: {
    paddingTop: 200,
    paddingBottom: 0,
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
  regularText: {
    fontSize: 15,
    padding: 30,
    marginVertical: 8,
    color: 'black',
    textAlign: 'center',
  },
  inputBox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: '#EDEFEE',
    backgroundColor: 'white',
  },
  button: {
    fontSize: 22,
    padding: 10,
    marginVertical: 10,
    margin: 100,
    backgroundColor: '#FF69B4',
    borderColor: 'black',
    borderWidth: 0,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
  },
  image: {
    paddingBottom: 0,
    paddingTop: 100,
    width: 350,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
  LoginText: {
    padding: 20,
    fontSize: 30,
    color: '#FF69B4',
    textAlign: 'center',
  },
});

export default Login;
