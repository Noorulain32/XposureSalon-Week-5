import React, { useState, useEffect } from 'react';
import { firebase } from '../Config';
import {
  Alert,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
} from 'react-native';

const Feedback = ({ navigation }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const feedbacksRef = firebase.firestore().collection('feedback');
    const unsubscribe = feedbacksRef.onSnapshot((querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbacks(data);
    });

    return () => unsubscribe();
  }, []);

  const handleFeedback = () => {
    const feedbacksRef = firebase.firestore().collection('feedback');
    feedbacksRef
      .add({
        name: name,
        email: email,
        message: message,
      })
      .then(() => {
        setName('');
        setEmail('');
        setMessage('');
        Alert.alert('Your feedback has been submitted successfully!');
        console.log('Feedback sent');
      })
      .catch((error) => {
        console.log('Error in sending feedback: ', error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={require('../src/XposureLogo.png')} style={styles.image} />
      <Text style={styles.headerText}>Send Feedback to us!</Text>
      <TextInput
        style={styles.inputBox}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        style={styles.inputBox}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        style={styles.inputtextBox}
        value={message}
        onChangeText={setMessage}
        placeholder="Message"
        multiline
      />
      <Pressable onPress={handleFeedback} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>

      <View style={styles.feedbackList}>
        <Text style={styles.feedbackListTitle}>Existing Feedbacks:</Text>
        {feedbacks.map((feedback) => (
          <View key={feedback.id} style={styles.feedbackItem}>
            <Text style={styles.feedbackName}>{feedback.name}</Text>
            <Text style={styles.feedbackEmail}>{feedback.email}</Text>
            <Text style={styles.feedbackMessage}>{feedback.message}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerText: {
    paddingTop: 10,
    paddingBottom: 20,
    fontSize: 30,
    color: '#FF69B4',
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
  inputtextBox: {
    height: 150,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: '#EDEFEE',
    backgroundColor: 'white',
    textAlignVertical: 'top',
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
  image: {
    width: 350,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
  feedbackList: {
    margin: 20,
  },
  feedbackListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackItem: {
    borderWidth: 1,
    borderColor: '#EDEFEE',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  feedbackName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  feedbackEmail: {
    fontSize: 14,
    marginBottom: 5,
  },
  feedbackMessage: {
    fontSize: 16,
  },
});

export default Feedback;
