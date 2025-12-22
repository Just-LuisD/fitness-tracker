import { UnitToggle } from "@/src/components/UnitToggle";
import { WeightEntryModal } from "@/src/features/weightTracking/components/WeightEntryModal";
import { WeightList } from "@/src/features/weightTracking/components/WeightList";
import { WeightScatterPlot } from "@/src/features/weightTracking/components/WeightScatterPlot";
import {
  addWeightEntry,
  deleteWeightEntry,
  getWeightEntries,
  updateWeightEntry,
} from "@/src/features/weightTracking/services/weightService";
import { convertWeight } from "@/src/utils/weightConversion";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function WeightScreen() {
  const db = useSQLiteContext();

  const [entries, setEntries] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const [displayUnit, setDisplayUnit] = useState<"lb" | "kg">("lb");

  async function load() {
    const data = await getWeightEntries(db);
    setEntries(data);
  }

  useEffect(() => {
    load();
  }, []);

  function openAddModal() {
    setEditingId(null);
    setValue("");
    setUnit("lb");
    setModalVisible(true);
  }

  function openEditModal(entry: any) {
    setEditingId(entry.id);
    setValue(String(entry.weight));
    setUnit(entry.unit);
    setModalVisible(true);
  }

  async function handleSave() {
    if (!value.trim()) return;

    if (editingId === null) {
      await addWeightEntry(db, Number(value), unit);
    } else {
      await updateWeightEntry(db, editingId, Number(value), unit);
    }

    setModalVisible(false);
    load();
  }

  async function handleDelete() {
    if (editingId != null) {
      await deleteWeightEntry(db, editingId);
      setModalVisible(false);
      load();
    }
  }

  const data = entries
    .map((entry) => ({
      day: new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      y: convertWeight(entry.weight, entry.unit, displayUnit),
    }))
    .reverse();

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.container}>
        <WeightScatterPlot data={data} displayUnit={displayUnit} />
        {entries.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <UnitToggle value={displayUnit} onChange={setDisplayUnit} />
          </View>
        )}
        <WeightList
          entries={entries}
          displayUnit={displayUnit}
          onPressEntry={openEditModal}
        />
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnText}>+ Add Weight</Text>
        </TouchableOpacity>
        <WeightEntryModal
          isVisible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSave={handleSave}
          onDelete={handleDelete}
          value={value}
          setValue={setValue}
          unit={unit}
          setUnit={setUnit}
          editingId={editingId}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  addBtn: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 2,
  },
  addBtnText: { color: "#fff", fontWeight: "bold" },
});
