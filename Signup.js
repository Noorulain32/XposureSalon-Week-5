import React, { useState, useEffect } from 'react';
import { firebase } from '../Config';
import { ScrollView, Text, StyleSheet, TextInput, Pressable, Image, View, TouchableOpacity } from 'react-native';

const Signup = ({ navigation }) => {
  const [user, setuser] = useState([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

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

  const handleSignup = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const userId = userCredential.user.uid;
        const userRef = firebase.firestore().collection('user');
        userRef
          .doc(userId)
          .set({
            fullName: fullName,
            email: email,
            password: password,
            gender: gender,
            contact: contact,
            address: address,
          })
          .then(() => {
            setFullName('');
            setEmail('');
            setPassword('');
            setGender('');
            setContact('');
            setAddress('');
            console.log('Signed up successfully!');
            navigation.navigate('Login'); // Navigate to the login screen
          })
          .catch((error) => {
            console.log('Error signing up: ', error);
          });
      })
      .catch((error) => {
        setError('Email is already in use. Please use a different email.');
        console.log('Error creating user: ', error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../src/XposureLogo.png')} style={styles.image} />
        <Text style={styles.logoText}>Create account</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.inputBox}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
      />
      <TextInput
        style={styles.inputBox}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.inputBox}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TextInput
        style={styles.inputBox}
        value={gender}
        onChangeText={setGender}
        placeholder="Gender"
      />
      <TextInput
        style={styles.inputBox}
        value={contact}
        onChangeText={setContact}
        placeholder="Contact"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.inputBox}
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
      />
      <Pressable onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
      <TouchableOpacity>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.regularText}>Already have an account? Log in</Text>
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
  headerContainer: {
    padding: 10,
    backgroundColor: '#FF69B4',
  },
  header: {
    padding: 20,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 250,
    height: 150,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF69B4',
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
    marginVertical: 8,
    marginHorizontal: 100,
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
  regularText: {
    fontSize: 15,
    padding: 30,
    marginVertical: 8,
    color: 'black',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Signup;
