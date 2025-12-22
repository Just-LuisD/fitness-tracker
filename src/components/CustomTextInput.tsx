import AntDesign from "@expo/vector-icons/AntDesign";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (name: string) => void;
}

export default function CustomTextInput({
  placeholder,
  value,
  onChangeText,
  onSubmit,
}: Props) {
  /*
  TODO: Make this work for different screen sizes and keyboard heights
  at the moment it is hardcoded to 90
  const keyboardHeight = useKeyboardHeight();
  const screenHeight = Dimensions.get("screen").height;
  const verticalOffset = screenHeight - keyboardHeight;
  console.log("keyboardHeight:", keyboardHeight);
  console.log("screenHeight:", screenHeight);
  console.log("verticalOffset:", verticalOffset);
  */
  const verticalOffset = 90;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={verticalOffset}
      style={styles.container}
    >
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => onSubmit(value)}
      >
        <AntDesign name="check-circle" size={24} color="black" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "80%",
    marginVertical: 10,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: "black",
  },
  submitBtn: {
    marginVertical: "auto",
  },
});
