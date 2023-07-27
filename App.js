import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, KeyboardAvoidingView, TouchableOpacity, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [input, setInput] = useState('');
  const testTexts = ['The quick brown fox jumps over the lazy dog.']
  const [currentTest, setCurrentTest] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  function handleStart(newText){
    if(!isActive && !isDone){
      setStartTime(Date.now());
      setIsActive(true);
    }
    if (input.length=== 1 && newText === ''){
      setInput('');
    }
    if (newText.length >= 1 && newText.slice(0, -1) === testTexts[currentTest].slice(0, newText.length-1)){
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
      if (prevData === null){
        const jsonValue = JSON.stringify([{created: value.created, time: value.time}]);
        await AsyncStorage.setItem(value.key, jsonValue);

      } else{
        const jsonValue = JSON.stringify([...JSON.parse(prevData), {created: value.created, time: value.time}]);
        await AsyncStorage.setItem(value.key, jsonValue);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem(`${currentTest}`);
      if (value !== null) {
        setResults(JSON.parse(value));
      };
    } catch (e) {
      console.log(e);
    }
  };
  function handleReset(){
    setInput('');
    setStartTime(0);
    setTimer(0);
    setIsActive(false);
    setIsDone(false);
  }
  useEffect(() => {
    let interval = null;
    if (isActive && isDone===false){
      interval = setInterval(() => {
        setTimer((Date.now() - startTime)/1000)
      }, 100);
    };
    if(input === testTexts[currentTest]){
      let finishTime = Date.now();
      setIsActive(false);
      setIsDone(true);
      if(isDone===true){
        storeData({key: `${currentTest}`, created: finishTime, time: timer.toFixed(1) });
        setResults((prev) => [...prev, {created: finishTime, time: `${timer.toFixed(1)}`}])
        setShowResults(true);
        handleReset();
      };
      clearInterval(interval);
    };
    return () => {
      clearInterval(interval);
    };
  }, [input, isActive])
  useEffect(() => {
    getData();
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Speed Typer</Text>
      <View style={styles.testWrapper}>
        <View style={styles.currentResults}>
          <Text style={styles.timer}>{timer.toFixed(1)}s</Text>
          <Text style={styles.test}>{[...testTexts[currentTest]].map((char, index) =>  
            input[index] === undefined ? 
            <Text style={styles.testText} key={index}>{char}</Text> : 
            char === input[index] ? 
            <Text style={styles.correct} key={index}>{char}</Text> : 
            <Text style={styles.incorrect} key={index}>{char}</Text>
            )}
          </Text>
        </View>
        <View styles={styles.keyboardWrapper}>
          <KeyboardAvoidingView
            style={styles.keyboard}
            >
            <TextInput 
              style={styles.input}
              placeholder='Start typing to begin!'
              placeholderTextColor='white'
              onChangeText={newText => handleStart(newText)}
              value={input}
              />

          </KeyboardAvoidingView>
        </View>
        <TouchableOpacity
            style={styles.resetButton}
            onPress={() => handleReset()}
        >
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.resultsButton}
            onPress={() => setShowResults(true)}
        >
          <Text style={styles.resetText}>Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.clearButton}
            onPress={() => clearData({key: `${currentTest}`})}
        >
          <Text style={styles.clearText}>Clear Data</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible= {showResults}
        onRequestClose={() => setShowResults(false)}
        animationType='slide'
      >
          <View style={styles.prevResults}>
            <View style={styles.modalHeader}>
              <Text style={styles.sectionHeader}>Results</Text>
            </View>
            <ScrollView style={styles.resultsScroll}>
              <View style={styles.resultsScrollWrapper}>
                {results.map((item, index) => {
                  let date = new Date(item.created);
                  let currentDate = new Date(Date.now());
                  let dateStr = null;
                  if(`${currentDate.getMonth()+1}/${currentDate.getDate()}/${currentDate.getFullYear()}` === `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`){
                    dateStr = `${date.getHours()}:${date.getMinutes() < 10 ? `0` + date.getMinutes() : date.getMinutes()}`;
                  } else{
                    dateStr = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
                  }
                  return (
                    <View style={index%2===0 ? styles.resultWrapper : styles.resultWrapper2} key={`${index}`}>
                      <Text style={styles.prevResultDate}>{dateStr}</Text>
                      <Text style={styles.prevResultTime}>{item.time}s</Text>
                  </View>
                  )})}
              </View>

            </ScrollView>
            <View style={styles.closeButtonWrapper}>
              <TouchableOpacity style={styles.closeButton}
                onPress={() => setShowResults(false)}
              >
                <Text style={styles.closeButtonText}>&#10005;</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      {/* {showResults === true ? 
          : <View style={styles.hiddenResults}></View>} */}
      <StatusBar style="light"/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'start',
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    padding: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  testWrapper: {
    // flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'start',
    alignItems: 'center',
    width: '90%',
    margin: 16,
    padding: 20,
    backgroundColor: 'rgba(255,255, 255, 0.1)',
  },
  testText: {
    color: 'gray',
  },
  timer: {
    textAlign: 'center',
    color: 'white',
    fontSize: 32,
  },
  currentResults: {},
  sectionHeader: {
    width: '100%',
    // backgroundColor: 'red',
    paddingTop: 32,
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
    paddingBottom: 24,
    // borderColor: 'none',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
    borderColor: 'white',
  },
  hiddenResults: {
    position: 'absolute',
    top: '100%',
    left: 0,
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: 'white',
    borderWidth: 2,
    justifyContent: 'start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    // margin: 16,
    // padding: 20,
    backgroundColor: 'rgba(56, 56, 56, 1)',
  },
  modalHeader: {
    
    width: '100%',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
  },
  closeButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderTopColor: 'white',
    borderTopWidth: 2,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: '100%',
    marginVertical: 16,
  },
  closeButtonText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
  prevResults: {
    overflow: 'hidden',
    justifyContent: 'start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#1c1c1c',
  },
  resultsScroll: {
    backgroundColor: 'rgba(56, 56, 56, 1)',
    overflow: 'hidden',
    width: '100%',
    // height: '50%',
  },
  resultsScrollWrapper: {
    flexDirection: 'column-reverse'
  },
  resultWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255,255, 255, 0.1)',
  },
  resultWrapper2: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    
  },
  prevResultDate: {
    color: 'rgba(255,255,255,0.5)'
  },
  prevResultTime: {
    fontSize: 24,
    color: 'white'
  },
    
  test: {
    paddingVertical: 8,
  },
  keyboardWrapper: {
    width: '100%',
  },
  keyboard: {
    marginTop: 8,
  },
  input: {
    textAlign: 'center',
    color: 'white',
    padding: 8,
    borderColor: 'white',
    borderWidth: 2
  },
  resetButton: {
    marginTop: 8,
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: 'white',
    borderWidth: 2
  },
  resetText: {
    color: 'white',
    textAlign: 'center',
  },
  resultsButton: {
    marginVertical: 8,
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: 'white',
    borderWidth: 2
  },
  clearButton: {
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: 'white',
    borderWidth: 2
  },
  clearText: {
    color: 'white',
    textAlign: 'center',
  },
  correct: {
    backgroundColor: 'rgba(0, 255, 0, 0.4)',
    color: 'white',
  },
  incorrect: {
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
    color: 'white',
  },
});
