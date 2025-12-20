import { TrainingProgramList } from "@/src/components/ui/TrainingProgramList";
import { TrainingProgramModal } from "@/src/components/ui/TrainingProgramModal";
import { TrainingProgram } from "@/src/database/types";
import {
  addTrainingProgram,
  getTrainingPrograms,
} from "@/src/services/workoutService";
import { useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Workouts() {
  const db = useSQLiteContext();

  const [trainingPrograms, setTrainingPrograms] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [programName, setProgramName] = useState("");
  const [programStartDate, setProgramStartDate] = useState(new Date());
  const [isProgramActive, setIsProgramActive] = useState<0 | 1>(0);
  const router = useRouter();

  async function load() {
    const data = await getTrainingPrograms(db);
    setTrainingPrograms(data);
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  function openAddModal() {
    setProgramName("");
    setProgramStartDate(new Date());
    setIsProgramActive(0);
    setModalVisible(true);
  }

  async function handleSave() {
    if (!programName.trim()) return;
    if (!programStartDate) return;

    await addTrainingProgram(
      db,
      programName,
      programStartDate.toString(),
      isProgramActive
    );
    setModalVisible(false);
    load();
  }

  function handleTrainingProgramPress(program: TrainingProgram) {
    router.push({ pathname: "/workouts/[id]", params: { id: program.id } });
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.container}>
        <TrainingProgramList
          entries={trainingPrograms}
          onPressEntry={handleTrainingProgramPress}
        ></TrainingProgramList>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
        <Text style={styles.addBtnText}>+ Add Trainig Program</Text>
      </TouchableOpacity>
      <TrainingProgramModal
        isVisible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
        startDate={programStartDate}
        isActive={isProgramActive}
        setName={setProgramName}
        setStartDate={setProgramStartDate}
        setIsActive={setIsProgramActive}
      />
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
