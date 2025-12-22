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
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  setName: (name: string) => void;
  setSets: (sets: string) => void;
  setReps: (reps: string) => void;
}

export function ExerciseTemplateModal({
  visible,
  onClose,
  onSave,
  setName,
  setSets,
  setReps,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView style={styles.modalBg}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Exercise</Text>

          <TextInput
            placeholder="Name"
            style={styles.input}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Sets"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={setSets}
          />
          <TextInput
            placeholder="Reps"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={setReps}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText} onPress={onSave}>
                Save
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
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
