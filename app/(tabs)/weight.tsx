import { UnitToggle } from "@/src/components/ui/UnitToggle";
import {
  addWeightEntry,
  deleteWeightEntry,
  getWeightEntries,
  updateWeightEntry,
} from "@/src/services/weightService";
import { convertWeight } from "@/src/utils/weightConversion";
import { useFont } from "@shopify/react-native-skia";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartesianChart, Line, Scatter } from "victory-native";

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

  function toggleUnit() {
    setDisplayUnit((prev) => (prev === "lb" ? "kg" : "lb"));
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

  let weightList;
  if (entries.length === 0) {
    weightList = (
      <Text style={styles.noEntriesText}>No weight entries yet.</Text>
    );
  } else {
    weightList = (
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.entry}
            onPress={() => openEditModal(item)}
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

  const font = useFont(require("../../assets/fonts/Inter_18pt-Medium.ttf"), 12);
  let chart;

  if (!font || entries.length === 0) {
    chart = null;
  } else {
    chart = (
      <View style={{ height: 350 }}>
        <CartesianChart
          data={data}
          xKey="day"
          yKeys={["y"]}
          domainPadding={{ left: 12, right: 12, top: 12, bottom: 12 }}
          xAxis={{}}
          yAxis={[
            {
              font: font,
              formatYLabel: (v) => `${v} ${displayUnit}`, // or e.g. `${v} lbs`
              labelColor: "#555",
            },
          ]}
        >
          {({ points }) => (
            // 👇 and we'll use the Line component to render a line path.
            <>
              <Line points={points.y} color="#000" strokeWidth={2} />
              <Scatter points={points.y} color="black" radius={5} />
            </>
          )}
        </CartesianChart>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.container}>
        {chart}
        {entries.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <UnitToggle value={displayUnit} onChange={setDisplayUnit} />
          </View>
        )}
        {weightList}
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnText}>+ Add Weight</Text>
        </TouchableOpacity>
        <Modal visible={modalVisible} transparent animationType="slide">
          <KeyboardAvoidingView style={styles.modalBg}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingId ? "Edit Entry" : "Add Entry"}
              </Text>

              <TextInput
                placeholder="Weight"
                keyboardType="numeric"
                value={value}
                onChangeText={setValue}
                style={styles.input}
              />

              <View style={styles.unitRow}>
                <TouchableOpacity
                  onPress={() => setUnit("lb")}
                  style={[styles.unitBtn, unit === "lb" && styles.unitSelected]}
                >
                  <Text>Lb</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setUnit("kg")}
                  style={[styles.unitBtn, unit === "kg" && styles.unitSelected]}
                >
                  <Text>Kg</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>

              {editingId && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteBtnText}>Delete Entry</Text>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </Modal>
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
  entry: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 8,
  },
  entryValue: { fontSize: 18, fontWeight: "bold" },
  entryDate: { color: "#555" },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  unitRow: { flexDirection: "row", marginBottom: 12 },
  unitBtn: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  unitSelected: { backgroundColor: "#ddd" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  saveBtn: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  saveBtnText: { color: "#fff", textAlign: "center" },
  cancelBtn: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999",
    flex: 1,
  },
  deleteBtn: {
    marginTop: 20,
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
  },
  deleteBtnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  noEntriesText: {
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 20,
    color: "#555",
    flex: 1,
  },
});
