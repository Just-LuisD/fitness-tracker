import { ExerciseTemplate, WorkoutTemplate } from "@/src/database/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlatList, Pressable, Text, View } from "react-native";

interface Props {
  workoutTemplates: WorkoutTemplate[];
  exerciseTemplates: Map<number, ExerciseTemplate[]>;
  onDeleteWorkoutTemplate: (id: number) => void;
  setAddingExerciseTemplate: (value: boolean) => void;
  setNewExerciseWorkoutId: (value: number) => void;
  setNewExerciseName: (value: string) => void;
  setNewExerciseSets: (value: number) => void;
  setNewExerciseReps: (value: number) => void;
}

export default function WorkoutTemplateList({
  workoutTemplates,
  exerciseTemplates,
  onDeleteWorkoutTemplate,
  setAddingExerciseTemplate,
  setNewExerciseWorkoutId,
  setNewExerciseName,
  setNewExerciseSets,
  setNewExerciseReps,
}: Props) {
  return (
    <FlatList
      data={workoutTemplates}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {item.name} {item.workout_number}
          </Text>
          <Pressable onPress={() => onDeleteWorkoutTemplate(item.id)}>
            <MaterialIcons name="delete" size={24} color="black" />
          </Pressable>
          <Pressable
            onPress={() => {
              setAddingExerciseTemplate(true);
              setNewExerciseWorkoutId(item.id);
              setNewExerciseName("");
              setNewExerciseSets(0);
              setNewExerciseReps(0);
            }}
          >
            <MaterialIcons name="add" size={24} color="black" />
          </Pressable>
          {exerciseTemplates.get(item.id)?.map((exerciseTemplate, index) => (
            <View key={index}>
              <Text>{exerciseTemplate.name}</Text>
              <Text>{exerciseTemplate.default_sets}</Text>
              <Text>{exerciseTemplate.default_reps}</Text>
            </View>
          ))}
          {exerciseTemplates.get(item.id)?.length === 0 && (
            <Text>No exercises added yet</Text>
          )}
        </View>
      )}
    />
  );
}
