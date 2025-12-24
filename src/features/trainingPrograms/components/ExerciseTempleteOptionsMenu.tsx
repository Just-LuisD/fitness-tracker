import { Ionicons } from "@expo/vector-icons";
import { MenuView } from "@react-native-menu/menu";
import { Pressable } from "react-native";

type Props = {
  addExercise: () => void;
  onDelete: () => void;
};

export function ExerciseTempleteOptionsMenu({ addExercise, onDelete }: Props) {
  return (
    <MenuView
      title="Options"
      onPressAction={({ nativeEvent }) => {
        switch (nativeEvent.event) {
          case "addExercise":
            addExercise();
            break;
          case "delete":
            onDelete();
            break;
        }
      }}
      actions={[
        {
          id: "addExercise",
          title: "Add Exercise",
          image: "pencil",
        },
        {
          id: "delete",
          title: "Delete",
          attributes: {
            destructive: true,
          },
          image: "trash",
        },
      ]}
    >
      <Pressable hitSlop={10}>
        <Ionicons name="ellipsis-vertical" size={20} />
      </Pressable>
    </MenuView>
  );
}
