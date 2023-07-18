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
        <Text style={styles.testText}>{currentTest}</Text>
      </View>
      <View style={styles.results}>
        <Text style={styles.test}>{[...input].map((char, index) => 
          (char === currentTest[index] ?
          <Text style={styles.correct}>{char}</Text> : <Text style={styles.incorrect}>{char}</Text>)
        )}</Text>

      </View>
      <KeyboardAvoidingView>
        <TextInput 
          style={styles.input}
          placeholder='Type here'
          onChangeText={ newText => setInput(newText)}
          defaultValue={input}
        />

      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'start',
  },
  title: {
    fontSize: 20,
    padding: 20,
    fontWeight: 'bold'
  },
  testWrapper: {
    height: '30%',
    backgroundColor: 'darkgrey',
  },
  testText: {},
  results: {},
  test: {},
  input: {},
  correct: {
    color: 'lime'
  },
  incorrect: {
    color: 'red'
  },
});
