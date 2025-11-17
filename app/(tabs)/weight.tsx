import {
  addWeightEntry,
  deleteWeightEntry,
  getWeightEntries,
  updateWeightEntry,
} from "@/src/services/weightService";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function WeightScreen() {
  const db = useSQLiteContext();

  const [entries, setEntries] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"lb" | "kg">("lb");

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

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnText}>+ Add Weight</Text>
        </TouchableOpacity>

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
                {item.weight} {item.unit}
              </Text>
              <Text style={styles.entryDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalBg}>
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
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  addBtn: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  addBtnText: { color: "#fff", fontWeight: "bold" },
  entry: {
    padding: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 10,
  },
  entryValue: { fontSize: 18, fontWeight: "bold" },
  entryDate: { color: "#555" },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
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
});
