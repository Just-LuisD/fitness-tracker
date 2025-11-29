export type WeightUnit = "kg" | "lb";

export interface WeightEntry {
  id: number;
  weight: number;
  unit: WeightUnit;
  date: string; // ISO 8601
}

export interface TrainingProgram {
  id: number;
  name: string;
  start_date: string; // ISO 8601
  is_active: 0 | 1;
}

export interface WorkoutTemplate {
  id: number;
  program_id: number;
  workout_number: number;
  name: string;
}

export interface ExerciseTemplate {
  id: number;
  workout_template_id: number;
  name: string;
  default_sets: number;
  default_reps: number;
  order_index: number;
}

export interface LoggedWorkout {
  id: number;
  date: string; // ISO 8601
  notes?: string | null;
  workout_template_id: number | null;
}

export interface LoggedExercise {
  id: number;
  logged_workout_id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  order_index: number;
}
