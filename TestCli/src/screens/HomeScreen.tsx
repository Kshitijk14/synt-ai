import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {apiCall} from './../api/openAI';
import Features from './../components/Features';
import Tts from 'react-native-tts';

const HomeScreen = () => {
  const [textInput, setTextInput] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const scrollViewRef = useRef();

  const speechStartHandler = () => {
    console.log('Speech start event');
  };

  const speechEndHandler = () => {
    setRecording(false);
    console.log('Speech end event');
  };

  const speechResultsHandler = e => {
    console.log('Speech results event: ', e);
    const text = e.value[0];
    setTextInput(text);
    fetchResponse();
  };

  const speechErrorHandler = e => {
    console.log('Speech error: ', e);
  };

  const startRecording = async () => {
    setRecording(true);
    Tts.stop();
    try {
      await Voice.start('en-GB');
    } catch (error) {
      console.log('Error starting voice recognition: ', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      fetchResponse();
    } catch (error) {
      console.log('Error stopping voice recognition: ', error);
    }
  };

  const clear = () => {
    Tts.stop();
    setSpeaking(false);
    setLoading(false);
    setMessages([]);
  };

  const fetchResponse = async () => {
    if (textInput.trim().length > 0) {
      setLoading(true);
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: textInput.trim()});
      setMessages([...newMessages]);
      updateScrollView(newMessages);

      apiCall(textInput.trim(), newMessages).then(res => {
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          setTextInput('');
          updateScrollView(res.data);
          startTextToSpeech(res.data[res.data.length - 1]);
        } else {
          // Alert.alert('Error', res.msg);
          console.log('Error response from API:', res.error); // Log the error for debugging
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({animated: true});
    }, 200);
  };

  const startTextToSpeech = message => {
    if (!message.content.includes('https')) {
      setSpeaking(true);
      Tts.speak(message.content, {
        iosVoiceId: 'com.apple.ttsbundle.Samantha-compact',
        rate: 0.5,
      });
    }
  };

  const stopSpeaking = () => {
    Tts.stop();
    setSpeaking(false);
  };

  useEffect(() => {
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    Tts.setDefaultLanguage('en-IE');
    Tts.addEventListener('tts-finish', () => setSpeaking(false));

    return () => {
      // Voice.destroy().then(Voice.removeAllListeners);
      // Tts.stop();
      // Tts.removeEventListener('tts-finish');
    };
  }, []);

  const handleSendMessage = () => {
    // Call fetchResponse to send the text input and receive the response
    fetchResponse();
    // setTextInput('');
  };
  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      // Send the data here
      fetchResponse();
      console.log(data);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        {/* Features || Messages */}
        {messages.length > 0 ? (
          <View style={styles.messageContainer}>
            <Text style={styles.assistantText}>Assistant</Text>

            <View style={styles.messageHistory}>
              <ScrollView
                ref={scrollViewRef}
                bounces={false}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}>
                {messages.map((message, index) => {
                  if (message.role === 'assistant') {
                    if (message.content.includes('https')) {
                      return (
                        <View key={index} style={styles.imageResponseContainer}>
                          <View style={styles.imageResponseInnerContainer}>
                            <Image
                              source={{uri: message.content}}
                              style={styles.imageResponse}
                              resizeMode="contain"
                            />
                          </View>
                        </View>
                      );
                    } else {
                      return (
                        <View key={index} style={styles.textResponseContainer}>
                          <Text style={styles.textResponse}>
                            {message.content}
                          </Text>
                        </View>
                      );
                    }
                  } else {
                    return (
                      <View key={index} style={styles.userInputContainer}>
                        <View style={styles.userInputInnerContainer}>
                          <Text style={styles.userInputText}>
                            {message.content}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}

        <View style={styles.buttonContainerText}>
          <TouchableOpacity
            onPress={() => {}}
            style={styles.input}
            activeOpacity={1} // Disable the default touch opacity to prevent propagation
          >
            <TextInput
              // style={styles.input}
              value={textInput}
              onChangeText={text => setTextInput(text)}
              placeholder="Ask me anything"
              onSubmitEditing={handleSendMessage}
              onTouchStart={() => setRecording(false)} // Ensure recording is stopped when input is touched
            />
          </TouchableOpacity>
        </View>

        {/* recording, clear and stop buttons */}

        <View style={styles.buttonContainer}>
          {loading ? (
            <Image
              source={require('../../assets/images/loading.gif')}
              style={styles.loadingIcon}
            />
          ) : recording ? (
            <TouchableOpacity onPress={stopRecording}>
              {/* recording stop button */}
              <Image
                source={require('../../assets/images/voiceLoading.gif')}
                style={styles.recordingIcon}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              {/* recording start button */}
              <Image
                source={require('../../assets/images/recordingIcon.png')}
                style={styles.recordingIcon}
              />
            </TouchableOpacity>
          )}

          {/* clear button */}
          {messages.length > 0 && (
            <TouchableOpacity onPress={clear} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}

          {speaking && (
            <TouchableOpacity onPress={stopSpeaking} style={styles.stopButton}>
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeAreaView: {
    flex: 1,
    margin: 5,
  },
  botIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  botIcon: {
    height: hp(15),
    width: hp(15),
  },
  messageContainer: {
    flex: 1,
  },
  assistantText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: 1,
  },
  messageHistory: {
    height: hp(70),
    backgroundColor: '#f4f4f4',
    borderRadius: 20,
    padding: 15,
  },
  scrollView: {
    flex: 1,
  },
  imageResponseContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  imageResponseInnerContainer: {
    padding: 2,
    // flex: 1,
    borderRadius: 20,
    backgroundColor: '#A7F3D0',
    marginBottom: 12,
  },
  imageResponse: {
    height: wp(60),
    width: wp(60),
    borderRadius: 20,
  },
  textResponseContainer: {
    width: wp(70),
    backgroundColor: '#A7F3D0',
    padding: 6,
    borderRadius: 10,
    marginBottom: 12,
  },
  textResponse: {
    fontSize: wp(4),
    color: '#2D3A3A',
  },
  userInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  userInputInnerContainer: {
    width: wp(70),
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 10,
    marginBottom: 12,
  },
  userInputText: {
    fontSize: wp(4),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 260,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainerText: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 79,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: hp(35),
    height: hp(7),
    borderRadius: hp(2) / 2,
    marginTop: '60%',
    borderWidth: 1,

    // marginLeft: 20,
  },
  loadingIcon: {
    width: hp(10),
    height: hp(10),
  },
  recordingIcon: {
    width: hp(12),
    height: hp(12),
    borderRadius: hp(10) / 2,
    marginTop: '60%',
    // marginLeft: 20,
  },
  clearButton: {
    zIndex: 1,
    backgroundColor: '#B2B2B2',
    borderRadius: 20,

    padding: 15,
    position: 'absolute',
    right: 10,
    bottom: 90,
    // marginBottom: hp(120),
  },
  clearButtonText: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: 'white',
  },
  stopButton: {
    zIndex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    padding: 15,
    position: 'absolute',
    left: 19,
    bottom: 145,
  },
  stopButtonText: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: 'white',
  },
});

