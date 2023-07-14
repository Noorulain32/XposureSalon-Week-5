import React, { useState, useEffect } from 'react';
import { View, Text, Button, Pressable, Alert, StyleSheet, SectionList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../Config';
import Login from './Login';

const Profile = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({
    fullName: profile?.fullName || '',
    email: profile?.email || '',
    password: profile?.password || '',
    gender: profile?.gender || '',
    contact: profile?.contact || '',
    address: profile?.address || '',
  });

  useEffect(() => {
    // Get the currently logged-in user
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      // Fetch the user's profile information from Firestore
      const userRef = firebase.firestore().collection('user').doc(currentUser.uid);
      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            // Set the profile state with the user's information
            setProfile(doc.data());
            setUpdatedProfile(doc.data());
          } else {
            console.log('No profile found');
          }
        })
        .catch((error) => {
          console.log('Error fetching profile:', error);
        });
    }
  }, []);

  const updateProfile = () => {
    // Get the currently logged-in user
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      // Update the user's profile information in Firestore
      const userRef = firebase.firestore().collection('user').doc(currentUser.uid);
      userRef
        .update(updatedProfile)
        .then(() => {
          // Update the profile state with the updated information
          setProfile(updatedProfile);
          Alert.alert('Profile Updated!');
        })
        .catch((error) => {
          console.log('Error updating profile:', error);
        });
    }
  };

  const handleLogout = () => {
    // Perform logout logic here
    // Example: Clear user session, update login status, etc.

    // Show an alert to notify the user
    Alert.alert('Logged Out!');

    //onlogout();
    // Navigate back to the login screen
    navigation.navigate('Login');
  };

  const sections = [
    {
      title: 'Personal Information',
      data: [
        { label: 'Name', value: 'fullName' },
        { label: 'Email', value: 'email' },
        { label: 'Password', value: 'password' },
      ],
    },
    {
      title: 'Additional Information',
      data: [
        { label: 'Gender', value: 'gender' },
        { label: 'Contact', value: 'contact' },
        { label: 'Address', value: 'address' },
      ],
    },
  ];

  const renderSectionHeader = ({ section }) => {
    return <Text style={styles.sectionHeader}>{section.title}</Text>;
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.label}>{item.label}</Text>
        <TextInput
          style={styles.input}
          value={updatedProfile[item.value]}
          onChangeText={(text) =>
            setUpdatedProfile((prevState) => ({
              ...prevState,
              [item.value]: text,
            }))
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile Information</Text>
      {profile ? (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
        />
      ) : (
        <Text>Loading profile...</Text>
      )}
      <Pressable onPress={updateProfile} style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
      <Pressable onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    fontSize: 25,
    color: '#FF69B4',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    backgroundColor: '#FF69B4',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    height: 40,
    marginBottom: 8,
    marginTop: 18,
  },
  itemContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
  },
  button: {
    fontSize: 22,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#FF69B4',
    borderColor: 'black',
    borderWidth: 0,
    borderRadius: 100,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
  },
});

export default Profile;
