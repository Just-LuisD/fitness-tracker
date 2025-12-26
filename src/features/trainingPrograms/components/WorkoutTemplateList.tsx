import { ExerciseTemplate, WorkoutTemplate } from "@/src/database/types";
import { ExerciseTempleteOptionsMenu } from "@/src/features/trainingPrograms/components/ExerciseTempleteOptionsMenu";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

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
  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<WorkoutTemplate>) => {
    return (
      <Pressable
        onLongPress={drag}
        disabled={isActive}
        style={{ backgroundColor: isActive ? "#eee" : "#fff" }}
      >
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
      </Pressable>
    );
  };

  return (
    <DraggableFlatList
      style={styles.list}
      data={workoutTemplates}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      onDragEnd={({ data }) => {
        // setData(data);
        // onReorder(data);
      }}
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
  function handleAddExercise() {
    setAddingExerciseTemplate(true);
    setNewExerciseWorkoutId(item.id);
    setNewExerciseName("");
    setNewExerciseSets(0);
    setNewExerciseReps(0);
  }

  function handleDeleteWorkoutTemplate() {
    Alert.alert(
      "Delete Program",
      "This will delete the program and all workouts.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteWorkoutTemplate(item.id),
        },
      ]
    );
  }

  return (
    <View style={styles.listItem}>
      <View style={styles.listItemHeader}>
        <Text style={styles.listItemHeaderText} numberOfLines={1}>
          {`Day ${item.workout_number}: ${item.name}`}
        </Text>
        <ExerciseTempleteOptionsMenu
          addExercise={handleAddExercise}
          onDelete={handleDeleteWorkoutTemplate}
        />
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
  list: {
    height: "70%",
  },
  listItem: {
    padding: 8,
  },
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
