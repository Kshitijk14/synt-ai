import {View, Text, ScrollView, Image, StyleSheet} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Features = () => {
  return (
    <ScrollView
      style={styles.scrollView}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.featuresTitle}>Features</Text>
      <View style={styles.featureContainerChatGpt}>
        <View style={styles.iconTextContainer}>
          <Image
            source={require('../../assets/images/chatgptIcon.png')}
            style={styles.icon}
          />
          <Text style={styles.featureTitle}>ChatGPT</Text>
        </View>
        <Text style={styles.featureDescription}>
          ChatGPT can provide you with instant and knowledgeable responses,
          assist you with creative ideas on a wide range of topics.
        </Text>
      </View>
      <View style={styles.featureContainerDALLE}>
        <View style={styles.iconTextContainer}>
          <Image
            source={require('../../assets/images/dalleIcon.png')}
            style={styles.icon}
          />
          <Text style={styles.featureTitle}>DALL-E</Text>
        </View>
        <Text style={styles.featureDescription}>
          DALL-E can generate imaginative and diverse images from textual
          descriptions, expanding the boundaries of visual creativity.
        </Text>
      </View>
      <View style={styles.featureContainerSmartAI}>
        <View style={styles.iconTextContainer}>
          <Image
            source={require('../../assets/images/smartaiIcon.png')}
            style={styles.icon}
          />
          <Text style={styles.featureTitle}>Smart AI</Text>
        </View>
        <Text style={styles.featureDescription}>
          A powerful voice assistant with the abilities of ChatGPT and DALL-E,
          providing you the best of both worlds.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Features;

const styles = StyleSheet.create({
  scrollView: {
    height: hp(60),
  },
  featuresTitle: {
    fontSize: wp(6.5),
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: hp(2),
  },
  featureContainerChatGpt: {
    backgroundColor: '#A2E8D8',
    padding: wp(4),
    borderRadius: wp(4),
    marginBottom: hp(2),
  },
  featureContainerDALLE: {
    backgroundColor: '#E7BDFC',
    // backgroundColor: '#D69AF5',
    // backgroundColor: '#C7ACEC',
    padding: wp(4),
    borderRadius: wp(4),
    marginBottom: hp(2),
  },
  featureContainerSmartAI: {
    backgroundColor: '#88F7F4',
    // backgroundColor: '#B1F9F6',

    padding: wp(4),
    borderRadius: wp(4),
    marginBottom: hp(2),
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  icon: {
    // height: hp(4),
    // width: hp(4),
    height: 30,
    width: 30,
    borderRadius: hp(1),
    marginRight: wp(1),
  },
  featureTitle: {
    fontSize: wp(4.8),
    fontWeight: 'bold',
    color: 'black',
  },
  featureDescription: {
    fontSize: wp(3.8),
    color: 'gray',
    fontWeight: '500',
  },
});

