import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectableToggle } from "./SelectableToggle";

interface Props {
  isVisible: boolean;
  onCancel: () => void;
  onSave: () => void;
  startDate: Date;
  isActive: 0 | 1;
  setName: (val: string) => void;
  setStartDate: (val: Date) => void;
  setIsActive: (val: 0 | 1) => void;
}

export function TrainingProgramModal({
  isVisible,
  onCancel,
  onSave,
  startDate,
  isActive,
  setName,
  setStartDate,
  setIsActive,
}: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | null | undefined
  ) => {
    if (!selectedDate) return;
    const currentDate = selectedDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <KeyboardAvoidingView style={styles.modalBg}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Training Program</Text>

          <TextInput
            placeholder="Name"
            onChangeText={setName}
            style={styles.input}
          />

          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 12,
              marginVertical: 12,
            }}
            onPress={() => {
              setShowDatePicker(true);
            }}
          >
            <FontAwesome5 name="calendar-alt" size={24} color="black" />
            <Text>{startDate.toLocaleString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={startDate} mode="date" onChange={onChange} />
          )}

          <SelectableToggle
            label="Active"
            isSelected={isActive}
            onChange={setIsActive}
            mode="checkbox"
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
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
