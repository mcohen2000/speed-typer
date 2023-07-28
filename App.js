import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [input, setInput] = useState('');
  const testTexts = ['The quick brown fox jumps over the lazy dog.', `React Native lets you create truly native apps and doesn’t compromise your users’ experiences. It provides a core set of platform agnostic native components like View, Text, and Image that map directly to the platform’s native UI building blocks.`]
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
  }, [currentTest])


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
        <TextInput 
          style={styles.input}
          placeholder='Start typing to begin!'
          placeholderTextColor='white'
          onChangeText={newText => handleStart(newText)}
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
              onPress={() => clearData({key: `${currentTest}`})}
          >
            <Text style={styles.clearText}>Clear Data</Text>
          </TouchableOpacity>
        </View>
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
        <View style={styles.bottomNavbar}>
          {currentTest > 0 ? 
          <TouchableOpacity
              style={[styles.leftArrowButton, styles.arrowButton]}
              onPress={() => {
                setCurrentTest(prev => prev-1)
              }}
          >
            <Text style={styles.leftArrowButtonText}>&#9664;</Text>
          </TouchableOpacity> :
          <TouchableOpacity
            style={[styles.leftArrowButton, styles.disabledArrowButton]}
            
          >
            <Text style={styles.leftDisabledArrowButtonText}>&#9664;</Text>
          </TouchableOpacity>
          }
          <TouchableOpacity
              style={styles.resultsButton}
              activeOpacity={1}
              onPress={() => setShowResults(true)}
          >
            {/* <Text></Text> */}
            <Text style={styles.resultsText} numberOfLines={1}>Results</Text>
          </TouchableOpacity>
          <View style={{width: 45}}></View>
          {currentTest < testTexts.length-1 ? 
          <TouchableOpacity
              style={[styles.rightArrowButton, styles.arrowButton]}
              onPress={() => {
                setCurrentTest(prev => prev+1)
              }}
          >
            <Text style={styles.rightArrowButtonText}>&#9654;</Text>
          </TouchableOpacity> :
          <TouchableOpacity
            style={[styles.rightArrowButton, styles.disabledArrowButton]}
          >
            <Text style={styles.rightDisabledArrowButtonText}>&#9654;</Text>
          </TouchableOpacity>
          }

        </View>
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
  bottomNavbar: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    bottom: 36,
  },
  resultsButton: {
    position: 'absolute',
    backgroundColor: 'rgb(128, 52, 235)',
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: 90,
    textAlign: 'center',
    color: 'white',
    borderRadius: '100%',
    borderColor: 'white',
    borderWidth: 2,
    zIndex: 2,
  }, 
  resultsText: {
    color: 'white',
  },
  arrowButton: {
    zIndex: 1,
    flexGrow: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    marginHorizontal:  10,
    backgroundColor: 'rgba(124, 124, 124, 1)'
    
  },
  leftArrowButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  rightArrowButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  leftArrowButtonText: {
    color: 'white',

  },
  rightArrowButtonText: {
    color: 'white',
  },
  disabledArrowButton: {
    zIndex: 1,
    borderRadius: 8,
    marginHorizontal:  10,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    backgroundColor: 'rgba(124, 124, 124,0.5)'
  },
  leftDisabledArrowButtonText: {
    color: 'grey',
  },
  rightDisabledArrowButtonText: {
    color: 'grey',
  },
  testWrapper: {
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
    paddingTop: 32,
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
    paddingBottom: 24,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
    borderColor: 'white',
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
    textAlign: 'center',
    paddingVertical: 8,
  },
  input: {
    marginTop: 8,
    minWidth: '100%',
    textAlign: 'center',
    color: 'white',
    padding: 8,
    borderColor: 'white',
    borderWidth: 2
  },
  buttonsWrapper: {
    width: '100%',
    marginTop: 8,
    gap: 8,
    rowGap: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resetButton: {
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
