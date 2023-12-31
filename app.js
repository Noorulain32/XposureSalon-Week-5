
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import Login from './Screens/Login';
import WelcomePage from './Screens/WelcomePage';
import Signup from './Screens/Signup';
import Home from './Screens/Home';
import ServicesPage from './Screens/ServicesPage';
import Feedback from './Screens/Feedback';
import Profile from './Screens/Profile';
import Appointment from './Screens/Appointment';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    background: 'white',
  },
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Services') {
            iconName = 'cogs';
          } else if (route.name === 'Feedback') {
            iconName = 'comment-o';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Appointment') {
            iconName = 'calendar';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Services" component={ServicesPage} />
      <Tab.Screen name="Feedback" component={Feedback} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Appointment" component={Appointment} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const handleLogin = () => {
    setUserLoggedIn(true);
  };

  const handleLogout = () => {
    setUserLoggedIn(false);
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="WelcomePage">
          <>
            <Stack.Screen
              name="WelcomePage"
              component={WelcomePage}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => <Login {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="JoinScreens" component={BottomTabNavigator} options={{ headerShown: false }} />
          </>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
