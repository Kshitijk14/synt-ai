import React, { useEffect, } from 'react';
import {StyleSheet, View, SafeAreaView, Text, } from 'react-native';
import StackNavigator from "./StackNavigator";
import { apiCall } from "./src/api/openAI";


export default function App() {
  useEffect(() => {
    // apiCall('create an image or a dog playing with cat')
  },[])
  return (
    <StackNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

