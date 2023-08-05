import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function Navbar({currentTest, setCurrentTest, testTexts, setShowResults}) {
  return (
    <View style={styles.bottomNavbar}>
        {currentTest > 0 ? (
          <TouchableOpacity
            style={[styles.leftArrowButton, styles.arrowButton]}
            onPress={() => {
              setCurrentTest((prev) => prev - 1);
            }}
          >
            <Text style={styles.leftArrowButtonText}>&#9664;</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.leftArrowButton, styles.disabledArrowButton]}
          >
            <Text style={styles.leftDisabledArrowButtonText}>&#9664;</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.resultsButton}
          activeOpacity={1}
          onPress={() => setShowResults(true)}
        >
          <Text style={styles.resultsText} numberOfLines={1}>
            Results
          </Text>
        </TouchableOpacity>
        <View style={{ width: 45 }}></View>
        {currentTest < testTexts.length - 1 ? (
          <TouchableOpacity
            style={[styles.rightArrowButton, styles.arrowButton]}
            onPress={() => {
              setCurrentTest((prev) => prev + 1);
            }}
          >
            <Text style={styles.rightArrowButtonText}>&#9654;</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.rightArrowButton, styles.disabledArrowButton]}
          >
            <Text style={styles.rightDisabledArrowButtonText}>&#9654;</Text>
          </TouchableOpacity>
        )}
      </View>
  )
};

const styles = StyleSheet.create({
    bottomNavbar: {
      position: "absolute",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      width: "80%",
      bottom: 36,
    },
    arrowButton: {
      zIndex: 1,
      flexGrow: 1,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      height: 45,
      marginHorizontal: 10,
      backgroundColor: "rgba(124, 124, 124, 1)",
    },
    leftArrowButton: {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    leftArrowButtonText: {
      color: "white",
    },
    disabledArrowButton: {
      zIndex: 1,
      borderRadius: 8,
      marginHorizontal: 10,
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      height: 45,
      backgroundColor: "rgba(124, 124, 124,0.5)",
    },
    leftDisabledArrowButtonText: {
      color: "grey",
    },
    resultsButton: {
      position: "absolute",
      backgroundColor: "rgb(128, 52, 235)",
      justifyContent: "center",
      alignItems: "center",
      height: 90,
      width: 90,
      textAlign: "center",
      color: "white",
      borderRadius: "100%",
      borderColor: "white",
      borderWidth: 2,
      zIndex: 2,
    },
    resultsText: {
      color: "white",
    },
    rightArrowButton: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    rightArrowButtonText: {
      color: "white",
    },
    rightDisabledArrowButtonText: {
      color: "grey",
    },
  });