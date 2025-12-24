import { ExerciseTemplate, WorkoutTemplate } from "@/src/database/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

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
      style={styles.list}
      data={workoutTemplates}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <WorkoutTemplateListItem
          item={item}
          exerciseTemplates={exerciseTemplates.get(item.id) ?? []}
          onDeleteWorkoutTemplate={onDeleteWorkoutTemplate}
          setAddingExerciseTemplate={setAddingExerciseTemplate}
          setNewExerciseWorkoutId={setNewExerciseWorkoutId}
          setNewExerciseName={setNewExerciseName}
          setNewExerciseSets={setNewExerciseSets}
          setNewExerciseReps={setNewExerciseReps}
        />
      )}
    />
  );
}

interface WorkoutTemplateListItemProps {
  item: WorkoutTemplate;
  exerciseTemplates: ExerciseTemplate[];
  onDeleteWorkoutTemplate: (id: number) => void;
  setAddingExerciseTemplate: (value: boolean) => void;
  setNewExerciseWorkoutId: (value: number) => void;
  setNewExerciseName: (value: string) => void;
  setNewExerciseSets: (value: number) => void;
  setNewExerciseReps: (value: number) => void;
}

function WorkoutTemplateListItem({
  item,
  exerciseTemplates,
  onDeleteWorkoutTemplate,
  setAddingExerciseTemplate,
  setNewExerciseWorkoutId,
  setNewExerciseName,
  setNewExerciseSets,
  setNewExerciseReps,
}: WorkoutTemplateListItemProps) {
  return (
    <View style={styles.listItem}>
      <View style={styles.listItemHeader}>
        <Text style={styles.listItemHeaderText} numberOfLines={1}>
          {`Day ${item.workout_number}: ${item.name}`}
        </Text>
        <Pressable onPress={() => {}}>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </Pressable>
        {/*
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
        */}
      </View>
      {exerciseTemplates.map((exerciseTemplate, index) => (
        <View key={index}>
          <Text>
            {`${exerciseTemplate.name}: ${exerciseTemplate.default_sets} sets ${exerciseTemplate.default_reps} reps`}
          </Text>
        </View>
      ))}
      {exerciseTemplates.length === 0 && <Text>No exercises added</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {},
  listItem: {},
  listItemHeader: {
    flexDirection: "row",
    alignContent: "center",
  },
  listItemHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  listItemBody: {},
});
