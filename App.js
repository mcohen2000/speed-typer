import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResultsModal from "./components/ResultsModal";
import Navbar from "./components/Navbar";

export default function App() {
  const [input, setInput] = useState("");
  const testTexts = [
    "The quick brown fox jumps over the lazy dog.",
    `React Native combines the best parts of native development with React, a best-in-class JavaScript library for building user interfaces.`,
    `React Native lets you create truly native apps and doesn't compromise your users' experiences. It provides a core set of platform agnostic native components like View, Text, and Image that map directly to the platform's native UI building blocks.`,
  ];
  const [currentTest, setCurrentTest] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  function handleStart(newText) {
    if (!isActive && !isDone) {
      setStartTime(Date.now());
      setIsActive(true);
    }
    if (input.length === 1 && newText === "") {
      setInput("");
    }
    if (newText.length >= 1 && newText.slice(0, -1) === testTexts[currentTest].slice(0, newText.length - 1)) {
        setInput(newText);
    }
  }
  const clearData = async (value) => {
    try {
      const jsonValue = JSON.stringify([]);
      await AsyncStorage.setItem(value.key, jsonValue);
      setResults([]);
    } catch (e) {
      console.log(e);
    }
  };
  const storeData = async (value) => {
    try {
      const prevData = await AsyncStorage.getItem(`${value.key}`);
      if (prevData === null) {
        const jsonValue = JSON.stringify([
          { created: value.created, time: value.time },
        ]);
        await AsyncStorage.setItem(value.key, jsonValue);
      } else {
        const jsonValue = JSON.stringify([
          ...JSON.parse(prevData),
          { created: value.created, time: value.time },
        ]);
        await AsyncStorage.setItem(value.key, jsonValue);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem(`${currentTest}`);
      if (value === null) {
        setResults([]);
      }else{
        setResults(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  };
  function handleReset() {
    setInput("");
    setStartTime(0);
    setTimer(0);
    setIsActive(false);
    setIsDone(false);
  }
  useEffect(() => {
    let interval = null;
    if (isActive && isDone === false) {
      interval = setInterval(() => {
        setTimer((Date.now() - startTime) / 1000);
      }, 100);
    }
    if (input === testTexts[currentTest]) {
      let finishTime = Date.now();
      setIsActive(false);
      setIsDone(true);
      if (isDone === true) {
        storeData({
          key: `${currentTest}`,
          created: finishTime,
          time: timer.toFixed(1),
        });
        setResults((prev) => [
          ...prev,
          { created: finishTime, time: `${timer.toFixed(1)}` },
        ]);
        setShowResults(true);
        handleReset();
      }
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [input, isActive]);
  useEffect(() => {
    getData();
    handleReset();
  }, [currentTest]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleWrapper}>
        <Image style={styles.logo} source={require('./assets/speedtyper.png')}/>
        <Text style={styles.title}>Speed Typer</Text>
      </View>
      <View style={styles.testWrapper}>
        <View style={styles.currentResults}>
          <Text style={styles.timer}>{timer.toFixed(1)}s</Text>
          <Text style={styles.test}>
            {[...testTexts[currentTest]].map((char, index) =>
              input[index] === undefined ? (
                <Text style={styles.testText} key={index}>
                  {char}
                </Text>
              ) : char === input[index] ? (
                <Text style={styles.correct} key={index}>
                  {char}
                </Text>
              ) : (
                <Text style={styles.incorrect} key={index}>
                  {char}
                </Text>
              )
            )}
          </Text>
        </View>
        <TextInput
          style={styles.input}
          keyboardType={'ascii-capable'}
          placeholder='Start typing to begin!'
          placeholderTextColor='white'
          onChangeText={(newText) => handleStart(newText)}
          value={input}
        />
        <View style={styles.buttonsWrapper}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => handleReset()}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => clearData({ key: `${currentTest}` })}
          >
            <Text style={styles.clearText}>Clear Data</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ResultsModal
        results={results}
        showResults={showResults}
        setShowResults={setShowResults}
      />
      <Navbar currentTest={currentTest} setCurrentTest={setCurrentTest} testTexts={testTexts} setShowResults={setShowResults}/>
      <StatusBar style='light' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    backgroundColor: "#1c1c1c",
    alignItems: "center",
    justifyContent: "start",
    overflow: "hidden",
  },
  titleWrapper:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

  },
  logo: {
    width: 40,
    height: 40
  },
  title: {
    fontSize: 20,
    paddingVertical: 20,
    paddingLeft: 8,
    fontWeight: "bold",
    color: "white",
  },
  testWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    borderColor: "white",
    borderWidth: 2,
    justifyContent: "start",
    alignItems: "center",
    width: "90%",
    margin: 16,
    padding: 20,
    backgroundColor: "rgba(255,255, 255, 0.1)",
  },
  testText: {
    color: "gray",
  },
  timer: {
    textAlign: "center",
    color: "white",
    fontSize: 32,
  },
  currentResults: {},
  test: {
    textAlign: "center",
    paddingVertical: 8,
  },
  input: {
    marginTop: 8,
    minWidth: "100%",
    textAlign: "center",
    color: "white",
    padding: 8,
    borderColor: "white",
    borderWidth: 2,
  },
  buttonsWrapper: {
    width: "100%",
    marginTop: 8,
    gap: 8,
    rowGap: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  resetButton: {
    textAlign: "center",
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: "white",
    borderWidth: 2,
  },
  resetText: {
    color: "white",
    textAlign: "center",
  },
  clearButton: {
    textAlign: "center",
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: "white",
    borderWidth: 2,
  },
  clearText: {
    color: "white",
    textAlign: "center",
  },
  correct: {
    backgroundColor: "rgba(0, 255, 0, 0.4)",
    color: "white",
  },
  incorrect: {
    backgroundColor: "rgba(255, 0, 0, 0.4)",
    color: "white",
  },
});
