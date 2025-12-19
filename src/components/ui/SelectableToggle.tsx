import { Pressable, StyleSheet, Text, View } from "react-native";

type SelectableToggleProps = {
  isSelected: 0 | 1;
  onChange: (value: 0 | 1) => void;
  label: string;
  mode: "radio" | "checkbox";
};

export function SelectableToggle({
  isSelected,
  onChange,
  label,
  mode = "checkbox",
}: SelectableToggleProps) {
  return (
    <Pressable
      onPress={() => {
        onChange(isSelected === 0 ? 1 : 0);
      }}
      style={styles.container}
    >
      <View
        style={[
          styles.outer,
          mode === "radio" && styles.radioOuter,
          isSelected === 1 && styles.activeOuter,
        ]}
      >
        {isSelected === 1 && (
          <View
            style={[
              styles.inner,
              mode === "radio" ? styles.radioInner : styles.checkboxInner,
            ]}
          />
        )}
      </View>

      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },

  outer: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#888",
    justifyContent: "center",
    alignItems: "center",
  },

  radioOuter: {
    borderRadius: 11,
  },

  inner: {
    backgroundColor: "#000",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  checkboxInner: {
    width: 12,
    height: 12,
  },

  activeOuter: {
    borderColor: "#000",
  },

  label: {
    fontSize: 16,
  },

  disabled: {
    opacity: 0.4,
  },
});
