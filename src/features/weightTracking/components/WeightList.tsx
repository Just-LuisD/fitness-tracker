import { WeightEntry } from "@/src/database/types";
import { convertWeight } from "@/src/utils/weightConversion";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  entries: WeightEntry[];
  displayUnit: "lb" | "kg";
  onPressEntry: (entry: WeightEntry) => void;
}

export function WeightList({ entries, displayUnit, onPressEntry }: Props) {
  if (entries.length === 0) {
    return <Text>No weight entries available.</Text>;
  } else {
    return (
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.entry}
            onPress={() => onPressEntry(item)}
          >
            <Text style={styles.entryValue}>
              {convertWeight(item.weight, item.unit, displayUnit).toFixed(2)}{" "}
              {displayUnit}
            </Text>
            <Text style={styles.entryDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  entry: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 8,
  },
  entryValue: { fontSize: 18, fontWeight: "bold" },
  entryDate: { color: "#555" },
});
