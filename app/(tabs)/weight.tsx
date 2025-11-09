import { StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Weight() {
  return (
    <SafeAreaProvider style={styles.container}>
      <Text style={styles.title}>Weight</Text>
      <Text>Track daily weight and see your trends</Text>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
});
