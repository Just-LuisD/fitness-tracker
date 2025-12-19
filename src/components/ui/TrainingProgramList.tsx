import { TrainingProgram } from "@/src/database/types";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  entries: TrainingProgram[];
  onPressEntry: (entry: TrainingProgram) => void;
}

export function TrainingProgramList({ entries, onPressEntry }: Props) {
  if (entries.length === 0) {
    return <Text>No training programs available.</Text>;
  } else {
    return (
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.entry, item.is_active === 1 && styles.activeEntry]}
            onPress={() => onPressEntry(item)}
          >
            <Text style={styles.entryValue}>{item.name}</Text>
            <Text style={styles.entryDate}>
              {new Date(item.start_date).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  activeEntry: {
    backgroundColor: "#008cff3a",
  },
  entry: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 8,
  },
  entryValue: { fontSize: 18, fontWeight: "bold" },
  entryDate: { color: "#555" },
});
