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

const Appointment = ({ navigation, route }) => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState(route.params?.services || '');
  // const [appointments, setAppointments] = useState([]);
  // const [services, setServices] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAppointments, setUserAppointments] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('appointment')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(data);
      });

    return () => unsubscribe();
  }, []);

  const handleAppointment = () => {
    if (!services || !date || !time || !userEmail) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    const existingAppointment = appointments.find(
      (appointment) => appointment.date === date && appointment.time === time
    );

    if (existingAppointment) {
      Alert.alert(
        'Booking Conflict',
        'The selected date and time are already booked. Please choose a different time.'
      );
      return;
    }

    firebase
      .firestore()
      .collection('appointment')
      .add({
        services: services,
        date: date,
        time: time,
        serviceType: serviceType,
        location: location,
        userEmail: userEmail,
      })
      .then(() => {
        setServices('');
        setDate('');
        setTime('');
        setServiceType('');
        setLocation('');
        setUserEmail('');
        Alert.alert(
          'Booking Confirmed',
          'Your appointment has been booked successfully!'
        );
      })
      .catch((error) => {
        console.log('Error in Booking: ', error);
        Alert.alert('Error', 'An error occurred while booking the appointment. Please try again.');
      });
  };

  const handleHistory = () => {
    if (!userEmail) {
      Alert.alert('Enter Email', 'Please enter your email to view appointment history.');
      return;
    }

    const userAppointments = appointments.filter(
      (appointment) => appointment.userEmail === userEmail
    );
    setUserAppointments(userAppointments);
    setShowHistory(true);
  };

  const handleBack = () => {
    setShowHistory(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={require('../src/XposureLogo.png')} style={styles.image} />
      {!showHistory && (
        <>
          <Text style={styles.headerText}>Add Appointment</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Service Name:</Text>
            <TextInput
              style={styles.input}
              value={services}
              onChangeText={setServices}
              placeholder="Enter service name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date:</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="Enter date"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Time:</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="Enter time"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Service Type:</Text>
            <View style={styles.serviceTypeButtons}>
              <Pressable
                onPress={() => setServiceType('home')}
                style={[
                  styles.serviceTypeButton,
                  serviceType === 'home' && styles.serviceTypeButtonSelected,
                ]}
              >
                <Text style={styles.serviceTypeButtonText}>Home</Text>
              </Pressable>
              <Pressable
                onPress={() => setServiceType('parlor')}
                style={[
                  styles.serviceTypeButton,
                  serviceType === 'parlor' && styles.serviceTypeButtonSelected,
                ]}
              >
                <Text style={styles.serviceTypeButtonText}>Parlor</Text>
              </Pressable>
            </View>
          </View>
          {serviceType === 'home' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location:</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter location"
              />
            </View>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>User Email:</Text>
            <TextInput
              style={styles.input}
              value={userEmail}
              onChangeText={setUserEmail}
              placeholder="Enter user email"
            />
          </View>
          <Pressable onPress={handleAppointment} style={styles.button}>
            <Text style={styles.buttonText}>Book Now</Text>
          </Pressable>
          <Pressable onPress={handleHistory} style={styles.historyButton}>
            <Text style={styles.historyButtonText}>View Appointment History</Text>
          </Pressable>
        </>
      )}
      {showHistory && (
        <>
          <Text style={styles.headerText}>Appointment History</Text>
          {userAppointments.length > 0 ? (
            <>
              <View style={styles.historyContainer}>
                {userAppointments.map((appointment) => (
                  <View key={appointment.id} style={styles.appointmentItem}>
                    <Text style={styles.appointmentText}>
                      Service: {appointment.services}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Date: {appointment.date}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Time: {appointment.time}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Service Type: {appointment.serviceType}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Location: {appointment.location}
                    </Text>
                  </View>
                ))}
              </View>
              <Pressable onPress={handleBack} style={styles.button}>
                <Text style={styles.buttonText}>Go Back</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.noHistoryText}>
                No appointment history found for the entered email.
              </Text>
              <Pressable onPress={handleBack} style={styles.button}>
                <Text style={styles.buttonText}>Go Back</Text>
              </Pressable>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
   
  },
  headerText: {
    fontSize: 30,
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#EDEFEE',
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    padding: 12,
    backgroundColor: '#FF69B4',
    borderRadius: 100,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  historyButton: {
    padding: 12,
    backgroundColor: '#EDEFEE',
    borderRadius: 100,
  },
  historyButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
  },
  image: {
    paddingTop: 0,
    paddingBottom:0,
    width: 350,
    height: 200,
    alignSelf: 'center',
    marginVertical: 20,
  },
  serviceTypeButtons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  serviceTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EDEFEE',
    marginRight: 10,
  },
  serviceTypeButtonText: {
    fontSize: 14,
    color: 'black',
  },
  serviceTypeButtonSelected: {
    backgroundColor: '#FF69B4',
  },
  historyContainer: {
    marginBottom: 20,
  },
  appointmentItem: {
    borderWidth: 1,
    borderColor: '#EDEFEE',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 16,
  },
  noHistoryText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Appointment;
