import { StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Workouts() {
  return (
    <SafeAreaProvider style={styles.container}>
      <Text style={styles.title}>Workouts</Text>
      <Text>Create and track your workouts here</Text>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
});
