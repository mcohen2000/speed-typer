import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, KeyboardAvoidingView } from 'react-native';

export default function App() {
  const [input, setInput] = useState('');
  const testTexts = ['The quick brown fox jumped over the lazy dog.']
  const [currentTest, setCurrentTest] = useState(testTexts[0]);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Speed Typer</Text>
      <View style={styles.testWrapper}>
        <View style={styles.results}>
          <Text style={styles.testText}>{currentTest}</Text>
          <Text style={styles.test}>{[...input].map((char, index) => 
            (char === currentTest[index] ?
            <Text style={styles.correct} key={index}>{char}</Text> : <Text style={styles.incorrect} key={index}>{char}</Text>)
          )}</Text>
        </View>
        <View styles={styles.keyboardWrapper}>
          <KeyboardAvoidingView
            style={styles.keyboard}
            >
            <TextInput 
              style={styles.input}
              placeholder='Start typing to begin!'
              placeholderTextColor='white'
              onChangeText={ newText => setInput(newText)}
              defaultValue={input}
              />

          </KeyboardAvoidingView>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'start',
  },
  title: {
    fontSize: 20,
    padding: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  testWrapper: {
    // flex: 1,
    justifyContent: 'start',
    alignItems: 'center',
    width: '90%',
    margin: 16,
    padding: 20,
    backgroundColor: 'rgba(255,255, 255, 0.1)',
  },
  testText: {
    color: 'white',
    paddingBottom: 8,
  },
  results: {},
  test: {
  },
  keyboardWrapper: {
    width: '100%',
  },
  keyboard: {
    margin: 16,
  },
  input: {
    color: 'white',
    marginTop: 8,
    padding: 8,
    borderColor: 'white',
    borderWidth: 2
  },
  correct: {
    backgroundColor: 'rgba(191, 255, 0, 0.8)'
  },
  incorrect: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)'
  },
});
