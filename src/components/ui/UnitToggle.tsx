import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface Props {
  value: "kg" | "lb";
  onChange: (unit: "kg" | "lb") => void;
}

export function UnitToggle({ value, onChange }: Props) {
  const knobPosition = useSharedValue(value === "kg" ? 0 : 1);

  // Animate knob when the prop changes
  React.useEffect(() => {
    knobPosition.value = withSpring(value === "kg" ? 0 : 1, {
      damping: 80,
      stiffness: 700,
    });
  }, [value]);

  const animatedKnob = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: knobPosition.value * 50, // width of a segment
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.knob, animatedKnob]} />

      <Pressable style={styles.segment} onPress={() => onChange("kg")}>
        <Text style={[styles.label, value === "kg" && styles.active]}>kg</Text>
      </Pressable>

      <Pressable style={styles.segment} onPress={() => onChange("lb")}>
        <Text style={[styles.label, value === "lb" && styles.active]}>lb</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 40,
    backgroundColor: "#e5e5e5",
    borderRadius: 20,
    flexDirection: "row",
    overflow: "hidden",
    position: "relative",
  },
  segment: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  active: {
    color: "#000",
  },
  knob: {
    position: "absolute",
    width: 50,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    zIndex: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});
