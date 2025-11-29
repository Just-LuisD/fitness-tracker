import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  isVisible: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onSave: () => void;
  editingId: number | null;
  value: string;
  setValue: (val: string) => void;
  unit: "lb" | "kg";
  setUnit: (unit: "lb" | "kg") => void;
}

export function WeightEntryModal({
  isVisible,
  onCancel,
  onDelete,
  onSave,
  editingId,
  value,
  setValue,
  unit,
  setUnit,
}: Props) {
  return (
    <Modal visible={isVisible} transparent animationType="slide">
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
            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>

          {editingId && (
            <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
              <Text style={styles.deleteBtnText}>Delete Entry</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
