// Import required modules
const Microphone = require("node-microphone");
const fs = require("fs");
const readline = require("readline");
const axios = require("axios");
const FormData = require("form-data");
const Speaker = require("speaker");
const OpenAI = require("openai");
require("dotenv").config();


// Initialize OpenAI API client with the provided API key
const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
    apiKey: secretKey,
});

// Variables to store chat history and other components
let chatHistory = []; // To store the conversation history
let micStream, rl; // Microphone, output file, microphone stream, and readline interface

console.log(
    `\n# # # # # # # # # # # # # # # # # # # # #\n# Welcome to your AI-powered voice chat #\n# # # # # # # # # # # # # # # # # # # # #\n`
);

// These are the main functions
// 1. setupReadlineInterface()
// 2. startRecording()
// 3. stopRecordingAndProcess()
// 4. transcribeAndChat()
// 5. streamedAudio()

// Function to set up the readline interface for user input
const setupReadlineInterface = () => {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true, // Make sure the terminal can capture keypress events
    });

    readline.emitKeypressEvents(process.stdin, rl);

    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

  // Handle keypress events
    process.stdin.on("keypress", (str, key) => {
        if (
            key &&
            (key.name.toLowerCase() === "return" ||
                key.name.toLowerCase() === "enter")
        ) {
            if (micStream) {
                stopRecordingAndProcess();
            } else {
                startRecording();
            }
        } else if (key && key.ctrl && key.name === "c") {
            process.exit(); // Handle ctrl+c for exiting
        } else if (key) {
            console.log("Exiting application...");
            process.exit(0);
        }
    });

    console.log("Press Enter when you're ready to start speaking.");
};

// Function to start recording audio from the microphone
const startRecording = () => {
    mic = new Microphone();
    outputFile = fs.createWriteStream("output.wav");
    micStream = mic.startRecording();

    // Write incoming data to the output file
    micStream.on("data", (data) => {
        outputFile.write(data);
    });

    // Handle microphone errors
    micStream.on("error", (error) => {
        console.error("Error: ", error);
    });

    console.log("Recording... Press Enter to stop");
};

// Function to stop recording and process the audio
const stopRecordingAndProcess = () => {
    mic.stopRecording();
    outputFile.end();
    console.log(`Recording stopped, processing audio...`);
    transcribeAndChat(); // Transcribe the audio and initiate chat
};

// Default voice setting for text-to-speech
const inputVoice = "echo"; // https://platform.openai.com/docs/guides/text-to-speech/voice-options
const inputModel = "tts-1"; // https://platform.openai.com/docs/guides/text-to-speech/audio-quality

// Function to convert text to speech and play it using Speaker
const { exec } = require('child_process');

async function streamedAudio(inputText, model = inputModel, voice = inputVoice) {
    // Prepare SoX command to play audio directly from stdin
    const command = `play -t mp3 -`;

    try {
        // Execute the SoX command to play the audio
        const child = exec(command);

        // Pipe the response stream to the SoX command
        child.stdin.write(inputText);

        // Handle any errors or process exit
        child.on('error', (error) => {
            console.error(`Error executing SoX command: ${error.message}`);
        });

        child.on('exit', (code, signal) => {
            console.log(`SoX command exited with code ${code} and signal ${signal}`);
        });
    } catch (error) {
        console.error(`Error in streamedAudio: ${error.message}`);
    }
}

// Function to transcribe audio to text and send it to the chatbot
async function transcribeAndChat() {
    const filePath = "output.wav";
  // note that the file size limitations are 25MB for Whisper

  // Prepare form data for the transcription request
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    form.append("model", "whisper-1");
    form.append("response_format", "text");

    try {
        // Post the audio file to OpenAI for transcription
        const transcriptionResponse = await axios.post(
            "https://api.openai.com/v1/audio/transcriptions",
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${secretKey}`,
                },
            }
        );

    // Extract transcribed text from the response
    const transcribedText = transcriptionResponse.data;
    console.log(`>> You said: ${transcribedText}`);

    // Prepare messages for the chatbot, including the transcribed text
    const messages = [
        {
            role: "system",
            content:
            "You are a helpful assistant providing concise responses in at most two sentences.",
        },
        ...chatHistory,
        { role: "user", content: transcribedText },
    ];

    // Send messages to the chatbot and get the response
    const chatResponse = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo",
    });

    // Extract the chat response.
    const chatResponseText = chatResponse.choices[0].message.content;

    // Update chat history with the latest interaction
    chatHistory.push(
        { role: "user", content: transcribedText },
        { role: "assistant", content: chatResponseText }
    );

    // Convert the chat response to speech and play + log it to the terminal
    await streamedAudio(chatResponseText);
    console.log(`>> Assistant said: ${chatResponseText}`);

    // Reset microphone stream and prompt for new recording
    micStream = null;
    console.log("Press Enter to speak again, or any other key to quit.\n");
    } catch (error) {
        // Handle errors from the transcription or chatbot API
        if (error.response) {
            console.error(
                `Error: ${error.response.status} - ${error.response.statusText}`
            );
        } else {
            console.error("Error:", error.message);
        }
    }
}

// Initialize the readline interface
setupReadlineInterface();