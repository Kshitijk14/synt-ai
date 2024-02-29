import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native'; 

const WelcomeScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Synt-AI</Text>
        <Text style={styles.subtitleText}>
          The future is here, powered by AI.
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/welcome.png')}
          style={styles.image}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('HomeScreen')}
        style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default WelcomeScreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: wp(10),
    fontWeight: 'bold',
    color: 'black',
  },
  subtitleText: {
    fontSize: wp(4),
    fontWeight: '600',
    color: 'gray',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    height: wp(70),
    width: wp(70),
  },
  button: {
    backgroundColor: '#34D399',
    borderRadius: 20,
    padding: 15,
  },
  buttonText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

