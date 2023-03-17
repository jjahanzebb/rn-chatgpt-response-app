import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import * as Clipboard from "expo-clipboard";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);

  const generateResponse = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: inputText }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_API_KEY_HERE", // replace with your API Key from here: https://platform.openai.com/account/api-keys
          },
        }
      );

      setGeneratedText(response.data.choices[0].message.content);
    } catch (error) {
      ToastAndroid.show(error.message, 5);
    }

    setLoading(false);
  };

  const copyToClipboard = () => {
    if (generatedText === "") {
      ToastAndroid.show("No response to copy..", 5);
    } else {
      Clipboard.setStringAsync(generatedText);
      ToastAndroid.show("Response copied to clipboard!", 5);
    }
  };

  return (
    <ImageBackground
      source={require("./assets/paper.png")}
      imageStyle={{ opacity: 0.25, resizeMode: "repeat" }}
      style={{
        flex: 1,
        width: "100%",
        justifyContent: "flex-end",
      }}
    >
      <TouchableOpacity
        onPress={() => copyToClipboard()}
        activeOpacity={0.8}
        style={{
          backgroundColor: "#444",
          width: "20%",
          height: 30,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          position: "absolute",
          top: 10,
          right: 20,
          zIndex: 1,
        }}
      >
        <Text style={{ color: "#fff" }}>Copy</Text>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          width: "100%",
          padding: 20,
        }}
      >
        <StatusBar barStyle={"dark-content"} backgroundColor={"transparent"} />

        <ScrollView
          style={{
            marginTop: 30,
            marginBottom: 20,
            flex: 1,
          }}
        >
          <Text style={{ lineHeight: 25 }}>{generatedText}</Text>

        </ScrollView>

        <TextInput
          onChangeText={setInputText}
          value={inputText}
          placeholder="Enter text here.."
          multiline={true}
          numberOfLines={2}
          style={{
            height: 60,
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
          }}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => generateResponse()}
          style={{
            borderRadius: 10,
            backgroundColor: "#000",
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          {loading ? (
            <ActivityIndicator color={"#fff"} />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Generate Response
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
