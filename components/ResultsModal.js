import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

export default function ResultsModal({ results, showResults, setShowResults }) {
  return (
    <Modal
      visible={showResults}
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
              if (
                `${
                  currentDate.getMonth() + 1
                }/${currentDate.getDate()}/${currentDate.getFullYear()}` ===
                `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
              ) {
                dateStr = `${date.getHours()}:${
                  date.getMinutes() < 10
                    ? `0` + date.getMinutes()
                    : date.getMinutes()
                }`;
              } else {
                dateStr = `${
                  date.getMonth() + 1
                }/${date.getDate()}/${date.getFullYear()}`;
              }
              return (
                <View
                  style={
                    index % 2 === 0
                      ? styles.resultWrapper
                      : styles.resultWrapper2
                  }
                  key={`${index}`}
                >
                  <Text style={styles.prevResultDate}>{dateStr}</Text>
                  <Text style={styles.prevResultTime}>{item.time}s</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.closeButtonWrapper}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowResults(false)}
          >
            <Text style={styles.closeButtonText}>&#10005;</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  prevResults: {
    overflow: "hidden",
    justifyContent: "start",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#1c1c1c",
  },
  modalHeader: {
    width: "100%",
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },
  sectionHeader: {
    width: "100%",
    paddingTop: 32,
    color: "white",
    textAlign: "center",
    fontSize: 24,
    paddingBottom: 24,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
    borderColor: "white",
  },
  resultsScroll: {
    backgroundColor: "rgba(56, 56, 56, 1)",
    overflow: "hidden",
    width: "100%",
    // height: '50%',
  },
  resultsScrollWrapper: {
    flexDirection: "column-reverse",
  },
  resultWrapper: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(255,255, 255, 0.1)",
  },
  resultWrapper2: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  prevResultDate: {
    color: "rgba(255,255,255,0.5)",
  },
  prevResultTime: {
    fontSize: 24,
    color: "white",
  },
  closeButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderTopColor: "white",
    borderTopWidth: 2,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: "100%",
    marginVertical: 16,
  },
  closeButtonText: {
    fontSize: 24,
    textAlign: "center",
    color: "white",
  },
});
