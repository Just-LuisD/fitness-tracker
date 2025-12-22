import { StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Calories() {
  return (
    <SafeAreaProvider style={styles.container}>
      <Text style={styles.title}>Calories</Text>
      <Text>Track your meals and macros</Text>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
});
