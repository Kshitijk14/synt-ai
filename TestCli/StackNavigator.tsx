// In StackNavigator.js in a new project

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./src/screens/HomeScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";



const Stack = createNativeStackNavigator();

function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions= {{headerShown: false}}>
        <Stack.Screen name="WelComeScreen" component={WelcomeScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
