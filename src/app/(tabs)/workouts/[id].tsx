import CustomTextInput from "@/src/components/CustomTextInput";
import {
  ExerciseTemplate,
  TrainingProgram,
  WorkoutTemplate,
} from "@/src/database/types";
import { ExerciseTemplateModal } from "@/src/features/trainingPrograms/components/ExerciseTemplateModal";
import WorkoutTemplateList from "@/src/features/trainingPrograms/components/WorkoutTemplateList";
import {
  addExerciseTemplate,
  addWorkoutTemplate,
  deleteTrainingProgram,
  deleteWorkoutTemplate,
  getExerciseTemplates,
  getTrainingProgram,
  getWorkoutTemplates,
} from "@/src/features/trainingPrograms/services/workoutService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WorkoutDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const [trainingProgram, setTrainingProgram] =
    useState<TrainingProgram | null>(null);
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(
    []
  );
  const [exerciseTemplates, setExerciseTemplates] = useState<
    Map<number, ExerciseTemplate[]>
  >(new Map());
  const [addingWorkoutTemplate, setAddingWorkoutTemplate] = useState(false);
  const [newWorknoutName, setNewWorkoutName] = useState("");
  const [addingExerciseTemplate, setAddingExerciseTemplate] = useState(false);
  const [newExerciseWorkoutId, setNewExerciseWorkoutId] = useState(0);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseSets, setNewExerciseSets] = useState(0);
  const [newExerciseReps, setNewExerciseReps] = useState(0);

  async function deleteWorkout() {
    await deleteTrainingProgram(db, parseInt(params.id));
    router.dismissTo("/workouts");
  }

  async function load() {
    const data = (await getTrainingProgram(
      db,
      parseInt(params.id)
    )) as TrainingProgram;
    setTrainingProgram(data);
    const templates = (await getWorkoutTemplates(
      db,
      parseInt(params.id)
    )) as WorkoutTemplate[];
    setWorkoutTemplates(templates);

    const allExerciseTemplates = new Map<number, ExerciseTemplate[]>();
    for (const workoutTemplate of templates) {
      const exerciseTemplates = (await getExerciseTemplates(
        db,
        workoutTemplate.id
      )) as ExerciseTemplate[];
      allExerciseTemplates.set(workoutTemplate.id, exerciseTemplates);
    }
    setExerciseTemplates(allExerciseTemplates);
  }

  useEffect(() => {
    load();
  }, []);

  async function addNewWorkoutTemplate(name: string) {
    await addWorkoutTemplate(
      db,
      parseInt(params.id),
      workoutTemplates.length + 1,
      name
    );
    setAddingWorkoutTemplate(false);
    load();
  }

  async function handleDeleteWorkoutTemplate(id: number) {
    await deleteWorkoutTemplate(db, id);
    load();
  }

  async function addNewExerciseTemplate() {
    if (newExerciseName === "") return;
    if (newExerciseSets === 0 || newExerciseReps === 0) return;
    const index = exerciseTemplates.get(newExerciseWorkoutId)?.length || 0;
    await addExerciseTemplate(
      db,
      newExerciseWorkoutId,
      newExerciseName,
      newExerciseSets,
      newExerciseReps,
      index
    );
    setAddingExerciseTemplate(false);
    load();
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Training program info */}
      <Text>Workout Details Screen</Text>
      <Text>{params.id}</Text>
      <Text>{trainingProgram?.name}</Text>
      <Text>{trainingProgram?.start_date}</Text>

      <WorkoutTemplateList
        workoutTemplates={workoutTemplates}
        exerciseTemplates={exerciseTemplates}
        onDeleteWorkoutTemplate={handleDeleteWorkoutTemplate}
        setAddingExerciseTemplate={setAddingExerciseTemplate}
        setNewExerciseWorkoutId={setNewExerciseWorkoutId}
        setNewExerciseName={setNewExerciseName}
        setNewExerciseSets={setNewExerciseSets}
        setNewExerciseReps={setNewExerciseReps}
      />

      {addingWorkoutTemplate && (
        <CustomTextInput
          placeholder="Name"
          value={newWorknoutName}
          onChangeText={setNewWorkoutName}
          onSubmit={() => addNewWorkoutTemplate(newWorknoutName)}
        />
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          setAddingWorkoutTemplate(true);
          setNewWorkoutName("");
        }}
      >
        <Text style={styles.addBtnText}>+ Add Workout Template</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addBtn} onPress={deleteWorkout}>
        <Text style={styles.addBtnText}>Delete Trainig Program</Text>
      </TouchableOpacity>

      {addingExerciseTemplate && (
        <ExerciseTemplateModal
          visible={addingExerciseTemplate}
          onClose={() => setAddingExerciseTemplate(false)}
          onSave={addNewExerciseTemplate}
          setName={setNewExerciseName}
          setSets={(sets) => setNewExerciseSets(parseInt(sets))}
          setReps={(reps) => setNewExerciseReps(parseInt(reps))}
        />
      )}
    </View>
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
